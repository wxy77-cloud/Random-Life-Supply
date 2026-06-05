import OpenAI from 'openai';
import { createSupplyCard } from '../src/services/supplyGenerator.js';
import { buildSupplyMessages } from './supplyPrompt.js';

const DEFAULT_MODEL = 'gpt-5-nano';

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

function normalizeAiText(text, params) {
  return {
    id: `ai-${Date.now()}`,
    type: params.type,
    title: 'AI 补给',
    content: clampText(text, 200, '先给自己一点安静的空间，再继续往前走。'),
    tags: [params.topic],
    modes: [params.mode],
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

function hasUnsafeContent(text) {
  const unsafeWords = ['自杀', '自残', '毒品', '赌博', '色情', '暴力', '武器', '违法', '犯罪'];
  return unsafeWords.some((word) => String(text ?? '').includes(word));
}

async function createOpenAiCard(params) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
    timeout: Number(process.env.OPENAI_TIMEOUT_MS) || 12000
  });

  const response = await createChatCompletion(client, params);
  const content = response.choices?.[0]?.message?.content;

  if (!String(content ?? '').trim()) {
    throw new Error('模型返回空内容');
  }

  if (hasUnsafeContent(content)) {
    throw new Error('模型返回内容未通过安全词检查');
  }

  return normalizeAiText(content, params);
}

function createChatCompletion(client, params) {
  return client.chat.completions.create({
    model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
    messages: buildSupplyMessages(params)
  });
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
