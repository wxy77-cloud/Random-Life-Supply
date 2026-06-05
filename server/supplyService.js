import OpenAI from 'openai';
import { createSupplyCard } from '../src/services/supplyGenerator.js';
import { buildSupplyMessages, supplyCardSchema } from './supplyPrompt.js';

const DEFAULT_MODEL = 'gpt-5-nano';
const MAX_COMPLETION_TOKENS = 500;

function createMockCard(params) {
  const card = createSupplyCard(params);
  return card
    ? {
        ...card,
        title: clampText(card.title, 20, '今日补给'),
        content: ensureContentLength(clampText(card.content, 180, '先给自己一点安静的空间，再继续往前走。')),
        tags: normalizeList(card.tags, params.topic, 5),
        modes: normalizeList(card.modes, params.mode, 3),
        source: 'mock'
      }
    : null;
}

function normalizeAiCard(card, params) {
  const title = clampText(card.title, 20, '今日补给');
  const content = clampText(card.content, 180, '先给自己一点安静的空间，再继续往前走。');
  const modes = normalizeList(card.modes, params.mode, 3);

  return {
    id: `ai-${Date.now()}`,
    type: params.type,
    title,
    content: ensureContentLength(content),
    tags: normalizeList(card.tags, params.topic, 5),
    modes,
    mode: params.mode,
    topic: params.topic,
    matched: true,
    generatedAt: Date.now(),
    source: 'openai'
  };
}

function clampText(value, maxLength, fallback) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  return text ? Array.from(text).slice(0, maxLength).join('') : fallback;
}

function ensureContentLength(content) {
  if (Array.from(content).length >= 50) return content;
  return `${content} 可以先从一个很小的动作开始，给今天留一点余地，也给自己一点重新靠近生活的时间。`;
}

function normalizeList(value, fallback, limit) {
  const items = Array.isArray(value) ? value : [];
  const cleaned = items.map((item) => String(item).trim()).filter(Boolean);
  const unique = [...new Set([fallback, ...cleaned])];
  return unique.slice(0, limit);
}

function parseJsonObject(text) {
  const trimmed = String(text ?? '').trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('模型没有返回 JSON 对象');
    return JSON.parse(match[0]);
  }
}

function hasUnsafeContent(card) {
  const text = `${card.title ?? ''} ${card.content ?? ''} ${(card.tags ?? []).join(' ')}`;
  const unsafeWords = ['自杀', '自残', '毒品', '赌博', '色情', '暴力', '武器', '违法', '犯罪'];
  return unsafeWords.some((word) => text.includes(word));
}

async function createOpenAiCard(params) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
    timeout: 18000
  });

  let response;
  const preferSchema = process.env.OPENAI_RESPONSE_FORMAT === 'json_schema';

  try {
    response = await createChatCompletion(client, params, preferSchema ? getJsonSchemaFormat() : { type: 'json_object' });
  } catch (error) {
    console.warn('Preferred JSON mode failed, retrying with simpler JSON mode:', error);
    response = await createChatCompletion(client, params, preferSchema ? { type: 'json_object' } : null);
  }

  const content = response.choices?.[0]?.message?.content;
  const parsedCard = parseJsonObject(content);

  if (hasUnsafeContent(parsedCard)) {
    throw new Error('模型返回内容未通过安全词检查');
  }

  return normalizeAiCard(parsedCard, params);
}

function getJsonSchemaFormat() {
  return {
    type: 'json_schema',
    json_schema: {
      name: 'supply_card',
      strict: true,
      schema: supplyCardSchema
    }
  };
}

function createChatCompletion(client, params, responseFormat) {
  const request = {
    model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
    messages: buildSupplyMessages(params),
    temperature: 0.8,
    max_completion_tokens: MAX_COMPLETION_TOKENS
  };

  if (responseFormat) {
    request.response_format = responseFormat;
  }

  return client.chat.completions.create(request);
}

export async function generateSupplyCard(params) {
  if (!process.env.OPENAI_API_KEY) {
    return createMockCard(params);
  }

  try {
    return await createOpenAiCard(params);
  } catch (error) {
    console.error('OpenAI generation failed, falling back to mock:', error);
    return createMockCard(params);
  }
}
