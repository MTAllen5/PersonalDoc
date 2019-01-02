/* global GDATA, escape */
$(function () {
	var isTouch = 'ontouchstart' in window;
	var EVENT = {
		start: isTouch ? 'touchstart' : 'mousedown',
		move: isTouch ? 'touchmove' : 'mousemove',
		end: isTouch ? 'touchend' : 'mouseup'
	};
	var VENDOR = /webkit/i.test(navigator.appVersion) ? 'webkit' : /firefox/i.test(navigator.userAgent) ? 'Moz' : /trident/i.test(navigator.userAgent) ? 'ms' : 'opera' in window ? 'O' : '';

	var loader = function () {
		var $_loading_box = $('#_loading_box');
		var $_loading_text = $('#_loading_text');
		var loader = new createjs.LoadQueue();

		var load_progess = function load_progess(e) {
			$_loading_text.length && $_loading_text.text('正在加载... ' + (e.loaded * 100).toFixed(1) + "%");
		};
		var load_complete = function load_complete(e) {};

		loader.on("complete", function (e) {
			load_complete(e);
			$_loading_box.hide();
		});
		loader.on("progress", function (e) {
			load_progess(e);
		});

		return {
			getResult: function getResult(id) {
				return loader.getResult(id);
			},
			startLoad: function startLoad(list) {
				$_loading_box.show();
				loader.loadManifest(list);
				return this;
			},
			handlerLoadProgress: function handlerLoadProgress(progess) {
				load_progess = progess || load_progess;
				return this;
			},
			handlerLoadComplete: function handlerLoadComplete(complete) {
				load_complete = complete || load_complete;
				return this;
			}
		};
	}();

	
	//添加预加载内容
	var res = ["./images/logo.png"];

	loader.startLoad(res).handlerLoadComplete(function () {

		// 加入滑动箭头
		$(".page").each(function(i, item) {
			$(item).append('<div class="' + (i == $(".page").length - 1? "global-arrow-top" : "global-arrow-btm") + '">' +
            					'<svg width="38" height="22" version="1.1">' +
              					'<line x1="2" y1="20" x2="20" y2="2" style="stroke:#fff;stroke-width:4;"></line>' +
              					'<line x1="18" y1="2" x2="36" y2="20" style="stroke:#fff;stroke-width:4;"></line>' +
            					'</svg>' +
          					'</div>');
		});

		// 初始化滑动
		var mySwiper = new Swiper ('.page-container', {
	    wrapperClass: "page-wrapper",
	    slideClass: "page",
	    slideActiveClass: "page-cur",
	    direction: 'vertical'
	  });

		// 背景音乐
	  $("#musicIcon").on("click", function() {
			if($(this).hasClass("pause")) {
				$(this).removeClass("pause");
				$("#audio")[0].play();
			} else {
				$(this).addClass("pause");
				$("#audio")[0].pause();
			}
		});

	  //其他初始化
	  function sendComment(content) {
	  	$.ajax({
				url: "data.json",
				dataType: "json",
				data: {
					username: escape(GDATA.nickname),
					content: escape(content),
					uid: GDATA.token,
					mobile: isLogin.mobile,
					type: "swipe_fathers_day",
					icon: GDATA.avatar
				},
				success: function(result) {
					if(result.code === 0) {
            $(".tips").addClass("show");
            setTimeout(function() {
              $(".tips").removeClass("show");
            }, 2000);
            getComment();
          } else {
            alert("网络出现点问题哦~");
          }
				}
			});
	  }

	  $("#submit").on("click", function() {
	  	var content = $("#conmment").val();
	  	if($.trim(content) === "") {
	  		alert("请写下你对父亲的告白");
	  		return;
	  	}
	  	if(isLogin) {
	  		sendComment(content);
	  	} else {
	  		$(".mask, .info").show();
	  	}
	  });

	  $("#submit_info").on("click", function() {
	  	var name = $("#name").val();
	  	var mobile = $("#mobile").val();
	  	if($.trim(name) === "") {
	  		alert("请留下你的名字");
	  		return;
	  	}
	  	if($.trim(mobile) === "") {
	  		alert("请留下你的电话");
	  		return;
	  	}
	  	localStorage.setItem("is_login_swipe_father_day", {
	  		name: name,
	  		mobile: mobile
	  	});
	  	isLogin = localStorage.getItem("is_login_swipe_father_day");
	  });
	});
});