import OpenAI from 'openai';
import { createSupplyCard } from '../src/services/supplyGenerator.js';

const DEFAULT_MODEL = 'gpt-5-nano';

const typeLabels = {
  action: '一件可以做的小事',
  knowledge: '一个有趣知识',
  story: '一个故事碎片',
  question: '一个今日问题',
  idea: '一个奇妙灵感'
};

function createMockCard(params) {
  const card = createSupplyCard(params);
  return card ? { ...card, source: 'mock' } : null;
}

function normalizeAiCard(card, params) {
  return {
    id: `ai-${Date.now()}`,
    type: params.type,
    title: String(card.title ?? '').trim() || '今日补给',
    content: String(card.content ?? '').trim() || '先给自己一点安静的空间，再继续往前走。',
    tags: Array.isArray(card.tags) && card.tags.length > 0 ? card.tags.slice(0, 4) : [params.topic],
    modes: Array.isArray(card.modes) && card.modes.length > 0 ? card.modes : [params.mode],
    mode: params.mode,
    topic: params.topic,
    matched: true,
    generatedAt: Date.now(),
    source: 'openai'
  };
}

function buildPrompt({ type, mode, topic }) {
  return [
    '你是“随机人生补给站”的补给生成器。',
    '请生成一张像随机灵感便利店小票一样的补给卡，温柔、安静、有一点探索感。',
    '内容要具体、有画面感，但不要鸡汤、不要夸张。',
    `用户当前模式：${mode}`,
    `用户关注主题：${topic}`,
    `补给类型：${typeLabels[type] ?? type}`,
    '请严格返回符合 schema 的 JSON。'
  ].join('\n');
}

async function createOpenAiCard(params) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL
  });

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
    input: buildPrompt(params),
    text: {
      format: {
        type: 'json_schema',
        name: 'supply_card',
        strict: true,
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['title', 'content', 'tags', 'modes'],
          properties: {
            title: {
              type: 'string',
              description: '不超过 18 个中文字的短标题'
            },
            content: {
              type: 'string',
              description: '一段 60 到 120 个中文字的补给正文'
            },
            tags: {
              type: 'array',
              minItems: 1,
              maxItems: 4,
              items: {
                type: 'string'
              }
            },
            modes: {
              type: 'array',
              minItems: 1,
              maxItems: 3,
              items: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  });

  return normalizeAiCard(JSON.parse(response.output_text), params);
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
