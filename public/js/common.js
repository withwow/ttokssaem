// common.js
//console.log = console.warn = console.error = () => {};	// LOG Hidden

/* 
   서버에서 오늘 날짜 가져오기 (날짜 값)
 */
   function fn_getToday() {
	try {
		var xmlHttpRequest;
		if (window.XMLHttpRequest) {
			// code for Firefox, Mozilla, IE7, etc.
			xmlHttpRequest = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			// code for IE5, IE6
			xmlHttpRequest = new ActiveXObject('Microsoft.XMLHTTP');
		} else {
			return;
		}

		xmlHttpRequest.open('HEAD', window.location.href.toString(), false); // xmlHttpRequest.open('HEAD', window.location.href.toString(), false);
		xmlHttpRequest.setRequestHeader('ContentType', 'text/html');
		xmlHttpRequest.send('');

		var serverDate = xmlHttpRequest.getResponseHeader('Date');
		var date = new Date(serverDate);

		return date;
	} catch (e) {
		console.log('catch', e);
		return new Date(); // 오류가나면 local 시간을 return
	}
}

function fn_Set_Url(url) {
	location.href = url;
}

// 로그아웃
function fn_Set_Logout() {
	var code = '';

	$.ajax({
		type: 'POST',
		url: '/v1/logout',
		dataType: 'json',
		async: false,
		success: function (info) {
			code = info.code;

			location.reload();
		},
	});
}
// ----------------------------------------------------------------------------------------------------------

// 쿠키 저장
function fn_SetCookie(cookieName, value, exdays) {
	var exdate = fn_getToday(); // new Date();
	exdate.setDate(exdate.getDate() + exdays);

	var cookieValue =
		escape(value) + (exdays == null ? '' : '; expires=' + exdate.toGMTString());

	document.cookie = cookieName + '=' + cookieValue;
}

function fn_DeleteCookie(cookieName) {
	var expireDate = fn_getToday(); // new Date();
	expireDate.setDate(expireDate.getDate() - 1);
	document.cookie = cookieName + '= ' + '; expires=' + expireDate.toGMTString();
}

function fn_GetCookie(cookieName) {
	cookieName = cookieName + '=';
	var cookieData = document.cookie;
	var start = cookieData.indexOf(cookieName);
	var cookieValue = '';

	if (start != -1) {
		start += cookieName.length;
		var end = cookieData.indexOf(';', start);
		if (end == -1) end = cookieData.length;
		cookieValue = cookieData.substring(start, end);
	}

	return unescape(cookieValue);
}
// ----------------------------------------------------------------------------------------------------------

// Modal Alert
function fn_ModalAlert(t, b, l) {
	var dfd = jQuery.Deferred();
	var $alert = $('#modalAlert');
	var pTitle = t;
	var pBody = b;
	var pLock = l;

	if (pLock == 'static') {
		$alert.modal({ backdrop: 'static', keyboard: false });
	}

	$alert.modal('show');

	$('#modalAlertTitle').html(pTitle);
	$('#modalAlertBody').html(pBody);

	$('#btnAlertYes')
		.off('click')
		.click(function () {
			$alert.modal('hide');
			dfd.resolve(1);
			return 1;
		});

	return dfd.promise();
}

// Modal Confirm
function fn_ModalConfirm(t, b, l) {
	var dfd = jQuery.Deferred();
	var $alert = $('#modalConfirm');
	var pTitle = t;
	var pBody = b;
	var pLock = l;

	if (pLock == 'static') {
		$alert.modal({ backdrop: 'static', keyboard: false });
	}

	$alert.modal('show');

	$('#modalConfirmTitle').html(pTitle);
	$('#modalConfirmBody').html(pBody);

	$('#btnConfirmYes')
		.off('click')
		.click(function () {
			$alert.modal('hide');
			dfd.resolve(1);
			return 1;
		});

	$('#btnConfirmNo')
		.off('click')
		.click(function () {
			$alert.modal('hide');
			dfd.resolve(0);
			return 0;
		});

	return dfd.promise();
}
// ----------------------------------------------------------------------------------------------------------

// Modal Report
function fn_ModalReport(t, b, l) {
	var dfd = jQuery.Deferred();
	var $alert = $('#modalReport');
	var pTitle = t;
	var pBody = b;
	var pLock = l;

	if (pLock == 'static') {
		$alert.modal({ backdrop: 'static', keyboard: false });
	}

	$alert.modal('show');

	$('#modalReportTitle').html(pTitle);
	$('#modalReportBody').html(pBody);

	$('#btnReportYes')
		.off('click')
		.click(function () {
			$alert.modal('hide');
			dfd.resolve(2);
			return 2;
		});

	$('#btnReportNo')
		.off('click')
		.click(function () {
			$alert.modal('hide');
			dfd.resolve(1);
			return 1;
		});

	$('#btnReportCancel')
		.off('click')
		.click(function () {
			$alert.modal('hide');
			dfd.resolve(0);
			return 0;
		});

	return dfd.promise();
}
// ----------------------------------------------------------------------------------------------------------

// Modal User
function fn_ModalUserList() {
	var $user = $('#modalUser');
	$('#modalUserContent').css('height', '600px');
	$('#modalUserTitle').html('회원 선택');

	$('#modalUserBody').html(
		'<iframe class="embed-responsive-item" width="100%" height="100%" src="/popup/memberlist?usertype=" scrolling="no" allowfullscreen></iframe>',
	);

	$user.modal('show');

	$('#btnUserYes')
		.off('click')
		.click(function () {
			$('#modalUserBody').html('');
			$user.modal('hide');
		});

	$('#btnUserClose')
		.off('click')
		.click(function () {
			$('#modalUserBody').html('');
			$user.modal('hide');
		});
}
// ----------------------------------------------------------------------------------------------------------

// 요일
function fn_convMMDD(yyyymmdd) {
	let conv = yyyymmdd.substring(4, 6) + '/' + yyyymmdd.substring(6, 8);

	document.write(conv);
}

// 요일
function fn_getWeek(idx) {
	var weekKorShortName = ['N/A', '일', '월', '화', '수', '목', '금', '토'];
	document.write(weekKorShortName[idx]);
}

// 날짜
function fn_getDate() {
	var weekKorShortName = ['일', '월', '화', '수', '목', '금', '토'];

	var d = fn_getToday(); // new Date(),
	(month = '' + (d.getMonth() + 1)), (day = '' + d.getDate());
	//year = d.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [month, day].join('-') + '(' + weekKorShortName[d.getDay()] + ')';
}

function fn_isToday(date) {
	var d = fn_getToday(); // new Date(),
	(month = '' + (d.getMonth() + 1)),
		(day = '' + d.getDate()),
		(year = d.getFullYear());

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	let today = [year, month, day].join('');

	if (date === today) document.write('(오늘)');
}

/* 
					 오늘 날짜 인지 비교해서  '(오늘)' 값을 리턴 
				 */
function fn_isTodayRtnString(date) {
	var d = fn_getToday(); // new Date(),
	(month = '' + (d.getMonth() + 1)),
		(day = '' + d.getDate()),
		(year = d.getFullYear());

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	let today = [year, month, day].join('');
	//console.log('date/ today=====' + date + '/' + today);
	if (date === today) return '(오늘)';
	else return '';
}

/* 
		날짜 8자리 (\YYYYMMDD) 
		*/
function fn_getYMD(date) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return year + month + day;
}

/* 
	날짜 8자리 (\YYYYMMDD) 
	*/
function fn_getYesterdayRange() {
	var d = new Date();
	d.setDate(d.getDate() - 1),
		(month = '' + (d.getMonth() + 1)),
		(day = '' + d.getDate()),
		(year = d.getFullYear());

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return (
		year + '-' + month + '-' + day + ' - ' + year + '-' + month + '-' + day
	);
}

/* 
		날짜 8자리 (\YYYYMMDD) 를 날짜 객체로 변환 20210323
		*/
function fn_getDateFromYMDStr(date, c_day) {
	var d = new Date(date.substr(0, 4), date.substr(4, 2) - 1, date.substr(6, 2));
	var retDate = d.getDate();
	d.setDate(retDate - c_day);

	return d;
}

/* 
		날짜 타이틀 형식(YYYY년 + MM월 + DD일) 
		*/
function fn_getYMDTitle(date) {
	var rstYmd = date;
	if (date != '' && date.length == 8) {
		rstYmd =
			date.substring(0, 4) +
			'년 ' +
			date.substring(4, 6) +
			'월 ' +
			date.substring(6, 8) +
			'일';
	} else rstYmd = '';

	return rstYmd;
}
/*
		날짜를 타이틀 형식으로 리턴: MM/DD(월)   
		*/
function fn_getMDWeek(date, week) {
	var weekKorShortName = ['', '일', '월', '화', '수', '목', '금', '토'];

	var rstMMDD = '';
	if (date != '' && date.length == 8) {
		rstMMDD = date.substring(4, 6) + '/' + date.substring(6, 8);
		if (week != '') rstMMDD = rstMMDD + '(' + weekKorShortName[week] + ')';
	}
	return rstMMDD;
}

// ----------------------------------------------------------------------------------------------------------
function fn_footerCheck() {
	//if ($('#myfooter').hasClass('fixed_footer')) {
	let h1 = $('#main-wrapper').height();
	let h2 = $('#main-wrapper').innerHeight();

	let wndw = $(window).height();
	let docu = $(document).height();

	if (docu < h1 + 47) {
		//console.log('IF document_h==', docu, '   main-wrapper_h==='+h1);
		if ($('#myfooter').hasClass('fixed_footer'))
			$('#myfooter').removeClass('fixed_footer');
	} else {
		//console.log('ELSE document_h==', docu, '  main-wrapper_h==='+h1);
		$('#myfooter').addClass('fixed_footer');
	}
	//}
}

function fn_srctoHtml(str) {
	console.log('str=' + str);
	str = str.replace(/\r\n/g, '<br/>');

	str = str.replace(/</g, '&lt;');
	str = str.replace(/>/g, '&gt;');
	str = str.replace(/"/g, '&quot;');
	//str = str.replace(/-/g,"&#45;");
	//str = str.replace(/:/g,"&#58;");
	str = str.replace(/\'/g, '&acute;');

	str = str.replace(/\\/g, ' ');
	str = str.replace(/·/g, ' ');
	str = str.replace(/\·/g, ' ');
	str = str.replace(/\?/g, ' ');
	str = str.replace(/\//g, ' ');

	console.log('str=' + str);
	return str;
}

function fn_htmlToSrc(str) {
	str = str.replace('&amp;#91;', '[');
	str = str.replace('&amp;#93;', ']');

	str = str.replace(/&amp;#44;/g, ',');
	str = str.replace(/&#34;/g, '"');

	str = str.replace('&amp;', '&');
	return str;
}

$(document).ready(function () {
	fn_footerCheck();

	// $(window).scroll(function () {
	// 	var innerHeight = this.innerHeight;
	// 	var scrollY = this.scrollY;
	// 	var offsetHeight = this.document.body.offsetHeight;

	// 	$('#worker').text(
	// 		`in : ${Math.round(innerHeight)} : ${Math.round(
	// 			scrollY,
	// 		)} >= height ${offsetHeight}`,
	// 	);
	// });
});

$(function () {
	'use strict';
	//console.log("-common.js use strict---------------------");
	/* $('.page-wrapper').on('click', function () {
						if ($('#main-wrapper').hasClass('show-sidebar')) {
							$('#main-wrapper').toggleClass('show-sidebar');
							$('.nav-toggler i').toggleClass('ti-menu');
							//$("#sidemenu_background").modal('show');
							//$("#sidemenu_background").modal('hide');
						}
					});   */
	//$('.mini-sidebar').addClass('active');

	//if ($('#main-wrapper').attr("data-sidebartype") == "full") {
	if (!$('#main-wrapper').hasClass('show-sidebar')) {
		$('.left-sidebar').addClass('active');
		$('.logo-text').css('font-size', 'smaller');
	}
	//}
	/* 	$('.nav-link').on('click', function () {
						$('.left-sidebar').addClass('active'); 
						if ($('#main-wrapper').attr("data-sidebartype") == "full") {
							$('.sidebar-overlay').fadeIn(); 
						}else{
							$('.sidebar-overlay').fadeOut();
						}
						console.log("-nav-link  click---------------------");
					}); */

	/* 
					$('.sidebar-link').on('click', function () {
						$('.left-sidebar').removeClass('active'); 
						if ($('#main-wrapper').hasClass('show-sidebar')) {
							$('.sidebar-overlay').fadeIn(); 
						}else{
							$('.sidebar-overlay').fadeOut();
							
						}
						console.log("-sidebar-link click---------------------");
					}); */

	$('.nav-toggler').on('click', function () {
		$('.left-sidebar').addClass('active');
		if ($('#main-wrapper').hasClass('show-sidebar')) {
			$('.sidebar-overlay').fadeIn();
		} else {
			$('.sidebar-overlay').fadeOut();
		}
		//console.log("-nav-toggler click---------------------");
	});

	$('.sidebar-overlay').on('click', function () {
		if ($('#main-wrapper').attr('data-sidebartype') == 'full') {
			$('.sidebar-overlay').fadeOut();
			$('#main-wrapper').toggleClass('show-sidebar');
			$('.nav-toggler i').toggleClass('ti-menu');
		} else {
			$('.left-sidebar').removeClass('active');
			$('.sidebar-overlay').fadeOut();
			if ($('#main-wrapper').hasClass('show-sidebar')) {
				$('#main-wrapper').toggleClass('show-sidebar');
				$('.nav-toggler i').toggleClass('ti-menu');
			}
		}
		//console.log("-sidebar-overlay click---------------------");
	});
});

// null String 을 공백으로 변환
function isEmpty(value) {
	if (value == null || value.length === 0) {
		return '';
	} else {
		return value;
	}
}

String.prototype.lpad = function (padLen, padStr) {
	var str = this;
	if (padStr.length > padLen) {
		console.log('오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다');
		return str + '';
	}
	while (str.length < padLen) str = padStr + str;
	str = str.length >= padLen ? str.substring(0, padLen) : str;
	return str;
};

/*
 * COntrol
 */

function fn_Set_Radio_Checked(item, value) {
	$("input:radio[id='" + item + "']:radio[value='" + value + "']").prop(
		'checked',
		true,
	);
}

function fn_Set_CheckBox_Checked(item, value) {
	$("input:checkbox[id='" + item + "']").prop('checked', value);
}

function fn_Set_Select_Selected(item, value, name) {
	var exists = false;
	$('#' + item + ' > option').each(function () {
		if (this.value == value) {
			exists = true;
		}
	});

	if (exists) {
		$('#' + item)
			.val(value)
			.prop('selected', true);
	} else {
		var pSelectOption =
			"<option value='" + value + "' Selected>" + name + '</option>';
		$('#' + item).append(pSelectOption);
	}
}

function fn_Set_CheckBox_Status(item, loop, checked, disabled) {
	if (loop == 0) {
		$("input:checkbox[id='" + item + "']").prop('checked', checked);
		$("input:checkbox[id='" + item + "']").prop('disabled', disabled);
	} else {
		for (let i = 0; i < loop; i++) {
			$("input:checkbox[id='" + item + i + "']").prop('checked', checked);
			$("input:checkbox[id='" + item + i + "']").prop('disabled', disabled);
		}
	}
}

function fn_MoneyString(n) {
	n = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	return n;
}

function fn_RemoveCommaString(n) {
	n = String(n).replace(/,/gi, '');

	return n;
}
