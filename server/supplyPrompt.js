export const typeLabels = {
  action: '一件可以做的小事',
  knowledge: '一个有趣知识',
  story: '一个故事碎片',
  question: '一个今日问题',
  idea: '一个奇妙灵感'
};

export const supplyCardSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'content', 'tags', 'modes'],
  properties: {
    title: {
      type: 'string',
      description: '不超过 20 个中文字符的短标题'
    },
    content: {
      type: 'string',
      description: '50 到 180 个中文字符之间的正文'
    },
    tags: {
      type: 'array',
      minItems: 1,
      maxItems: 5,
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
};

export function buildSupplyMessages({ type, mode, topic }) {
  const typeLabel = typeLabels[type] ?? type;

  return [
    {
      role: 'system',
      content: [
        '你是“随机人生补给站”的补给卡生成器。',
        '你只生成安全、温柔、适合青少年阅读的中文内容。',
        '不要生成危险、违法、成人、暴力、自伤、仇恨、过度负面、恐吓或不适合青少年的内容。',
        '不要提供医疗、法律、金融等高风险建议。',
        '必须只返回 JSON 对象，不要 Markdown，不要代码块，不要解释。'
      ].join('\n')
    },
    {
      role: 'user',
      content: [
        '请生成一张像“随机灵感便利店小票”的补给卡。',
        '风格：温柔、安静、具体、有一点探索感，不鸡汤，不夸张。',
        `用户当前模式：${mode}`,
        `用户关注主题：${topic}`,
        `补给类型：${typeLabel}`,
        '字段要求：',
        '- title：不超过 20 个中文字符。',
        '- content：50 到 180 个中文字符。',
        '- tags：1 到 5 个中文标签，优先包含用户关注主题。',
        '- modes：1 到 3 个模式，优先包含用户当前模式。',
        '返回 JSON 格式：{"title":"...","content":"...","tags":["..."],"modes":["..."]}'
      ].join('\n')
    }
  ];
}
