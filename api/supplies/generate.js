import { createSupplyCard } from '../../src/services/supplyGenerator.js';

export default function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: '只支持 POST 请求' });
    return;
  }

  const card = createSupplyCard(request.body ?? {});

  if (!card) {
    response.status(404).json({ error: '没有找到对应类型的补给内容' });
    return;
  }

  response.status(200).json({ card });
}
