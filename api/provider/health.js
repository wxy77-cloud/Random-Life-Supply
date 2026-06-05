import {
  createChatCompletion,
  getChatCompletionsUrl,
  getProviderErrorInfo,
  getPublicUrlLabel
} from '../../server/supplyService.js';

async function probeProviderOrigin() {
  const url = new URL(getChatCompletionsUrl());
  const startedAt = Date.now();

  try {
    const result = await fetch(url.origin, {
      method: 'HEAD',
      signal: AbortSignal.timeout(8000)
    });

    return {
      ok: true,
      status: result.status,
      elapsedMs: Date.now() - startedAt
    };
  } catch (error) {
    return {
      ok: false,
      elapsedMs: Date.now() - startedAt,
      error: getProviderErrorInfo(error)
    };
  }
}

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
  const originProbe = await probeProviderOrigin();

  try {
    const result = await createChatCompletion({
      type: 'question',
      mode: '随便逛逛',
      topic: '生活'
    });

    response.status(200).json({
      ok: true,
      elapsedMs: Date.now() - startedAt,
      originProbe,
      url: getPublicUrlLabel(getChatCompletionsUrl()),
      model: process.env.OPENAI_MODEL || 'gpt-5-nano',
      sample: result.choices?.[0]?.message?.content ?? ''
    });
  } catch (error) {
    response.status(200).json({
      ok: false,
      elapsedMs: Date.now() - startedAt,
      originProbe,
      url: getPublicUrlLabel(getChatCompletionsUrl()),
      model: process.env.OPENAI_MODEL || 'gpt-5-nano',
      error: getProviderErrorInfo(error)
    });
  }
}
