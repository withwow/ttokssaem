(function () {
  'use strict';
  var chart;
  var yearSelect = document.getElementById('stat-year');
  var status = document.getElementById('stat-status');
  var results = document.getElementById('stat-results');
  var formatter = new Intl.NumberFormat('ko-KR');
  function money(value) { return formatter.format(value); }
  function signed(value) { return (value > 0 ? '+' : '') + money(value); }
  function rate(value) { return value === null ? '—' : (value > 0 ? '+' : '') + value.toFixed(1) + '%'; }
  function put(id, text) { document.getElementById(id).textContent = text; }
  function render(data) {
    var selectedYear = Number(yearSelect.value);
    var years = Array.from(new Set(data.years.concat([selectedYear + 1, selectedYear - 1]))).sort(function (a, b) { return b - a; });
    yearSelect.replaceChildren();
    years.forEach(function (year) { yearSelect.add(new Option(year + '년', year, false, year === selectedYear)); });
    put('previous-label', data.previousYear + '년 매출 합계');
    put('current-label', data.year + '년 매출 합계');
    put('previous-heading', data.previousYear + '년');
    put('current-heading', data.year + '년');
    put('previous-total', money(data.totals.previous) + '원');
    put('current-total', money(data.totals.current) + '원');
    put('difference-total', signed(data.totals.difference) + '원');
    put('rate-total', rate(data.totals.rate));
    put('previous-footer', money(data.totals.previous));
    put('current-footer', money(data.totals.current));
    put('difference-footer', signed(data.totals.difference));
    put('rate-footer', rate(data.totals.rate));
    put('stat-updated', '계산 시각: ' + new Date(data.generatedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));
    var tbody = document.getElementById('stat-rows');
    tbody.replaceChildren();
    data.rows.forEach(function (row) {
      var tr = document.createElement('tr');
      [row.month + '월', money(row.previous), money(row.current), signed(row.difference), rate(row.rate)].forEach(function (text, index) {
        var cell = document.createElement(index === 0 ? 'th' : 'td');
        if (index === 0) cell.scope = 'row';
        cell.textContent = text;
        tr.appendChild(cell);
      });
      tbody.appendChild(tr);
    });
    results.hidden = false;
    var warnings = [];
    if (data.excludedCount) warnings.push('수강 기간 또는 금액이 올바르지 않은 결제 ' + data.excludedCount + '건은 제외했습니다.');
    if (data.totals.current === 0 && data.totals.previous === 0) warnings.push('비교 기간의 매출이 없습니다.');
    status.className = warnings.length ? 'alert alert-warning' : 'mb-3';
    status.textContent = warnings.join(' ');
    if (chart) chart.destroy();
    chart = new Chart(document.getElementById('stat-chart').getContext('2d'), {
      type: 'bar',
      data: { labels: data.rows.map(function (row) { return row.month + '월'; }), datasets: [
        { label: data.previousYear + '년', data: data.rows.map(function (row) { return row.previous; }), backgroundColor: '#b7c5d6' },
        { label: data.year + '년', data: data.rows.map(function (row) { return row.current; }), backgroundColor: '#1c7359' }
      ] },
      options: { responsive: true, maintainAspectRatio: false,
        scales: { yAxes: [{ ticks: { beginAtZero: true, callback: money } }] },
        tooltips: { callbacks: { label: function (item, chartData) { return chartData.datasets[item.datasetIndex].label + ': ' + money(Number(item.yLabel)) + '원'; } } }
      }
    });
  }
  async function load(refresh) {
    var buttons = [yearSelect, document.getElementById('stat-search'), document.getElementById('stat-refresh')];
    buttons.forEach(function (button) { button.disabled = true; });
    results.hidden = true;
    status.className = 'alert alert-info';
    status.textContent = refresh ? '최신 결제 내역으로 통계를 계산하고 있습니다.' : '통계를 조회하고 있습니다.';
    try {
      var year = yearSelect.value;
      var response = await fetch(refresh ? '/v1/generateSalesStat' : '/v1/selSalesStat?year=' + encodeURIComponent(year), {
        method: refresh ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store',
        headers: refresh ? { 'Content-Type': 'application/json' } : {},
        body: refresh ? JSON.stringify({ year: year }) : undefined
      });
      if (!response.ok) throw new Error('통계를 불러오지 못했습니다. 다시 시도해주세요.');
      var packet = await response.json();
      if (Number(packet.code) === 999) { window.location.href = '/login'; return; }
      if (Number(packet.code) !== 0) throw new Error('통계 조회에 실패했습니다. 연도와 연결 상태를 확인해주세요.');
      render(packet.data);
    } catch (error) { status.className = 'alert alert-danger'; status.textContent = error.message; }
    finally { buttons.forEach(function (button) { button.disabled = false; }); }
  }
  document.getElementById('stat-form').addEventListener('submit', function (event) { event.preventDefault(); load(false); });
  yearSelect.addEventListener('change', function () { load(false); });
  document.getElementById('stat-refresh').addEventListener('click', function () { load(true); });
  load(false);
})();
