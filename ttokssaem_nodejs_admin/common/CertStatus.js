/*
 * 사이트 SSL 인증서 상태 확인
 *
 * 인증서 파일을 직접 읽지 않고, 이 서버의 nginx(기본 127.0.0.1:443)에 사이트 이름(SNI)으로
 * TLS 접속해서 nginx가 실제로 내보내는 인증서를 확인한다.
 * - /etc/letsencrypt 는 root 전용이라 Node 프로세스가 읽을 수 없고
 * - 실제 서비스 중인 인증서를 보는 쪽이 더 정확하기 때문이다.
 *
 * 어떤 경우에도 예외를 던지지 않는다. 확인이 안 되면 status 'unknown'으로 돌려준다.
 * 로그인이나 다른 화면 동작과는 완전히 분리되어 있다.
 *
 * 환경 변수(모두 선택)
 *   CERT_CHECK_HOSTS : 확인할 사이트 목록(쉼표 구분)
 *   CERT_CHECK_ADDR  : 접속할 주소. 기본 127.0.0.1 (같은 서버의 nginx)
 *   CERT_CHECK_PORT  : 기본 443
 */
var tls = require('tls');
var fs = require('fs');

var DEFAULT_HOSTS = [
	'qkg1g5.ttokssaem.com',
	'api.ttokssaem.com',
	'pushserver.ttokssaem.com',
	'ttokssaem.com',
	'www.ttokssaem.com',
];

var WARN_DAYS = 30; // 이하이면 주의
var DANGER_DAYS = 7; // 이하이면 위험
var TIMEOUT_MS = 3000;
var CACHE_OK_MS = 60 * 60 * 1000; // 정상 결과는 1시간 캐시
var CACHE_FAIL_MS = 5 * 60 * 1000; // 실패 결과는 5분만 캐시(복구가 빨리 보이도록)
var DAY_MS = 24 * 60 * 60 * 1000;

var cache = {};
var inFlight = {};
var caList = null;

function getHosts() {
	var env = process.env.CERT_CHECK_HOSTS;
	if (env && env.trim() !== '') {
		return env
			.split(',')
			.map(function (h) { return h.trim(); })
			.filter(function (h) { return h !== ''; });
	}
	return DEFAULT_HOSTS.slice();
}

// Node 내장 루트 인증서 + 서버 OS의 루트 인증서(있으면).
// 새로 나온 루트를 Node 18 내장 목록이 아직 모를 때를 대비한다.
function getCA() {
	if (caList) return caList;
	var list = tls.rootCertificates.slice();
	var files = ['/etc/ssl/certs/ca-certificates.crt', '/etc/pki/tls/certs/ca-bundle.crt'];
	for (var i = 0; i < files.length; i++) {
		try {
			list.push(fs.readFileSync(files[i], 'utf8'));
			break;
		} catch (e) {
			// 없으면 내장 목록만 쓴다
		}
	}
	caList = list;
	return caList;
}

function firstValue(v) {
	return Array.isArray(v) ? v[0] : v;
}

function issuerName(cert) {
	var issuer = (cert && cert.issuer) || {};
	var o = firstValue(issuer.O) || '';
	var cn = firstValue(issuer.CN) || '';
	var ou = firstValue(issuer.OU) || '';
	return { o: o, cn: cn, ou: ou, text: [o, cn].filter(Boolean).join(' ') };
}

function isCloudflareOrigin(cert) {
	var n = issuerName(cert);
	return /cloudflare/i.test(n.o + ' ' + n.cn + ' ' + n.ou) && /origin/i.test(n.o + ' ' + n.cn + ' ' + n.ou);
}

var ERROR_TEXT = {
	CERT_HAS_EXPIRED: '인증서 만료',
	CERT_NOT_YET_VALID: '아직 유효 기간 전',
	DEPTH_ZERO_SELF_SIGNED_CERT: '자체 서명 인증서',
	SELF_SIGNED_CERT_IN_CHAIN: '체인에 자체 서명 인증서',
	UNABLE_TO_VERIFY_LEAF_SIGNATURE: '중간 인증서 누락',
	UNABLE_TO_GET_ISSUER_CERT_LOCALLY: '발급자를 확인할 수 없음',
	UNABLE_TO_GET_ISSUER_CERT: '발급자를 확인할 수 없음',
	ERR_TLS_CERT_ALTNAME_INVALID: '도메인 불일치',
};

/*
 * 접속 결과를 화면용 상태로 바꾼다(순수 함수, 테스트 대상).
 * status: ok | warn | danger | expired | error | proxy | unknown
 */
function classify(host, cert, authError, now) {
	now = now || Date.now();
	var r = {
		host: host,
		status: 'unknown',
		days: null,
		validTo: null,
		issuer: '',
		message: '',
		checkedAt: new Date(now).toISOString(),
	};

	if (!cert || !cert.valid_to) {
		r.message = '인증서를 받지 못함';
		return r;
	}

	var validTo = new Date(cert.valid_to);
	var validFrom = cert.valid_from ? new Date(cert.valid_from) : null;
	r.validTo = isNaN(validTo.getTime()) ? null : validTo.toISOString();
	r.issuer = issuerName(cert).text;
	r.days = r.validTo ? Math.floor((validTo.getTime() - now) / DAY_MS) : null;

	if (r.validTo && validTo.getTime() <= now) {
		r.status = 'expired';
		r.message = '인증서 만료';
		return r;
	}
	if (validFrom && !isNaN(validFrom.getTime()) && validFrom.getTime() > now) {
		r.status = 'error';
		r.message = '아직 유효 기간 전';
		return r;
	}

	// Cloudflare 원본 인증서는 Cloudflare만 믿는다. 주황 구름(프록시)일 때만 정상이다.
	if (isCloudflareOrigin(cert)) {
		r.status = 'proxy';
		r.message = 'Cloudflare 전용 인증서 (주황 구름일 때만 정상)';
		return r;
	}

	if (authError) {
		r.status = 'error';
		r.message = ERROR_TEXT[authError] || String(authError);
		return r;
	}

	if (r.days === null) {
		r.message = '만료일을 읽지 못함';
		return r;
	}
	if (r.days <= DANGER_DAYS) r.status = 'danger';
	else if (r.days <= WARN_DAYS) r.status = 'warn';
	else r.status = 'ok';
	r.message = '만료까지 ' + r.days + '일';
	return r;
}

function unknownResult(host, message) {
	return {
		host: host,
		status: 'unknown',
		days: null,
		validTo: null,
		issuer: '',
		message: message || '확인 불가',
		checkedAt: new Date().toISOString(),
	};
}

/*
 * 사이트 하나 확인. 항상 resolve 한다(reject 없음).
 */
function checkHost(host, opts) {
	opts = opts || {};
	var addr = opts.addr || process.env.CERT_CHECK_ADDR || '127.0.0.1';
	var port = parseInt(opts.port || process.env.CERT_CHECK_PORT || '443', 10);
	var timeout = opts.timeoutMs || TIMEOUT_MS;

	return new Promise(function (resolve) {
		var done = false;
		var socket = null;
		var timer = null;

		function finish(result) {
			if (done) return;
			done = true;
			if (timer) clearTimeout(timer);
			try {
				if (socket) socket.destroy();
			} catch (e) {
				// ignore
			}
			resolve(result);
		}

		timer = setTimeout(function () {
			finish(unknownResult(host, '확인 불가 (응답 시간 초과)'));
		}, timeout);

		try {
			socket = tls.connect({
				host: addr,
				port: port,
				servername: host,
				ca: opts.ca || getCA(),
				rejectUnauthorized: false, // 오류 인증서도 내용을 읽어서 사유를 보여 주기 위해
			});
		} catch (e) {
			finish(unknownResult(host, '확인 불가 (' + e.message + ')'));
			return;
		}

		socket.once('secureConnect', function () {
			try {
				var cert = socket.getPeerCertificate();
				var authError = socket.authorized ? null : socket.authorizationError;
				if (!authError && cert && cert.subject) {
					var idErr = tls.checkServerIdentity(host, cert);
					if (idErr) authError = 'ERR_TLS_CERT_ALTNAME_INVALID';
				}
				finish(classify(host, cert, authError ? String(authError.code || authError) : null, opts.now));
			} catch (e) {
				finish(unknownResult(host, '확인 불가 (' + e.message + ')'));
			}
		});

		socket.once('error', function (e) {
			finish(unknownResult(host, '확인 불가 (' + (e.code || e.message) + ')'));
		});
	});
}

function getCached(host, opts) {
	var hit = cache[host];
	var now = Date.now();
	if (hit && hit.expires > now) return Promise.resolve(hit.result);
	if (inFlight[host]) return inFlight[host];

	inFlight[host] = checkHost(host, opts)
		.then(function (result) {
			var ok = result.status !== 'unknown' && result.status !== 'error';
			cache[host] = { result: result, expires: Date.now() + (ok ? CACHE_OK_MS : CACHE_FAIL_MS) };
			return result;
		})
		.catch(function (e) {
			return unknownResult(host, '확인 불가 (' + e.message + ')');
		})
		.then(function (result) {
			delete inFlight[host];
			return result;
		});
	return inFlight[host];
}

/*
 * 전체 사이트 확인(캐시 사용). 항상 resolve 한다.
 */
function checkAll(opts) {
	var hosts = (opts && opts.hosts) || getHosts();
	return Promise.all(
		hosts.map(function (h) {
			return getCached(h, opts);
		}),
	).catch(function () {
		return hosts.map(function (h) { return unknownResult(h); });
	});
}

function clearCache() {
	cache = {};
	inFlight = {};
}

module.exports = {
	checkAll: checkAll,
	checkHost: checkHost,
	classify: classify,
	getHosts: getHosts,
	clearCache: clearCache,
	WARN_DAYS: WARN_DAYS,
	DANGER_DAYS: DANGER_DAYS,
};
