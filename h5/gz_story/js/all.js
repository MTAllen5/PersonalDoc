$(function () {
	var isTouch = 'ontouchstart' in window;
	var EVENT = {
		start: isTouch ? 'touchstart' : 'mousedown',
		move: isTouch ? 'touchmove' : 'mousemove',
		end: isTouch ? 'touchend' : 'mouseup'
	};

	var loader = function () {
		var $_loading_box = $('#_loading_box');
		var $_loading_text = $('#_loading_text');
		var loader = new createjs.LoadQueue();

		var load_progess = function load_progess(e) {
			$_loading_text.length && $_loading_text.text(parseInt(e.loaded * 100) + "%");
		};
		var load_complete = function load_complete(e) {};

		loader.on("complete", function (e) {
			load_complete(e);
			$_loading_box.addClass("hidden").on('transitionend', function (e) {
				$(this).hide();
			});
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
				var H_WIN = window.innerHeight;


				$_swipe_item.each(function (i, item) {
					$(item).css({
						height: H_WIN + 'px'
					}).append('<div class="' + (i == $_swipe_item.length - 1? "global-arrow-top" : "global-arrow-btm") + '">' +
													'<svg width="38" height="22" version="1.1">' +
														'<line x1="2" y1="20" x2="20" y2="2" style="stroke:#fff;stroke-width:4;"></line>' +
														'<line x1="18" y1="2" x2="36" y2="20" style="stroke:#fff;stroke-width:4;"></line>' +
													'</svg>' +
												'</div>');
				}).eq(0).addClass('cur').show();

				var point = { y: [] };
				var cur = 0;

				$_swipe_list.on(EVENT.start, function (e) {
					var _e = isTouch ? e.touches[0] : e;
					point.y = [_e.pageY];
				}).on('transitionend', function (e) {
					$_swipe_item.removeClass('cur').eq(cur).addClass('cur');
				});
				$(document).on(EVENT.move, function (e) {
					if (point.y.length) {
						var _e = isTouch ? e.touches[0] : e;
						point.y.push(_e.pageY);
					}
				});
				$(document).on(EVENT.end, function (e) {
					var direction = true;
					if (point.y.length > 1) {
						if (point.y[0] - point.y[point.y.length - 1] > 50) {
							// 向上滑动
							++cur > $_swipe_item.length - 1 && (cur = $_swipe_item.length - 1);
						} else if (point.y[0] - point.y[point.y.length - 1] < -50) {
							// 向下滑动
							--cur < 0 && (cur = 0);
							direction = false;
						}
						// $_swipe_list.css('transform', 'translate3d(0,' + '-' + H_WIN * cur + 'px,0)');
						$_swipe_item.removeClass("cur2").css("opacity", 0).eq(cur).css("opacity", 1);

						if(cur == 1) {
							blingPoint.init(".page02-fg");
						} else {
							blingPoint.destroy();
						}

						if(cur <= 1) {
							$(".boy").css("opacity", 1);
						} else {
							$(".boy").css("opacity", 0);
						}
					}
					point.y = [];
				});
				window.addEventListener('orientationchange', function (e) {
					$_swipe_item.each(function () {
						$(this).css({
							height: H_WIN + 'px'
						});
					});
				});
			}
		};
	}();

	var blingPoint = (function() {
		var blingTimer;

		function createBlingPoint(el) {
			var pos, r, tmp;
			tmp = $('<i class="bling-point"></i>');
			pos = posRandom();
			r = radiusRandom();
			tmp.css({
				left: pos.x,
				top: pos.y,
				width: r,
				height: r,
				opacity: opacityRandom()
			}).on('transitionend', function () {
				$(this).remove();
			});
			$(el).append(tmp);
			setTimeout(function() {
				tmp.addClass("bubble");
			}, 100);
		}

		function posRandom() {
			return {
				x : Math.ceil(Math.random() * 100) + "%",
				y : "100%"
			};
		}

		function radiusRandom() {
			return Math.ceil(Math.random() * 5) + 1;
		}

		function opacityRandom() {
			return (Math.random() * 0.7 + 0.2).toFixed(2);
		}

		return {
			init: function(el) {
				$(el).empty();
				blingTimer = setInterval(function() {
					createBlingPoint(el);
				}, 400);
			},
			destroy: function() {
				clearInterval(blingTimer);
			}
		};
	}());

	var res = [
		"images/icon.png",
		"images/loading.png",
		"images/loading_light_1.png",
		"images/loading_light_2.png",
		"images/music.png",
		"images/page01-boy01.png",
		"images/page01-boy02.png",
		"images/page01-text01.png",
		"images/page01-text02.png",
		"images/page02-bg.jpg",
		"images/page02-fg.png",
		"images/page02-text.png",
		"images/page03-bg.jpg",
		"images/page03-text.png",
		"images/page04-bg.jpg",
		"images/page04-smoke.png",
		"images/page04-text.png",
		"images/page05-01.png",
		"images/page05-bg.jpg",
		"images/page05-fg.png",
		"images/page05-fg2.png",
		"images/page06-bg.jpg",
		"images/page06-text.png",
		"images/page07-bg01.jpg",
		"images/page07-bg02.jpg",
		"images/page07-text.png",
		"images/page08-bg.jpg",
		"images/page08-text.png",
		"images/page09-bg.jpg",
		"images/page09-text.png",
		"images/page10-bg.jpg",
		"images/page10-text.png",
		"images/page11-01.png",
		"images/page11-02.png",
		"images/page11-03.png",
		"images/page11-04.png",
		"images/page11-05.png",
		"images/page11-bg.jpg",
		"images/page11-decoration.png",
		"images/page11-logo.jpg"
	]; //这是添加预加载内容
	loader.startLoad(res).handlerLoadComplete(function () { //使用startLoad预加载文件，加载完成后执行handlerLoadComplete里面的方法
		_swipe.init();				//初始化屏幕滑动

		// 其他初始化
		$(window).on(EVENT.move, function (e) {
			e.preventDefault();
		});

		$("#musicIcon").on("click", function() {
			if($(this).hasClass("pause")) {
				$(this).removeClass("pause");
				$("#audio")[0].play();
			} else {
				$(this).addClass("pause");
				$("#audio")[0].pause();
			}
		});
	});
});