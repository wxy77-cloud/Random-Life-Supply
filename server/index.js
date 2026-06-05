import { createSupplyCard } from '../src/services/supplyGenerator.js';

const PORT = 3001;

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  });
  response.end(JSON.stringify(data));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function handleGenerate(request, response) {
  const payload = await readJsonBody(request);
  const card = createSupplyCard(payload);

  if (!card) {
    sendJson(response, 404, { error: '没有找到对应类型的补给内容' });
    return;
  }

  sendJson(response, 200, { card });
}

async function handleRequest(request, response) {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  if (request.method === 'GET' && request.url === '/api/health') {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === 'POST' && request.url === '/api/supplies/generate') {
    await handleGenerate(request, response);
    return;
  }

  sendJson(response, 404, { error: '接口不存在' });
}

const server = await import('node:http').then(({ createServer }) => createServer(handleRequest));

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Supply API is running at http://127.0.0.1:${PORT}`);
});
