const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

test('notification requests run concurrently and skip polls while an earlier request is pending', () => {
  const requests = [], intervals = [], html = new Map();
  let ready;
  const document = {};
  const $ = selector => selector === document ? { ready(fn) { ready = fn; } } : {
    html(value) { html.set(selector, value); }, toast() {},
  };
  $.ajax = options => requests.push(options);
  const context = { $, document, Date, setInterval(fn, ms) { intervals.push({ fn, ms }); } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../public/js/memo.js'), 'utf8'), context);
  ready();
  assert.equal(requests.length, 3);
  assert.deepEqual(requests.map(r => r.url), ['/v1/checkMemo', '/v1/checkM2M', '/v1/checkRequestTest']);
  assert.ok(requests.every(r => r.async === true && r.timeout === 10000));
  intervals.forEach(timer => timer.fn());
  assert.equal(requests.length, 3);
  requests[1].success({ code: 0, data: { count: 2, lists: [] } });
  assert.equal(html.get('#newcount3'), 2);
  assert.equal(context.code, undefined);
  requests[1].complete();
  intervals.find(timer => timer.ms === 10000).fn();
  assert.equal(requests.length, 4);
  // Completion also occurs on timeout/error, so the next interval can retry.
  requests[3].complete();
  intervals.find(timer => timer.ms === 10000).fn();
  assert.equal(requests.length, 5);
});

test('access log includes middleware wait and full response duration', async () => {
  const express = require('express');
  const rfs = require('rotating-file-stream');
  const saved = rfs.createStream;
  const lines = [];
  rfs.createStream = () => ({ write(line) { lines.push(line); } });
  const app = express();
  try { require('../config/morgan')(app); } finally { rfs.createStream = saved; }
  app.use((req, res, next) => setTimeout(next, 30));
  app.get('/timing', (req, res) => {
    res.write('start');
    setTimeout(() => res.end('end'), 30);
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try {
    const response = await fetch('http://127.0.0.1:' + server.address().port + '/timing');
    await response.text();
    assert.equal(lines.length, 1);
    const match = lines[0].match(/response_ms=([\d.]+) total_ms=([\d.]+)/);
    assert.ok(match, lines[0]);
    assert.ok(Number(match[1]) >= 20);
    assert.ok(Number(match[2]) >= Number(match[1]) + 20);
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
