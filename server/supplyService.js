import { createSupplyCard } from '../src/services/supplyGenerator.js';
import { buildSupplyMessages } from './supplyPrompt.js';

const DEFAULT_MODEL = 'gpt-5-nano';
const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_TIMEOUT_MS = 50000;

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
  const { title, content } = parseAiText(text);

  return {
    id: `ai-${Date.now()}`,
    type: params.type,
    title,
    content,
    tags: [params.topic],
    modes: [params.mode],
    mode: params.mode,
    topic: params.topic,
    matched: true,
    generatedAt: Date.now(),
    source: 'openai'
  };
}

function parseAiText(text) {
  const rawText = String(text ?? '').trim();
  const titleMatch = rawText.match(/标题[:：]\s*(.+)/);
  const contentMatch = rawText.match(/正文[:：]\s*([\s\S]+)/);

  if (titleMatch || contentMatch) {
    return {
      title: clampText(titleMatch?.[1], 20, 'AI 补给'),
      content: clampText(contentMatch?.[1], 500, rawText || '先给自己一点安静的空间，再继续往前走。')
    };
  }

  const [firstLine, ...restLines] = rawText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const fallbackContent = restLines.length > 0 ? restLines.join(' ') : rawText;

  return {
    title: clampText(firstLine, 20, 'AI 补给'),
    content: clampText(fallbackContent, 500, '先给自己一点安静的空间，再继续往前走。')
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
  const response = await createChatCompletion(params);
  const content = response.choices?.[0]?.message?.content;

  if (!String(content ?? '').trim()) {
    throw new Error('模型返回空内容');
  }

  if (hasUnsafeContent(content)) {
    throw new Error('模型返回内容未通过安全词检查');
  }

  return normalizeAiText(content, params);
}

export function getChatCompletionsUrl() {
  const baseUrl = (process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');

  if (baseUrl.endsWith('/chat/completions')) {
    return baseUrl;
  }

  return `${baseUrl}/chat/completions`;
}

export function getPublicUrlLabel(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return 'invalid-url';
  }
}

export function getProviderErrorInfo(error) {
  return {
    name: error?.name,
    message: error?.message,
    causeName: error?.cause?.name,
    causeMessage: error?.cause?.message,
    causeCode: error?.cause?.code,
    causeErrno: error?.cause?.errno,
    causeSyscall: error?.cause?.syscall,
    causeHostname: error?.cause?.hostname
  };
}

export async function createChatCompletion(params) {
  const url = getChatCompletionsUrl();
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const timeoutMs = Number(process.env.OPENAI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  console.log(`Calling model provider: model=${model}, url=${getPublicUrlLabel(url)}, timeout=${timeoutMs}ms`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: buildSupplyMessages(params)
      }),
      signal: controller.signal
    });

    const text = await response.text();

    console.log(`Model provider responded: status=${response.status}, elapsed=${Date.now() - startedAt}ms`);

    if (!response.ok) {
      throw new Error(`模型接口返回 ${response.status}: ${text.slice(0, 500)}`);
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`模型接口没有返回合法 JSON: ${text.slice(0, 500)}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateSupplyCard(params) {
  if (!process.env.OPENAI_API_KEY) {
    console.log('OPENAI_API_KEY is missing, using mock supply.');
    return createMockCard(params);
  }

  try {
    return await createOpenAiCard(params);
  } catch (error) {
    console.error('OpenAI generation failed, falling back to mock:', getProviderErrorInfo(error));
    return createMockCard(params);
  }
}
