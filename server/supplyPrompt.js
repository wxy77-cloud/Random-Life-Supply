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
      content: `请根据用户选择生成一张补给卡。用户当前模式：${mode}。用户关注主题：${topic}。补给类型：${typeLabel}。请输出两行：第一行以“标题：”开头，标题不超过20个中文字符；第二行以“正文：”开头，正文200字以内。不要 JSON，不要 Markdown。`
    }
  ];
}
