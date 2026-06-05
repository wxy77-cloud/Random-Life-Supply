export async function generateSupply({ type, mode, topic, currentId }) {
  const response = await fetch('/api/supplies/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ type, mode, topic, currentId })
  });

  if (!response.ok) {
    throw new Error('生成补给失败');
  }

  const data = await response.json();
  return data.card;
}
