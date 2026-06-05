import { createChatCompletion, getChatCompletionsUrl, getPublicUrlLabel } from '../../server/supplyService.js';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.status(405).json({ error: '只支持 GET 请求' });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    response.status(200).json({
      ok: false,
      reason: 'OPENAI_API_KEY is missing',
      url: getPublicUrlLabel(getChatCompletionsUrl())
    });
    return;
  }

  const startedAt = Date.now();

  try {
    const result = await createChatCompletion({
      type: 'question',
      mode: '随便逛逛',
      topic: '生活'
    });

    response.status(200).json({
      ok: true,
      elapsedMs: Date.now() - startedAt,
      url: getPublicUrlLabel(getChatCompletionsUrl()),
      model: process.env.OPENAI_MODEL || 'gpt-5-nano',
      sample: result.choices?.[0]?.message?.content ?? ''
    });
  } catch (error) {
    response.status(200).json({
      ok: false,
      elapsedMs: Date.now() - startedAt,
      url: getPublicUrlLabel(getChatCompletionsUrl()),
      model: process.env.OPENAI_MODEL || 'gpt-5-nano',
      errorName: error.name,
      errorMessage: error.message
    });
  }
}
