const assert = require('node:assert/strict');

const app = require('../api/index');

const server = app.listen(0, async () => {
  const { port } = server.address();
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.status, 'ok');
    assert.equal(typeof payload.version, 'string');

    const searchResponse = await fetch(`http://127.0.0.1:${port}/api/curiosities?q=canal&limit=1`);
    const searchPayload = await searchResponse.json();
    assert.equal(searchResponse.status, 200);
    assert.equal(searchPayload.meta.count, 1);
    assert.equal(searchPayload.data[0].slug, 'passage-bleu');

    const missingResponse = await fetch(`http://127.0.0.1:${port}/api/curiosities/missing`);
    assert.equal(missingResponse.status, 404);

    console.log('API tests passed');
    server.close();
  } catch (error) {
    server.close(() => process.exitCode = 1);
    console.error(error);
  }
});
