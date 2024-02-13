$(document).ready(function () {

function dateFormat(date, fstr, utc) {
	utc = utc ? 'getUTC' : 'get';
	return fstr.replace(/%[YmdHMS]/g, function (m) {
		switch (m) {
			case '%Y':
				return date[utc + 'FullYear'](); // no leading zeros required
			case '%m':
				m = 1 + date[utc + 'Month']();
				break;
			case '%d':
				m = date[utc + 'Date']();
				break;
			case '%H':
				m = date[utc + 'Hours']();
				break;
			case '%M':
				m = date[utc + 'Minutes']();
				break;
			case '%S':
				m = date[utc + 'Seconds']();
				break;
			default:
				return m.slice(1); // unknown code, remove %
		}
		// add leading zero if required
		return ('0' + m).slice(-2);
	});
}

	function loadMemo() {
		$.ajax({
			type: 'GET',
			url: '/v1/checkMemo',
			dataType: 'json',
			data: {},
			async: false,
			success: function (info) {
				code = info.code;
				if (code == 0) {
					//console.log(info.data);

					addMessageList.deleteAll();

					if (info.data.count !== 0) {
						$('#newcount1').html(info.data.count);
						$('#newcount2').html(info.data.count);

						for (let i = 0; i < info.data.lists.length; i++) {
							addMessageList.add(info.data.lists[i]);
						}
					} else {
						$('#newcount1').html('');
						$('#newcount2').html(info.data.count);
					}
				}
			},
		});
	}

	function loadM2M() {
		$.ajax({
			type: 'GET',
			url: '/v1/checkM2M',
			dataType: 'json',
			data: {},
			async: false,
			success: function (info) {
				code = info.code;
				if (code == 0) {
					//console.log(info.data);
					if (info.data.count !== 0) {
						$('#newcount3').html(info.data.count);
						$('#newcount4').html(info.data.count);
						$('#notify_toast_body').html(`현재 문의 ${info.data.count}건`);
						$('#notify_toast').toast('show');

					} else {
						$('#newcount3').html('');
						$('#newcount4').html(info.data.count);
					}					
				}
			},
		});
	}

	function loadRequestTest() {
		var d = new Date(); // Today!
		d.setHours(d.getHours() - 2); // 02시까지 영업이니
		let memodate = dateFormat(d, '%Y%m%d', false);

		$.ajax({
			type: 'GET',
			url: '/v1/checkRequestTest',
			dataType: 'json',
			data: {
				// memodate : memodate
			},
			async: false,
			success: function (info) {
				code = info.code;
				if (code == 0) {
					//console.log(info.data);
					if (info.data.count !== 0) {
						$('#newcount5').html(info.data.count);
						$('#newcount6').html(info.data.count);
						$('#request_toast_body').html(`테스트 요청 ${info.data.count}건`);
						$('#request_toast').toast('show');

					} else {
						$('#newcount5').html('');
						$('#newcount6').html(info.data.count);
					}					
				}
			},
		});
	}

  loadMemo();

	loadM2M();

	loadRequestTest();

  setInterval(() => loadMemo(), 60000);

  setInterval(() => loadM2M(), 10000);

  setInterval(() => loadRequestTest(), 10000);
});

addMessageList = {
	idx: 0,
	add: function (obj) {
		// 파일필드 추가
		var o = this;
		var idx = o.idx;

		var a = document.createElement('a');
		a.id = 'messageList' + idx;
		a.setAttribute('class', 'message-item');
		a.setAttribute('href', '#');

		var iconspan = document.createElement('span');
		iconspan.setAttribute(
			'class',
			'btn btn-light-primary text-primary btn-circle',
		);
		var icon = document.createElement('i');
		icon.setAttribute('class', 'icon-people');
		iconspan.appendChild(icon);

		var div = document.createElement('div');
		div.setAttribute('class', 'mail-contnet');

		var h5 = document.createElement('h5');
		h5.setAttribute('class', 'message-title');
		let alarmcontent = obj.membername;
		var hnode = document.createTextNode(alarmcontent);
		h5.appendChild(hnode);

		var desc = document.createElement('span');
		desc.setAttribute('class', 'mail-desc');
		desc.textContent = obj.memo;

		var time = document.createElement('span');
		time.setAttribute('class', 'time');
		time.textContent = obj.regdate.substring(0, 10);

		div.appendChild(h5);
		div.appendChild(desc);
		div.appendChild(time);

		a.appendChild(iconspan);
		a.appendChild(div);

		document.getElementById('messageList').appendChild(a);

		o.idx++;
	},
	deleteAll: function () {
		for (let i = 0; i < this.idx; i++) {
			document
				.getElementById('messageList')
				.removeChild(document.getElementById('messageList' + i));
		}

		this.idx = 0;
	},
};
