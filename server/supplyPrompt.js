export const typeLabels = {
  action: '一件可以做的小事',
  knowledge: '一个有趣知识',
  story: '一个故事碎片',
  question: '一个今日问题',
  idea: '一个奇妙灵感'
};

export function buildSupplyMessages({ type, mode, topic }) {
  const typeLabel = typeLabels[type] ?? type;

  return [
    {
      role: 'system',
      content: '你是“随机人生补给站”的补给生成器。请用中文输出安全、温和、适合青少年阅读的内容。不要输出危险、违法、成人、自伤、仇恨或过度负面的内容。'
    },
    {
      role: 'user',
      content: `请根据用户选择生成一段 200 字以内的补给内容。直接返回内容正文，不要 JSON，不要 Markdown，不要标题。用户当前模式：${mode}。用户关注主题：${topic}。补给类型：${typeLabel}。`
    }
  ];
}
