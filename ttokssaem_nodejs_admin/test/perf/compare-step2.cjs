'use strict';
/*
  어드민 성능 개선 2단계: 개발 전(dev)과 개발 후(이 브랜치) 쿼리 결과 비교 (읽기 전용)

  사용법 (저장소 루트에서, 작업 트리는 바꾸지 않음):
    git fetch origin dev claude/project-thread-hg3o79
    NODE_PATH=<mysql2, mybatis-mapper@0.6.5가 설치된 node_modules> \
      node <이 파일> <저장소 루트> [보고서 경로.md]

  - DB 접속 정보는 <저장소 루트>/ttokssaem_nodejs_admin/.env 의 MYSQL_* 값을 읽고, 출력하지 않는다.
  - XML 매퍼는 git show 로 두 버전을 읽어 각각 SQL을 만든다. OLD_REF, NEW_REF 환경변수로 바꿀 수 있다.
  - SELECT, EXPLAIN 이외의 문장은 실행하지 않는다(assertReadOnly). INSERT 문은 만들기만 하고 비교한다.
*/
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const mysql = require('mysql2/promise');
const mapper = require('mybatis-mapper');

const REPO = path.resolve(process.argv[2] || '.');
const OUT = path.resolve(process.argv[3] || 'compare-step2-report.md');
const OLD_REF = process.env.OLD_REF || 'origin/dev';
const NEW_REF = process.env.NEW_REF || 'origin/claude/project-thread-hg3o79';
const FMT = { language: 'sql', indent: '  ' };
const XMLS = ['notice', 'attendance', 'vocaexam', 'member', 'vocaplan', 'push'];
const HQ = 'BR00000000';

// ---------- 준비 ----------
function loadEnv(file) {
  const env = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
  return env;
}

function xmlFiles(ref, tag) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `cmp2-${tag}-`));
  return XMLS.map(x => {
    const body = execFileSync('git', ['-C', REPO, 'show', `${ref}:ttokssaem_nodejs_admin/xml/${x}.xml`]);
    const f = path.join(dir, `${x}.xml`);
    fs.writeFileSync(f, body);
    return f;
  });
}
const FILES = { old: xmlFiles(OLD_REF, 'old'), new: xmlFiles(NEW_REF, 'new') };
let loaded = null;

function toIntString(value, fallback) {
  const n = parseInt(value, 10);
  return String(isNaN(n) ? fallback : n);
}

// old: 기존 MAKESQL, new: 이 브랜치의 MAKESQL(LIMIT/OFFSET 정수화)
function render(ver, ns, id, param) {
  if (loaded !== ver) { mapper.createMapper(FILES[ver]); loaded = ver; }
  const p = JSON.parse(JSON.stringify(param));
  if (ver === 'new') {
    if (p.start !== undefined && p.start !== '') p.start = toIntString(p.start, 0);
    if (p.length !== undefined && p.length !== '') p.length = toIntString(p.length, 10);
  }
  return mapper.getStatement(ns, id, p, FMT);
}

function assertReadOnly(sql) {
  const s = sql.replace(/^(\s+|--[^\n]*\n|\/\*[\s\S]*?\*\/)+/, '');
  if (!/^(SELECT|EXPLAIN)\b/i.test(s)) throw new Error(`읽기 전용이 아닌 문장 차단: ${s.slice(0, 40)}`);
  if (/;\s*\S/.test(s)) throw new Error('여러 문장 차단');
}

let conn;
async function q(sql) {
  assertReadOnly(sql);
  const [rows] = await conn.query(sql);
  return rows;
}

// 실행 시간: 쿼리 캐시를 피하려고 SQL_NO_CACHE, 3회 중 중앙값
async function timed(sql, n = 3) {
  const nc = sql.replace(/^(\s*)SELECT\b/i, '$1SELECT SQL_NO_CACHE');
  let rows, err = null;
  const ms = [];
  for (let i = 0; i < n; i++) {
    const t = process.hrtime.bigint();
    try { rows = await q(nc); } catch (e) { err = e.code || e.message; break; }
    ms.push(Number(process.hrtime.bigint() - t) / 1e6);
  }
  ms.sort((a, b) => a - b);
  return { rows, err, ms: ms.length ? Math.round(ms[Math.floor(ms.length / 2)]) : null };
}

async function explain(sql) {
  try {
    const rows = await q(`EXPLAIN ${sql}`);
    return rows.map(r => `${r.table}:${r.type}:${r.key || '-'}:${r.rows}${/filesort|temporary/i.test(r.Extra || '') ? `(${(r.Extra.match(/Using (filesort|temporary)/g) || []).join(',')})` : ''}`).join(' / ');
  } catch (e) { return `EXPLAIN 실패 ${e.code || e.message}`; }
}

function norm(v) {
  if (v instanceof Date) return isNaN(v) ? 'InvalidDate' : v.toISOString();
  if (Buffer.isBuffer(v)) return v.toString('hex');
  return v;
}
function normRows(rows, drop = []) {
  return (rows || []).map(r => {
    const o = {};
    for (const k of Object.keys(r)) if (!drop.includes(k)) o[k] = norm(r[k]);
    return o;
  });
}
const hash = x => crypto.createHash('sha1').update(JSON.stringify(x)).digest('hex').slice(0, 10);
const yn = b => (b ? '같음' : '**다름**');

const report = [];
const summary = [];
const md = s => report.push(s);

// ---------- 본문 ----------
async function main() {
  const env = loadEnv(process.env.CMP_ENV || path.join(REPO, 'ttokssaem_nodejs_admin', '.env'));
  conn = await mysql.createConnection({
    host: env.MYSQL_HOST, port: env.MYSQL_PORT, user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD, database: env.MYSQL_DATABASE,
  });

  const oldSha = execFileSync('git', ['-C', REPO, 'rev-parse', '--short', OLD_REF]).toString().trim();
  const newSha = execFileSync('git', ['-C', REPO, 'rev-parse', '--short', NEW_REF]).toString().trim();
  const [{ ver }] = await q('SELECT VERSION() ver');
  md(`# 2단계 개발 전/후 쿼리 비교\n\n- 실행: ${new Date().toISOString()}\n- 개발 전: ${OLD_REF} (${oldSha}), 개발 후: ${NEW_REF} (${newSha})\n- DB 버전: ${ver}\n- 시간은 SQL_NO_CACHE 3회 중앙값(ms). 행 비교는 정렬 순서까지 포함한 전체 결과의 해시.\n`);

  const branches = (await q(`SELECT branchid, COUNT(*) c FROM ttokssaemdb.member
      WHERE type = 'S' AND classyn = 'Y' GROUP BY branchid ORDER BY c DESC LIMIT 3`)).map(r => r.branchid);
  const [{ k: term } = { k: '김' }] = await q(`SELECT LEFT(membername, 1) k, COUNT(*) c FROM ttokssaemdb.member
      WHERE membername IS NOT NULL AND membername <> '' GROUP BY k ORDER BY c DESC LIMIT 1`);
  md(`- 비교 지점: 재원생 많은 순 ${branches.join(', ')} + 본사(${HQ}), 검색어: '${term}'\n`);

  // ===== 2-1 =====
  md('## 2-1 공지·출결 목록 건수 (검색 없을 때 member 조인 제거)\n');
  for (const t of ['notice', 'attendance']) {
    const alias = t === 'notice' ? 'notice' : 'attend';
    const orphan = await q(`SELECT COUNT(*) c FROM ttokssaemdb.${t} ${alias}
        LEFT JOIN ttokssaemdb.member member ON ${alias}.memberid = member.memberid WHERE member.memberid IS NULL`);
    md(`- ${t}: member에 없는 회원의 행 ${orphan[0].c}건 (0이면 조인 제거 후에도 건수가 같아야 함)`);
  }
  md('\n| 쿼리 | 지점 | 검색 | 전 건수 | 후 건수 | 결과 | 전 ms | 후 ms | 후 EXPLAIN |\n|---|---|---|---:|---:|---|---:|---:|---|');
  let ok21 = true;
  for (const [ns, id] of [['notice', 'totCntNotice'], ['attendance', 'totCntAttendance']]) {
    for (const b of [...branches, HQ]) {
      for (const query of ['', term]) {
        const p = { session_branchid: b, query, sortorder: '', dir: '', start: '0', length: '10' };
        const so = render('old', ns, id, p), sn = render('new', ns, id, p);
        const o = await timed(so), n = await timed(sn);
        const same = !o.err && !n.err && o.rows[0].totcnt === n.rows[0].totcnt;
        ok21 = ok21 && same;
        md(`| ${id} | ${b} | ${query ? `'${query}'` : '없음'} | ${o.err || o.rows[0].totcnt} | ${n.err || n.rows[0].totcnt} | ${yn(same)} | ${o.ms} | ${n.ms} | ${query ? '(검색 시 SQL 동일)' : await explain(sn)} |`);
      }
    }
  }
  summary.push(`2-1 건수: ${ok21 ? '모두 같음' : '다른 경우 있음'}`);

  // ===== 2-2 =====
  md('\n## 2-2 단어시험 이력 목록 (전체 GROUP BY 파생 테이블 제거)\n');
  md('차수(degree)는 의도한 변경입니다. 전: 그 학생의 전체 기간 최대 차수, 후: 그 날짜(memodate)의 최대 차수. 그래서 degree를 뺀 나머지 열을 비교하고, degree가 바뀐 행 수를 따로 셉니다.\n');
  md('| 지점 | 경우 | 행 수(전/후) | degree 외 열 | degree 바뀐 행 | 전 ms | 후 ms |\n|---|---|---|---|---:|---:|---:|');
  let ok22 = true, degreeChanged = 0, degreeSample = null;
  const cases22 = [
    ['기본 정렬 1쪽', { sortorder: '', dir: '', start: '0', length: '10' }],
    ['기본 정렬 3쪽', { sortorder: '', dir: '', start: '20', length: '10' }],
    ['날짜 내림차순', { sortorder: 'memodate', dir: 'desc', start: '0', length: '10' }],
    ['이름 오름차순', { sortorder: 'membername', dir: 'asc', start: '0', length: '25' }],
    [`검색 '${term}'`, { sortorder: '', dir: '', start: '0', length: '10', query: term }],
    ['날짜 내림차순 전체(페이징 없음, id순 비교)', { sortorder: 'memodate', dir: 'desc', start: '', length: '', byId: true }],
  ];
  let explain22 = null;
  for (const b of branches) {
    for (const [label, extra] of cases22) {
      const p = { branchid: b, query: '', ...extra };
      delete p.byId;
      const so = render('old', 'vocaexam', 'selVocaExamList', p), sn = render('new', 'vocaexam', 'selVocaExamList', p);
      const o = await timed(so), n = await timed(sn);
      if (o.err || n.err) { ok22 = false; md(`| ${b} | ${label} | 오류 ${o.err || ''}/${n.err || ''} | | | | |`); continue; }
      if (extra.byId) { const byIdSort = (a, b2) => a.id - b2.id; o.rows.sort(byIdSort); n.rows.sort(byIdSort); }
      const sameRest = hash(normRows(o.rows, ['degree'])) === hash(normRows(n.rows, ['degree']));
      let tieOnly = false;
      if (!sameRest && extra.sortorder && !extra.byId) {
        // 정렬 열 값이 같은 행끼리 순서만 바뀐 경우(정렬 키가 유일하지 않을 때)
        const key = { memodate: 'memodate', membername: 'membername' }[extra.sortorder];
        const sortKeys = rows => rows.map(r => String(norm(r[key])));
        // 같은 날짜가 페이지 경계에 걸치면 어느 행이 들어오는지도 달라질 수 있어, 정렬 열 값의 순서만 본다.
        // 페이징 없는 경우(아래 '전체')에서 행 집합이 같은지 따로 확인한다.
        tieOnly = hash(sortKeys(o.rows)) === hash(sortKeys(n.rows));
      }
      const byId = new Map(o.rows.map(r => [r.id, r.degree]));
      const changed = n.rows.filter(r => byId.has(r.id) && byId.get(r.id) !== r.degree);
      degreeChanged += changed.length;
      if (!degreeSample && changed.length) degreeSample = { id: changed[0].id, memodate: norm(changed[0].memodate), before: byId.get(changed[0].id), after: changed[0].degree };
      ok22 = ok22 && (sameRest || tieOnly);
      if (!explain22) explain22 = { old: await explain(so), new: await explain(sn) };
      md(`| ${b} | ${label} | ${o.rows.length}/${n.rows.length} | ${sameRest ? '같음' : tieOnly ? '같음(동순위 순서만 다름)' : '**다름**'} | ${changed.length} | ${o.ms} | ${n.ms} |`);
    }
  }
  md(`\n- EXPLAIN 전: ${explain22 && explain22.old}\n- EXPLAIN 후: ${explain22 && explain22.new}`);
  if (degreeSample) md(`- degree 변경 예: id ${degreeSample.id}, ${degreeSample.memodate}: ${degreeSample.before} → ${degreeSample.after}`);
  summary.push(`2-2 목록: degree 외 ${ok22 ? '모두 같음' : '다른 경우 있음'}, degree 바뀐 행 ${degreeChanged}`);

  // ===== 2-5 =====
  md('\n## 2-5 전체·학생·학부모 공지 (대상자마다 INSERT → 일괄 INSERT)\n');
  md('대상자 조회 쿼리는 바뀌지 않았습니다. 푸시를 보낼 대상(push=Y, 토큰 있음)을 전: 회원마다 getMemberToken, 후: getMemberTokenList로 구해 같은지 봅니다. 토큰 값은 해시로만 비교합니다. INSERT는 실행하지 않습니다.\n');
  md('| 지점 | 보내기 | 알림 행 | 푸시(전) | 푸시(후) | 결과 | 전 쿼리 수 / ms | 후 쿼리 수 / ms |\n|---|---|---:|---:|---:|---|---|---|');
  let ok25 = true;
  for (const b of branches) {
    for (const [label, id] of [['학부모', 'selParentsMember'], ['학생', 'selStudentsMember'], ['전체', 'selAllMember']]) {
      const ids = (await q(render('new', 'member', id, { branchid: b }))).map(r => r.memberid);
      let t = Date.now();
      const oldPush = [];
      for (const memberid of ids) {
        const rs = await q(render('old', 'member', 'getMemberToken', { memberid }));
        if (rs.length === 1 && rs[0].pushtoken !== '') oldPush.push([memberid, rs[0].os, hash(rs[0].pushtoken)]);
      }
      const oldMs = Date.now() - t;
      t = Date.now();
      const tokens = {};
      const unique = Array.from(new Set(ids));
      let nq = 0;
      for (let i = 0; i < unique.length; i += 500) {
        nq++;
        for (const r of await q(render('new', 'member', 'getMemberTokenList', { memberids: unique.slice(i, i + 500) }))) tokens[r.memberid] = r;
      }
      const newPush = ids.filter(m => tokens[m] && tokens[m].pushtoken !== '').map(m => [m, tokens[m].os, hash(tokens[m].pushtoken)]);
      const newMs = Date.now() - t;
      const same = hash(oldPush) === hash(newPush);
      ok25 = ok25 && same;
      const nIns = Math.ceil(ids.length / 500);
      md(`| ${b} | ${label} | ${ids.length} | ${oldPush.length} | ${newPush.length} | ${yn(same)} | ${1 + ids.length * 2 + oldPush.length} / 조회 ${oldMs} | ${1 + nq + nIns * 2} / 조회 ${newMs} |`);
    }
  }
  // INSERT 문 값 비교: 전 insNotice/insPushsendmsg 를 대상자 수만큼 만든 것과, 후 insNoticeList/insPushsendmsgList 의 VALUES 묶음이 같은지
  const sample = [{ branchid: 'BRX', memberid: "a'1", category: 'B', title: '공지', message: "줄1\n'따옴표' \\ 끝" }, { branchid: 'BRX', memberid: 'b2', category: 'B', title: '공지', message: 'x' }];
  const tuples = s => (s.match(/VALUES\s*([\s\S]*)$/i)[1]).replace(/\s+/g, ' ').trim();
  const oldVals = sample.map(o => tuples(render('old', 'notice', 'insNotice', o))).join(', ');
  const newVals = tuples(render('new', 'notice', 'insNoticeList', { objs: sample }));
  const pushSample = [{ title: '공지', message: "m'1", pushtoken: 't1', linkurl: '', os: 'A', reserved: 'I' }, { title: '공지', message: 'm2', pushtoken: 't2', linkurl: '', os: 'I', reserved: 'I' }];
  const oldPv = pushSample.map(o => tuples(render('old', 'push', 'insPushsendmsg', o))).join(', ');
  const newPv = tuples(render('new', 'push', 'insPushsendmsgList', { objs: pushSample }));
  md(`\n- INSERT 값(따옴표·줄바꿈 포함 예시): notice ${yn(oldVals === newVals)}, pushsendmsg ${yn(oldPv === newPv)}`);
  if (oldVals !== newVals) md(`  - 전: \`${oldVals}\`\n  - 후: \`${newVals}\``);
  if (oldPv !== newPv) md(`  - 전: \`${oldPv}\`\n  - 후: \`${newPv}\``);
  ok25 = ok25 && oldVals === newVals && oldPv === newPv;
  summary.push(`2-5 공지: 푸시 대상·INSERT 값 ${ok25 ? '모두 같음' : '다른 경우 있음'}`);

  // ===== 2-6 =====
  md('\n## 2-6 매분 단어 배정 크론 (오늘 배정된 회원은 쿼리에서 제외)\n');
  const d = new Date(); d.setHours(d.getHours() - 2);
  const pad = x => String(x).padStart(2, '0');
  const memodate = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const dayofweek = d.getDay();
  const col = await q(`SELECT DATA_TYPE t FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'ttokssaemdb' AND TABLE_NAME = 'checkvocaplan' AND COLUMN_NAME = 'memodate'`);
  async function decide(ver, extra) {
    const t = Date.now();
    const rows = await q(render(ver, 'vocaplan', 'allVocaPlan', { memodate, dayofweek, ...extra }));
    const out = [];
    let memodateType = null;
    for (const r of rows) {
      const c = await q(render(ver, 'vocaplan', 'checkVocaPlan', { memodate, dayofweek, memberid: r.memberid }));
      let vocano = 0;
      if (c.length === 0) vocano = 1;
      else {
        memodateType = memodateType || (c[0].memodate instanceof Date ? 'Date' : typeof c[0].memodate);
        if (c[0].memodate != memodate) {
          if (c[0].vocalevel != r.vocalevel) vocano = 1;
          else if (c[0].lastyn == 'N') vocano = Number(c[0].vocano) + Number(r.targetcount);
          else vocano = 1;
        }
      }
      if (vocano != 0) out.push([r.memberid, r.vocaplanid, vocano]);
    }
    return { scanned: rows.length, assign: out, ms: Date.now() - t, queries: 1 + rows.length, memodateType };
  }
  const o6 = await decide('old', {}), n6 = await decide('new', { skipToday: true });
  const future = await q(`SELECT COUNT(DISTINCT memberid) c FROM ttokssaemdb.checkvocaplan WHERE memodate > '${memodate}'`);
  const same6 = hash(o6.assign) === hash(n6.assign);
  md(`- 기준: memodate ${memodate}, 요일 ${dayofweek} (크론과 같은 계산), checkvocaplan.memodate 타입 ${col[0] && col[0].t} / 드라이버 반환 ${o6.memodateType}`);
  md(`- 오늘보다 뒤 날짜 배정이 있는 회원: ${future[0].c}명 (전/후 판단이 갈릴 수 있는 유일한 경우)\n`);
  md('| | 조회 대상 | 배정할 회원 | 쿼리 수 | ms |\n|---|---:|---:|---:|---:|');
  md(`| 전 | ${o6.scanned} | ${o6.assign.length} | ${o6.queries} | ${o6.ms} |`);
  md(`| 후 | ${n6.scanned} | ${n6.assign.length} | ${n6.queries} | ${n6.ms} |`);
  md(`\n- 배정할 회원·단어 번호: ${yn(same6)}`);
  if (!same6) {
    const k = a => a.map(x => x.join(':'));
    const os_ = new Set(k(o6.assign)), ns_ = new Set(k(n6.assign));
    md(`  - 전에만: ${[...os_].filter(x => !ns_.has(x)).slice(0, 10).join(', ')}\n  - 후에만: ${[...ns_].filter(x => !os_.has(x)).slice(0, 10).join(', ')}`);
  }
  md(`- EXPLAIN 후 allVocaPlan: ${await explain(render('new', 'vocaplan', 'allVocaPlan', { memodate, dayofweek, skipToday: true }))}`);
  summary.push(`2-6 크론: 배정 대상 ${same6 ? '같음' : '다름'}, 쿼리 ${o6.queries} → ${n6.queries}`);

  // ===== 2-8 =====
  md('\n## 2-8 회원 목록 학생번호 검색 (${query} → #{query}), LIMIT/OFFSET 정수화\n');
  const col8 = await q(`SELECT DATA_TYPE t FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'ttokssaemdb' AND TABLE_NAME = 'member' AND COLUMN_NAME = 'memberno'`);
  const [s8] = await q(`SELECT memberno FROM ttokssaemdb.member WHERE branchid = '${branches[0]}' AND type = 'S' AND memberno IS NOT NULL ORDER BY memberid DESC LIMIT 1`);
  const no = s8 ? String(s8.memberno) : '1';
  md(`- member.memberno 타입: ${col8[0] && col8[0].t}, 예시 번호: ${no}\n`);
  md('| 쿼리 | 검색값 | 전 | 후 | 결과 |\n|---|---|---|---|---|');
  let ok28 = true;
  for (const id of ['totCntMember', 'selMemberList']) {
    for (const v of [no, `0${no}`, ' ' + no]) {
      const p = { session_branchid: branches[0], type: 'S', classyn: '', searchOption: 'student_no', query: v, sortorder: '', dir: '', start: '0', length: '10' };
      const o = await timed(render('old', 'member', id, p), 1), n = await timed(render('new', 'member', id, p), 1);
      const same = !o.err && !n.err && hash(normRows(o.rows)) === hash(normRows(n.rows));
      if (v === no) ok28 = ok28 && same;
      md(`| ${id} | '${v}' | ${o.err || `${o.rows.length}행`} | ${n.err || `${n.rows.length}행`} | ${yn(same)} |`);
    }
  }
  const inj = { session_branchid: branches[0], type: 'S', classyn: '', searchOption: 'student_no', query: '1 OR 1=1', sortorder: '', dir: '', start: '0 UNION SELECT 1', length: '10' };
  const injNew = render('new', 'member', 'selMemberList', inj).replace(/\s+/g, ' ');
  md(`\n- 주입 시도 값(실행하지 않고 SQL만 생성): 후 \`${(injNew.match(/memberno = [^ ]+ [^ ]+ [^ ]+/) || [''])[0]}\`, \`${(injNew.match(/LIMIT .*$/) || [''])[0].trim()}\``);
  const normal = { ...inj, query: no, start: '30' };
  const sameSql = render('old', 'member', 'selMemberList', { ...normal, searchOption: 'name' }) === render('new', 'member', 'selMemberList', { ...normal, searchOption: 'name' });
  md(`- 정상 값(start=30, length=10)에서 학생번호 외 목록 SQL: ${sameSql ? '전/후 문자열 동일' : '**다름**'}`);
  summary.push(`2-8 학생번호 검색: ${ok28 ? '같음' : '다름'}, 일반 페이징 SQL ${sameSql ? '동일' : '다름'}`);

  await conn.end();
  const text = `${report[0]}\n## 요약\n\n${summary.map(s => `- ${s}`).join('\n')}\n\n${report.slice(1).join('\n')}\n`;
  fs.writeFileSync(OUT, text);
  console.log(`보고서: ${OUT}`);
  console.log(summary.join('\n'));
}

main().catch(async e => {
  console.error(`실패: ${e.code || ''} ${e.message}`);
  try { if (conn) await conn.end(); } catch (_) { /* ignore */ }
  process.exit(1);
});
