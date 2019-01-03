$(function(){
	const isTouch = ('ontouchstart' in window);
	const EVENT = {
		start: isTouch ? 'touchstart' : 'mousedown',
		move: isTouch ? 'touchmove' : 'mousemove',
		end: isTouch ? 'touchend' : 'mouseup'
	};
	const VENDOR = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
			(/firefox/i).test(navigator.userAgent) ? 'Moz' :
			(/trident/i).test(navigator.userAgent) ? 'ms' :
			'opera' in window ? 'O' : '';
	var H_WIN = window.innerHeight;

	var loader = (() => {
		var $_loading_box = $('#_loading_box');
		var $_loading_text = $('#_loading_text');
		var loader = new createjs.LoadQueue();

		var load_progess = (e) => {
			$_loading_text.length && $_loading_text.text('前方高能... '+(e.loaded * 100).toFixed(1) + "%");
		}
		var load_complete = (e) => {}

		loader.on("complete", (e) => {
			load_complete(e);
			$_loading_box.hide();
		});
		loader.on("progress", (e) => {
			load_progess(e)
		});

		return {
			getResult(id) {
				return loader.getResult(id);
			},
			startLoad(list){
				$_loading_box.show();
				loader.loadManifest(list);
				return this;
			},
			handlerLoadProgress(progess) {
				load_progess = progess || load_progess;
				return this;
			},
			handlerLoadComplete(complete) {
				load_complete = complete || load_complete;
				return this;
			}

		}

	})();

	var _swipe = (() => {
		var $_swipe_list = $('._swipe_list');
		var $_swipe_item = $('._swipe_item');
		var isInited = false;


		return {
			init(id) {
				if(isInited){return}
				isInited = true;
				H_WIN = window.innerHeight;

				$_swipe_item.each(function(){
					$(this).css({
						height: H_WIN + 'px'
					})
				}).eq(0).addClass('cur');

				var point={y:[]};
				var cur = 0;
				$_swipe_list.on(EVENT['start'], (e) => {
					var _e = isTouch ? e.touches[0] : e;
					point['y'] = [_e["pageY"]];
				}).on('transitionend', (e) => {
					$_swipe_item.removeClass('cur').eq(cur).addClass('cur');
				});
				$(document).on(EVENT['move'], (e) => {
					if (point['y'].length) {
						var _e = isTouch ? e.touches[0] : e;
						point['y'].push(_e["pageY"]);
						e.preventDefault();
					}
				});
				$(document).on(EVENT['end'], (e) => {
					if (point['y'].length > 1) {
						if (point['y'][0] - point['y'][point['y'].length-1] > 50) {
							// 向上滑动
							++cur > $_swipe_item.length - 1 && (cur = $_swipe_item.length - 1);
						}else if (point['y'][0] - point['y'][point['y'].length-1] < -50) {
							// 向下滑动
							--cur < 0 && (cur = 0);
						}
						$_swipe_list.css('transform', 'translate3d(0,' + '-' + (H_WIN * cur) + 'px,0)');
						e.preventDefault();
					}
					point['y'] = [];
				});
				window.addEventListener('orientationchange',function(e){
					$_swipe_item.each(function() {
						$(this).css({
							height: H_WIN + 'px'
						});
					});
				})
			}
		}
	})();






	let res = [
		{id:'bg',src:'./css/bg.jpg'},
		{id:'logo',src:'./css/logo.png'},
		{id:'page01-top',src:'./css/page01-top.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
		{id:'20-01',src:'./css/20/01.png'},
	];
	(()=>{
		var i = 37;
		var _i = '';
		while(i>0){
			_i = i < 10 ? ('0' + i) : ('' + i);
			res.push({id:'20-' + _i,src:'./css/20/' + _i + '.png'})
			i--;
		}
	})();
	console.log(res)
	loader.startLoad(res).handlerLoadComplete(() => {
		_swipe.init();
		setTimeout(function(){$('.bg').addClass('start')},1000);
	});



	var ua=navigator.userAgent;
	window.addEventListener("devicemotion", function(e){
		var acceleration = e.accelerationIncludingGravity;
		// $('#_loading_text').text(acceleration.x);

		if (acceleration && acceleration.x) {
			var x = acceleration.x * ((/android/i).test(ua)?-1:1);
			var y = acceleration.y * -1;
			// var z = acceleration.z;
			x = x > 4 ? 4 : x < -4 ? -4 : x;
			y = y > 6 ? 6 : y < -6 ? -6 : y;
			// $('#_loading_text').text(x+':'+y);
			var $bubbles = $('.bubbles');
			$bubbles.eq(1).css('transform','translate3d(' + (x*1.2).toFixed(2) + '%,' + (y*1.3).toFixed(2) + '%,0)');
			$bubbles.eq(0).css('transform','translate3d(' + (x*1.5).toFixed(2) + '%,' + (y*1.7).toFixed(2) + '%,0)');
			$('.bg-inner').css('transform','translate3d(' + (x*1).toFixed(2) + '%,' + (y*1.2).toFixed(2) + '%,0)');
		}
	}, false);















});