export const typeLabels = {
  action: '一件可以做的小事',
  knowledge: '一个有趣知识',
  story: '一个故事碎片',
  question: '一个今日问题',
  idea: '一个奇妙灵感'
};

export const modeDescriptions = {
  静候缘分: '用户暂时不想强行改变什么，适合轻柔、开放、带一点偶遇感的内容。',
  低迷时刻: '用户能量偏低，适合安抚、减压、可立刻开始的小内容，不要催促或说教。',
  灵感唤醒: '用户想被点亮一点创造力，适合具体、有画面感、能引出行动或联想的内容。',
  好奇探索: '用户想了解世界或打开视野，适合轻知识、观察角度、微小发现。',
  随便逛逛: '用户没有明确目标，适合轻松、日常、像偶然路过便利店货架一样的内容。'
};

export const topicDescriptions = {
  生活: '日常、空间、习惯、身体感受、微小秩序。',
  情绪: '心情、压力、恢复、安定、和自己相处。',
  创造: '写作、画面、想象、表达、灵感触发。',
  学习: '知识、记忆、理解、练习、好奇心。',
  关系: '沟通、陪伴、边界、善意、真实表达。',
  世界: '自然、城市、文化、科学、观察世界的方式。'
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
  const modeDescription = modeDescriptions[mode] ?? '根据用户当前状态，生成温和、具体、不过度用力的内容。';
  const topicDescription = topicDescriptions[topic] ?? '自然融入用户关注主题。';

  return [
    {
      role: 'system',
      content: [
        '你是“随机人生补给站”的补给卡生成器。',
        '你的任务是生成一张简短、温柔、具体、有一点探索感的中文补给卡。',
        '这里不负责改变人生，也不急着给出答案，只提供一小份适合当下查看的补给。',
        '你只生成安全、温和、适合青少年阅读的内容。',
        '不要生成危险、违法、成人、暴力、自伤、仇恨、过度负面、恐吓或不适合青少年的内容。',
        '不要提供医疗、法律、金融等高风险建议。',
        '不要使用 Markdown。',
        '不要输出解释性文字。',
        '不要输出代码块。',
        '只返回一个 JSON 对象。',
        'JSON 必须严格包含且只包含这些字段：title, content, tags, modes。',
        '不要缺字段，不要多字段，不要把 JSON 包在字符串里。'
      ].join('\n')
    },
    {
      role: 'user',
      content: [
        '请生成一张像“随机灵感便利店小票”的补给卡。',
        '',
        `用户当前模式：${mode}`,
        `模式理解：${modeDescription}`,
        `用户关注主题：${topic}`,
        `主题理解：${topicDescription}`,
        `补给类型：${typeLabel}`,
        '',
        '补给类型理解：',
        '- 一件可以做的小事：给出低门槛、可立即完成的小行动。',
        '- 一个有趣知识：给出安全、轻巧、可信但不需要引用来源的小知识。',
        '- 一个故事碎片：给出一小段有画面感的虚构片段，不要恐怖或沉重。',
        '- 一个今日问题：提出一个温和、可自我观察的问题，不要逼问。',
        '- 一个奇妙灵感：给出一个可用于创作、观察或日常实验的小灵感。',
        '',
        '字段要求：',
        '1. title：字符串，不超过 20 个中文字符。',
        '2. content：字符串，50 到 180 个中文字符。',
        '3. tags：数组，1 到 5 个中文标签，必须包含用户关注主题。',
        '4. modes：数组，1 到 3 个模式名称，必须包含用户当前模式。',
        '5. 内容要具体，不要空泛鸡汤。',
        '6. 语气温柔、安静，但不要过度煽情。',
        '7. 可以自然融合关注主题，但不要生硬堆砌。',
        '8. 不要出现危险、违法、成人、血腥暴力、自我伤害、仇恨、羞辱、恐吓内容。',
        '9. 不要提供医疗、法律、金融等高风险建议。',
        '',
        '只返回如下 JSON 结构，不要添加任何其他文字：',
        '{"title":"窗边的微光","content":"把今天最想完成的事写成一句很短的话，贴在你容易看见的地方。不必立刻完成，只让它安静地陪你一会儿，等精神回来时再靠近。","tags":["生活","情绪"],"modes":["低迷时刻"]}'
      ].join('\n')
    }
  ];
}
