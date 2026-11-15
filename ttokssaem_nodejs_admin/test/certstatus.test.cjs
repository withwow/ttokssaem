const test = require('node:test');
const assert = require('node:assert/strict');
const tls = require('node:tls');
const net = require('node:net');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const CertStatus = require('../common/CertStatus');

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.parse('2026-11-15T00:00:00Z');
const cert = (daysLeft, issuer = { O: "Let's Encrypt", CN: 'YR1' }) => ({
  valid_from: new Date(NOW - 10 * DAY).toUTCString(),
  valid_to: new Date(NOW + daysLeft * DAY + 3600 * 1000).toUTCString(),
  issuer,
  subject: { CN: 'qkg1g5.ttokssaem.com' },
});

test('classify: days left decide ok / warn / danger', () => {
  const ok = CertStatus.classify('a', cert(90), null, NOW);
  assert.equal(ok.status, 'ok');
  assert.equal(ok.days, 90);
  assert.equal(ok.message, '만료까지 90일');
  assert.equal(CertStatus.classify('a', cert(30), null, NOW).status, 'warn');
  assert.equal(CertStatus.classify('a', cert(8), null, NOW).status, 'warn');
  assert.equal(CertStatus.classify('a', cert(7), null, NOW).status, 'danger');
  assert.equal(CertStatus.classify('a', cert(0), null, NOW).status, 'danger');
});

test('classify: expired, verification errors, Cloudflare origin cert, missing cert', () => {
  assert.equal(CertStatus.classify('a', cert(-2), 'CERT_HAS_EXPIRED', NOW).status, 'expired');
  const bad = CertStatus.classify('a', cert(60), 'ERR_TLS_CERT_ALTNAME_INVALID', NOW);
  assert.equal(bad.status, 'error');
  assert.equal(bad.message, '도메인 불일치');
  const cf = CertStatus.classify('a', cert(5000, { O: 'CloudFlare, Inc.', OU: 'CloudFlare Origin CA', CN: 'CloudFlare Origin Certificate' }), 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY', NOW);
  assert.equal(cf.status, 'proxy');
  assert.equal(CertStatus.classify('a', {}, null, NOW).status, 'unknown');
  assert.equal(CertStatus.classify('a', null, null, NOW).status, 'unknown');
});

test('host list comes from CERT_CHECK_HOSTS when set', () => {
  const saved = process.env.CERT_CHECK_HOSTS;
  process.env.CERT_CHECK_HOSTS = ' a.example.com, ,b.example.com ';
  assert.deepEqual(CertStatus.getHosts(), ['a.example.com', 'b.example.com']);
  delete process.env.CERT_CHECK_HOSTS;
  assert.ok(CertStatus.getHosts().includes('qkg1g5.ttokssaem.com'));
  if (saved !== undefined) process.env.CERT_CHECK_HOSTS = saved;
});

test('connection refused and timeout resolve as unknown instead of throwing', async () => {
  // 닫힌 포트
  const srv = net.createServer();
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const closedPort = srv.address().port;
  await new Promise(r => srv.close(r));
  const refused = await CertStatus.checkHost('x.example.com', { addr: '127.0.0.1', port: closedPort });
  assert.equal(refused.status, 'unknown');

  // 접속은 받지만 TLS 응답을 하지 않는 서버
  const sockets = [];
  const silent = net.createServer(s => sockets.push(s));
  await new Promise(r => silent.listen(0, '127.0.0.1', r));
  const started = Date.now();
  const slow = await CertStatus.checkHost('x.example.com', { addr: '127.0.0.1', port: silent.address().port, timeoutMs: 300 });
  assert.equal(slow.status, 'unknown');
  assert.match(slow.message, /시간 초과/);
  assert.ok(Date.now() - started < 2000);
  sockets.forEach(s => s.destroy());
  await new Promise(r => silent.close(r));
});

function hasOpenssl() {
  try { execFileSync('openssl', ['version'], { stdio: 'ignore' }); return true; } catch { return false; }
}

test('live TLS: trusted cert is ok, wrong name is error', { skip: !hasOpenssl() && 'openssl not installed' }, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'certstatus-'));
  const key = path.join(dir, 'key.pem');
  const crt = path.join(dir, 'cert.pem');
  execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', key, '-out', crt,
    '-days', '45', '-subj', '/CN=good.example.com', '-addext', 'subjectAltName=DNS:good.example.com'], { stdio: 'ignore' });
  const pem = fs.readFileSync(crt, 'utf8');
  const server = tls.createServer({ key: fs.readFileSync(key), cert: pem }, s => s.end());
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  try {
    // 테스트용 인증서를 신뢰 목록에 넣으면 정상
    const ok = await CertStatus.checkHost('good.example.com', { addr: '127.0.0.1', port, ca: [pem] });
    assert.equal(ok.status, 'ok');
    assert.ok(ok.days >= 44 && ok.days <= 45);
    // 이름이 다르면 도메인 불일치
    const wrong = await CertStatus.checkHost('other.example.com', { addr: '127.0.0.1', port, ca: [pem] });
    assert.equal(wrong.status, 'error');
    assert.equal(wrong.message, '도메인 불일치');
    // 신뢰 목록에 없으면 인증 오류
    const untrusted = await CertStatus.checkHost('good.example.com', { addr: '127.0.0.1', port, ca: tls.rootCertificates });
    assert.equal(untrusted.status, 'error');
  } finally {
    server.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('checkAll caches results and never rejects', async () => {
  CertStatus.clearCache();
  const srv = net.createServer();
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const port = srv.address().port;
  await new Promise(r => srv.close(r));
  const list = await CertStatus.checkAll({ hosts: ['a.example.com', 'b.example.com'], addr: '127.0.0.1', port });
  assert.equal(list.length, 2);
  assert.ok(list.every(r => r.status === 'unknown'));
  const again = await CertStatus.checkAll({ hosts: ['a.example.com'], addr: '127.0.0.1', port });
  assert.equal(again[0].checkedAt, list[0].checkedAt);
  CertStatus.clearCache();
});

test('header script renders badge with worst status and escapes text', () => {
  const vm = require('node:vm');
  const html = new Map(), classes = new Map();
  let ready, req;
  const el = sel => ({
    html(v) { html.set(sel, v); return this; },
    addClass(c) { classes.set(sel, c); return this; },
    removeClass() { classes.delete(sel); return this; },
  });
  const document = { hidden: false };
  const $ = s => (s === document ? { ready(fn) { ready = fn; } } : el(s));
  $.ajax = o => { req = o; };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../public/js/certstatus.js'), 'utf8'),
    { $, document, Date, String, isNaN, setInterval() {} });
  ready();
  assert.equal(req.url, '/v1/certStatus');
  req.success({ code: '0', data: { list: [
    { host: 'qkg1g5.ttokssaem.com', status: 'ok', message: '만료까지 89일', validTo: '2027-02-13T00:00:00Z', issuer: "Let's Encrypt" },
    { host: 'api.ttokssaem.com', status: 'proxy', message: 'Cloudflare 전용', validTo: null, issuer: '' },
    { host: '<b>x</b>', status: 'warn', message: '만료까지 20일', validTo: null, issuer: '' },
  ] } });
  assert.equal(html.get('#certStatusBadge'), 1);
  assert.equal(classes.get('#certStatusBadge'), 'bg-warning');
  assert.ok(html.get('#certStatusList').includes('&lt;b&gt;x&lt;/b&gt;'));
  assert.equal(html.get('#certStatusSummary'), '1개 사이트 확인 필요');
  req.error();
  assert.equal(html.get('#certStatusSummary'), '확인 불가');
});
