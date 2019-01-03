$(function () {
	var isTouch = 'ontouchstart' in window;
	var EVENT = {
		start: isTouch ? 'touchstart' : 'mousedown',
		move: isTouch ? 'touchmove' : 'mousemove',
		end: isTouch ? 'touchend' : 'mouseup'
	};
	// var VENDOR = /webkit/i.test(navigator.appVersion) ? 'webkit' : /firefox/i.test(navigator.userAgent) ? 'Moz' : /trident/i.test(navigator.userAgent) ? 'ms' : 'opera' in window ? 'O' : '';
	var H_WIN = window.innerHeight;
	var timer2, timer10, timer11;

	var loader = function () {
		var $_loading_box = $('#_loading_box');
		var $_loading_text = $('#_loading_text');
		var loader = new createjs.LoadQueue();

		var load_progess = function load_progess(e) {
			$_loading_text.length && $_loading_text.text('前方高能... ' + (e.loaded * 100).toFixed(1) + "%");
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

	var _swipe = function () {
		var $_swipe_list = $('._swipe_list');
		var $_swipe_item = $('._swipe_item');
		var isInited = false;

		return {
			init: function init() {
				if (isInited) {
					return;
				}
				isInited = true;

				H_WIN = window.innerHeight;
				$(".wrap").css({width: H_WIN / 1.608 + "px"});
				$_swipe_item.each(function () {
					$(this).css({
						height: H_WIN + 'px'
					});
				}).eq(0).addClass('page-cur');

				var point = { y: [] };
				var cur = 0;
				$_swipe_list.on(EVENT.start, function (e) {
					var _e = isTouch ? e.touches[0] : e;
					point.y = [_e.pageY];
				}).on('transitionend', function () {
					$_swipe_item.removeClass("page-cur").eq(cur).addClass("page-cur");
				});
				$(document).on(EVENT.move, function (e) {
					if (point.y.length) {
						var _e = isTouch ? e.touches[0] : e;
						point.y.push(_e.pageY);
						e.preventDefault();
					}
				});
				$(document).on(EVENT.end, function (e) {
					if (point.y.length > 1) {
						if (point.y[0] - point.y[point.y.length - 1] > 50) {
							// 向上滑动
							++cur > $_swipe_item.length - 1 && (cur = $_swipe_item.length - 1);
						} else if (point.y[0] - point.y[point.y.length - 1] < -50) {
							// 向下滑动
							--cur < 0 && (cur = 0);
						}
						$_swipe_list.css('transform', 'translate3d(0,' + '-' + H_WIN * cur + 'px,0)');
						e.preventDefault();

						$(".logo").show();
						clearInterval(timer2);
						clearInterval(timer10);
						clearInterval(timer11);
						$(".video-box iframe").remove();

						if(cur == 2) {
							page03Fn();
						}
						if(cur == 7) {
							setTimeout(function() {
								$(".page08 .video-box").append('<iframe width="100%" height="100%" src="http://tv.sohu.com/upload/static/share/share_play.html#87161297_227475111_0_9001_0" frameborder=0 scrolling=no  allowfullscreen></iframe>');
							}, 200);
						}
						if(cur == 8) {
							setTimeout(function() {
								$(".page09 .video-box").append('<iframe width="100%" height="100%" src="http://tv.sohu.com/upload/static/share/share_play.html#87161527_227475111_0_9001_0" frameborder=0 scrolling=no allowfullscreen></iframe>');
							}, 200);
						}
						if(cur == 9) {
							page10Fn();
						}
					}
					point.y = [];
				});

				window.addEventListener('orientationchange', function () {
					$_swipe_item.each(function () {
						$(this).css({
							height: H_WIN + 'px'
						});
					});
				});
			}
		};
	}();

	function page03Fn() {
		// 生成弹幕code
		var danmuAry = [
			"感觉身体被掏空",
			"过劳肥",
			"我见过凌晨2点的珠江新城",
			"我真的不是处女座",
			"一边打点滴一边工作",
			"两个月搞掂1个亿",
			"每天150个电话",
			"下午4点的午餐",
			"钢铁人的诞生",
			"购房热线：400-099-0099",
			"购房热线：400-099-0099",
			"购房热线：400-099-0099",
			"购房热线：400-099-0099"
		];
		var danmuColor = [
			"#ffadad",
			"#abff9d",
			"#08fffc",
			"#fff10a",
			"#ff85f5",
			"#ffffff",
		];
		timer2 = setInterval(function() {
			var color = danmuColor[getRandom(danmuColor.length)];
			var text = danmuAry[getRandom(danmuAry.length)];
			var pos = getRandom(100);
			var speed = getRandom(10, 6);
			$(".page03-danmu").append('<div class="danmu-item" style="color: ' + color + '; top: ' + pos + '%; -webkit-animation: danmu ' + speed + 's linear forwards;">' + text + '</div>');
			if($(".danmu-item").length > 20) {
				$(".danmu-item").eq(0).remove();
			}
		}, 800);
	}
	function page10Fn() {
		$(".logo").hide();

		// 生成弹幕code
		var danmuAry = [
			// "年终奖可以发了吗",
			// "老板求加薪",
			// "小水是plus小妹",
			// "表白plus小妹2号",
			// "2017年买房结婚！",
			// "新年不发利是吗？",
			// "求扫地机器人",
			// "在搜狐也能买房",
		];
		var danmuColor = [
			"#ffadad",
			"#abff9d",
			"#08fffc",
			"#fff10a",
			"#ff85f5",
			"#ffffff",
		];
		var page = 0;
		var totalPage = 0;

		function getComment() {
			$.ajax({
				url: "http://wx.gz.focus.cn/commentApi/commentList",
				dataType: "jsonp",
				data: {
					type: "events_2016"
				},
				success: function(data) {
					if(data.code == 0) {
						danmuAry = data.data.comments;
						totalPage = data.data.pages;
						page = data.data.curPage;
					}
				}
			});
		}

		getComment();
		timer11 = setInterval(function() {
			getComment();
		}, 8000);

		timer10 = setInterval(function() {
			var color = danmuColor[getRandom(danmuColor.length)];
			danmuAry.index = (danmuAry.index == undefined || danmuAry.index >= danmuAry.length)? 0 : danmuAry.index + 1;
			var text = danmuAry[danmuAry.index];
			var pos = getRandom(100);
			var speed = getRandom(10, 6);
			$(".page10-danmu").append('<div class="danmu-item" style="color: ' + color + '; top: ' + pos + '%; right: 0; -webkit-animation: danmu ' + speed + 's linear forwards;">' + text.content + '</div>');
			if($(".danmu-item").length > 20) {
				$(".danmu-item").eq(0).remove();
			}
		}, 800);
	}


	var _popup = function() {
		var popup = $(".popup");
		var content = popup.find("[name=comment_ctn]");
		var phone = popup.find("[name=comment_number]");
		var code = popup.find("[name=comment_code]");
		var getCode = popup.find(".get-code");
		var sendDanmu = popup.find(".send-danmu");
		var popupInfo = getStorage("events_2016");
		if(popupInfo) {
			$(".popup-info").hide();
			phone.val(popupInfo.phone);
		}

		function getSMScode(mobile) {
			$.ajax({
				url: "http://wx.gz.focus.cn/api/getMobileCode",
				dataType: "jsonp",
				data: {
					mobile: mobile
				},
				success: function(data) {
					if(data.code == 0) {
						var cd = 60, timmer;
						getCode.text("已发送(60s)").attr("disabled", "disabled");
						timmer = setInterval(function() {
							getCode.text("已发送(" + (--cd) + "s)");
							if(cd <= 0) {
								clearInterval(timmer);
								getCode.text("发送验证码").removeAttr("disabled");
							}
						}, 1000);
					} else {
						console.log(data);
					}
				},
				error: function(xhr, status, errorThrown) {
					console.log(status, errorThrown);
				}
			});
		}

		function checkSMScode(mobile, code, sucFn, errFn) {
			$.ajax({
				url: "http://wx.gz.focus.cn/api/checkMobileCode",
				dataType: "jsonp",
				data: {
					mobile: mobile,
					code: code
				},
				success: function(data) {
					if(data.code == 0) {
						sucFn();
					} else {
						console.log(data);
						errFn();
					}
				},
				error: function(xhr, status, errorThrown) {
					console.log(status, errorThrown);
					errFn();
				}
			});
		}

		function sendUserRecord(mobile, content) {
			$.ajax({
				url : "http://appsurvey.focus.cn/Survey/submit",
				dataType: 'jsonp',
				data: {
					"sid": "5821",
					"opts[22710]": mobile, //姓名
					"opts[22709]": mobile, //手机号
					"opts[22711]": content //弹幕内容
				},
				success: function(data) {
					if (data.errcode) {
						alert(data.msg);
					} else {
						console.log('发送成功！');
					}
				}
			});
		}

		function sendComment(mobile, ctn) {
			$.ajax({
				url : "http://wx.gz.focus.cn/commentApi/commentNew",
				dataType: "jsonp",
				data: {
					username: mobile,
					content: ctn,
					type: "events_2016"
				},
				success: function(data) {
					if(data.code == 0) {
						$(".msg-tips").show().addClass("show");
						popup.removeClass("show");
						setTimeout(function() {
							$(".msg-tips").removeClass("show");
						}, 1400);
						setTimeout(function() {
							$(".mask").hide();
							$(".msg-tips").hide();
						}, 1500);
						$(".popup-info").hide();
						content.val("");
					}
				},
				error: function(xhr, status, errorThrown) {
					console.log(errorThrown);
				}
			});
		}
		
		return {
			init: function() {
				getCode.on("click", function(e) {
					e.preventDefault();
					if(!/^1[34578]\d{9}$/.test(phone.val())) {
						$(".popup-info").show();
						alert("请输入正确的手机号码");
					} else {
						getSMScode(phone.val());
					}
				});

				sendDanmu.on("click", function(e) {
					e.preventDefault();
					var pv = phone.val();
					var cv = code.val();
					var ctnv = content.val();
					if($.trim(ctnv) == "") {
						alert("请输入想说的话");
						return;
					} else if(!/^1[34578]\d{9}$/.test(pv)) {
						$(".popup-info").show();
						alert("请输入正确的手机号码");
					} else {
						if(!popupInfo) {
							checkSMScode(pv, cv, function() {
								sendUserRecord(pv, ctnv);
								sendComment(pv, ctnv);
								setStorage("events_2016", {
									phone: pv,
									name: pv,
								});
								popupInfo = {
									phone: pv,
									name: pv,
								};
							}, function() {
								
							});
						} else {
							sendUserRecord(pv, ctnv);
							sendComment(pv, ctnv);
						}
					}
				});
			}
		};
	}();


	var res = [
		"images/emoji1.png",
		"images/emoji2.png",
		"images/logo.png",
		"images/logo_bg.png",
		"images/page01_figure.png",
		"images/page01_gift.png",
		"images/page01_iwant1.png",
		"images/page01_iwant2.png",
		"images/page01_name1.png",
		"images/page01_name2.png",
		"images/page01_sketch.png",
		"images/page01_star.png",
		"images/page01_title.png",
		"images/page02_figure.png",
		"images/page02_newSing.png",
		"images/page02_phone.png",
		"images/page02_shout.png",
		"images/page02_shout1.png",
		"images/page02_shout2.png",
		"images/page02_shout3.png",
		"images/page02_shout4.png",
		"images/page02_shout5.png",
		"images/page02_sketch.png",
		"images/page03_bg.jpg",
		"images/page03_figure.png",
		"images/page03_title.png",
		"images/page04_airship.png",
		"images/page04_bg.jpg",
		"images/page04_figure.gif",
		"images/page04_figure2.gif",
		"images/page04_flag.png",
		"images/page04_map.png",
		"images/page05_ball.png",
		"images/page05_bg.jpg",
		"images/page05_figure.png",
		"images/page05_move.png",
		"images/page05_tupai.png",
		"images/page05_tupai_text.png",
		"images/page06_bg.jpg",
		"images/page06_figure.png",
		"images/page06_qrcode.png",
		"images/page06_sketch.png",
		"images/page06_work.png",
		"images/page07_bg.png",
		"images/page07_figure.png",
		"images/page07_heat1.png",
		"images/page07_heat2.png",
		"images/page07_heat3.png",
		"images/page07_heat4.png",
		"images/page07_heat5.png",
		"images/page07_heat6.png",
		"images/page07_title.png",
		"images/page08_down.png",
		"images/page08_figure.png",
		"images/page08_fire.png",
		"images/page08_number.png",
		"images/page08_text1.png",
		"images/page08_text2.png",
		"images/page08_text3.png",
		"images/page08_text4.png",
		"images/page08_title.png",
		"images/page08_up.png",
		"images/page09_dialog.png",
		"images/page09_down.png",
		"images/page09_figure.png",
		"images/page09_number.png",
		"images/page09_text.png",
		"images/page09_title.png",
		"images/page09_up.png",
		"images/page10_bg.jpg",
		"images/page10_dialog.png",
		"images/page10_figure.png",
		"images/page10_sketch.jpg",
		"images/page10_star1.png",
		"images/page10_star2.png",
		"images/page10_surprise.png",
		"images/popup_bg.png",
		"images/popup_close.png",
		"images/video_cover.jpg",
	];

	loader.startLoad(res).handlerLoadComplete(function () { //使用startLoad预加载文件，加载完成后执行handlerLoadComplete里面的方法
		_swipe.init();				//初始化屏幕滑动
		_popup.init();        //初始化浮窗

		// 加入滑动箭头
		$(".page").each(function(i, item) {
			$(item).append('<div class="' + (i == $(".page").length - 1? "global-arrow-top" : "global-arrow-btm") + '">' +
            					'<svg width="38" height="22" version="1.1">' +
              					'<line x1="2" y1="20" x2="20" y2="2" style="stroke:#fff;stroke-width:4;"></line>' +
              					'<line x1="18" y1="2" x2="36" y2="20" style="stroke:#fff;stroke-width:4;"></line>' +
            					'</svg>' +
          					'</div>');
		});

		$(".page10-star1, .page10-bar").on("click", function(e) {
			e.preventDefault();
			e.stopPropagation();
			$(".mask").show();
			$(".popup").show();
			setTimeout(function() {
				$(".popup").addClass("show");
			}, 100);
		});

		$(".popup-close").on("click", function() {
			$(".popup").removeClass("show");
			setTimeout(function() {
				$(".mask").hide();
			}, 400);
		});
	});

	function getRandom(max,min) {
    max = max || 1;
    min = min || 0;
    return Math.floor(Math.random() * (max - min)) + min;
  }
  function getStorage(name) {
  	return JSON.parse(localStorage.getItem(name));
  }
  function setStorage(name, val) {
  	localStorage.setItem(name, JSON.stringify(val));
  }

	// 微信分享
	window.mywx && mywx.setData({
		title : "8个楼市故事 你经历过几个？",
		desc : "如果不知道！你肯定过了一个假的2016！",
		link : "http://wx.gz.focus.cn/html/events_2016",
		imgUrl : 'http://wx.gz.focus.cn/html/events_2016/images/icon.jpg',
		success : function (res) {}
	});

});