// 상단 헤더의 SSL 인증서 상태 표시 (본사 관리자만 로드됨)
// 화면을 그린 뒤 따로 불러오며, 실패해도 다른 화면 동작에는 영향이 없다.
$(document).ready(function () {
	var STYLE = {
		ok: { cls: 'bg-success', label: '정상' },
		warn: { cls: 'bg-warning', label: '주의' },
		danger: { cls: 'bg-danger', label: '위험' },
		expired: { cls: 'bg-danger', label: '만료' },
		error: { cls: 'bg-danger', label: '인증 오류' },
		unknown: { cls: 'bg-secondary', label: '확인 불가' },
		proxy: { cls: 'bg-info', label: 'Cloudflare' },
	};
	// 숫자가 클수록 심각. 배지 색은 가장 심각한 상태를 따른다.
	var RANK = { ok: 0, proxy: 0, unknown: 1, warn: 2, danger: 3, error: 4, expired: 4 };
	var loading = false;

	function esc(v) {
		return String(v == null ? '' : v)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}

	function ymd(iso) {
		if (!iso) return '';
		var d = new Date(iso);
		if (isNaN(d.getTime())) return '';
		var m = ('0' + (d.getMonth() + 1)).slice(-2);
		var day = ('0' + d.getDate()).slice(-2);
		return d.getFullYear() + '-' + m + '-' + day;
	}

	function render(list) {
		var html = '';
		var worst = 'ok';
		var problems = 0;

		for (var i = 0; i < list.length; i++) {
			var r = list[i];
			var st = STYLE[r.status] || STYLE.unknown;
			if ((RANK[r.status] || 0) > (RANK[worst] || 0)) worst = r.status;
			if ((RANK[r.status] || 0) > 0) problems++;

			var detail = esc(r.message);
			if (r.validTo) detail += ' · ' + esc(ymd(r.validTo)) + ' 만료';
			if (r.issuer) detail += '<br><span class="text-muted">' + esc(r.issuer) + '</span>';

			html +=
				'<div class="message-item d-flex align-items-center border-bottom px-3 py-2">' +
				'<span class="badge ' + st.cls + ' me-2" style="min-width:64px;">' + esc(st.label) + '</span>' +
				'<div class="w-75 d-inline-block v-middle">' +
				'<h5 class="message-title mb-0 mt-1">' + esc(r.host) + '</h5>' +
				'<span class="fs-2 text-nowrap d-block text-truncate" style="white-space:normal !important;">' + detail + '</span>' +
				'</div></div>';
		}

		$('#certStatusList').html(html || '<div class="px-3 py-2">확인할 사이트가 없습니다.</div>');

		var badge = $('#certStatusBadge');
		badge.removeClass('bg-success bg-warning bg-danger bg-secondary bg-info');
		if (problems > 0) {
			badge.addClass((STYLE[worst] || STYLE.unknown).cls).html(problems);
			$('#certStatusSummary').html(problems + '개 사이트 확인 필요');
		} else {
			badge.html('');
			$('#certStatusSummary').html('모두 정상');
		}
	}

	function load() {
		if (loading || document.hidden) return;
		loading = true;
		$.ajax({
			type: 'GET',
			url: '/v1/certStatus',
			dataType: 'json',
			async: true,
			timeout: 15000,
			success: function (info) {
				if (info && info.code == 0 && info.data && info.data.list) {
					render(info.data.list);
				} else {
					$('#certStatusSummary').html('확인 불가');
				}
			},
			error: function () {
				$('#certStatusSummary').html('확인 불가');
			},
			complete: function () {
				loading = false;
			},
		});
	}

	load();
	// 서버가 1시간 캐시하므로 열어 둔 화면도 1시간마다 갱신한다.
	setInterval(load, 60 * 60 * 1000);
});
