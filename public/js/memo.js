$(document).ready(function () {
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

  loadMemo();
  
  setInterval(() => loadMemo(), 60000);
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
