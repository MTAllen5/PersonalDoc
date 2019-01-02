(function() {
	if (!window.mywx) {
		var mywx = (function() {
			var isWeiXin = (function() {
				return ((/MicroMessenger/i).test(navigator.userAgent.toLowerCase()) ? true : false);
			})();
			var self = {};

			var newElement = function(tag) {
				return document.createElement(tag)
			};
			var mywxAjax = function(url, successFn, type) {
				if (!url) {
					return
				};
				successFn = typeof(successFn) == 'function' ? successFn : function() {}
				var request = new XMLHttpRequest();
				request.open(type ? type : "post", url, true);
				request.onreadystatechange = function() {
					if (request.readyState == 4 && request.status == 200) {
						var text = request.responseText;
						try {
							text = JSON.parse(text);
						} catch (e) {}
						successFn(text);
					}
				};
				request.send();
			}

			var newObject = function(ori) {
				var _new = {};
				for (var item in ori) {
					_new[item] = ori[item];
				}
				return _new;
			}

			var setConfig = function(res) {
				var selfList = self['jsApiList'];
				var isErr = false;
				var data = {
					appId: '',
					timestamp: '',
					nonceStr: '',
					signature: ''
				};
				for (var i in data) {
					data[i] = res[i];
					if (!data[i]) {
						isErr = true;
					}
				};
				data['debug'] = self['debug'] || false;

				data['jsApiList'] = selfList && selfList.length ? selfList : [
					'hideOptionMenu',
					'hideMenuItems',
					// 分享
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					// 录音
					'startRecord',
					'stopRecord',
					'onVoiceRecordEnd',
					'playVoice',
					'pauseVoice',
					'stopVoice',
					'onVoicePlayEnd',
					'uploadVoice',
					'downloadVoice',
					// 图片上传
					'chooseImage',
					'previewImage',
					'uploadImage',
					'downloadImage',
					// 支付
					'getNetworkType',
					'chooseWXPay'
					/*,
					'onMenuShareWeibo',
					'hideOptionMenu',
					'showOptionMenu',
					'showMenuItems'*/

				];
				if (!isErr) {
					//alert(JSON.stringify(data));
					wx.config(data);
				} else {
					console.log('api_config返回的信息有误')
				};
			}
			var SHARE_DATA = {
				'title': document.title,
				'desc': document.title,
				'link': location.href,
				'imgUrl': 'icon.png',
				success: function(res) {},
				trigger: function(res) {},
				cancel: function(res) {},
				fail: function(res) {},
				complete: function(res) {}
			}
			var SHARE_DATAS = {
				'onMenuShareTimeline': {},
				'onMenuShareAppMessage': {},
				'onMenuShareWeibo': {},
				'onMenuShareQQ': {}
			}
			var setShareData = isWeiXin ? (function(data, type) {
				var _arg = arguments;
				data = typeof(data) == 'object' ? data : {};
				var EVENT_NAMES = [
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareWeibo',
					'onMenuShareQQ'
				];
				try {
					if (type && EVENT_NAMES.indexOf(type) >= 0) {
						var newData = newObject(SHARE_DATA);
						for (var item in SHARE_DATA) {
							newData[item] = data[item] || SHARE_DATAS[type][item] || SHARE_DATA[item];
						}
						SHARE_DATAS[type] = newData;
						newData['success'] = function(res) {
							typeof(SHARE_DATA['success']) == 'function' && SHARE_DATA['success'](res, item);
						}
						window.wx && wx[type](newData);
					} else {

						for (var item in SHARE_DATA) {
							SHARE_DATA[item] = data[item] || SHARE_DATA[item];
						}
						EVENT_NAMES.forEach(function(item, i) {

							if (_arg.length === 0 && SHARE_DATAS[item]) {
								window.wx && wx[item](SHARE_DATAS[item]);
							} else {

								var newData = newObject(SHARE_DATA);
								SHARE_DATAS[item] = newData;
								newData['success'] = function(res) {
									typeof(SHARE_DATA['success']) == 'function' && SHARE_DATA['success'](res, item);
								}
								window.wx && wx[item](newData);
							}
						});

					};

				} catch (e) {
					console.log(e.message)
				}
			}) : (function() {});

			var inited = false;
			var ready_fn = [];

			var isJSSDKLoading = false;
			var isJSSDKLoaded = false;
			var isWXReady = false;

			var getJSSDK = function(cb) {
				if (isJSSDKLoading) {return}
				isJSSDKLoading = true;
				var wxScript = newElement('script');
				wxScript.src = '//res.wx.qq.com/open/js/jweixin-1.2.0.js';
				wxScript.onload = function(e) {
					isJSSDKLoaded = true;
					isJSSDKLoading = false;
					document.body.removeChild(wxScript);
					typeof(cb) === 'function' && cb();
				}
				wxScript.onerror = function(e) {
					isJSSDKLoading = false;
					document.body.removeChild(wxScript);
				}
				document.body.appendChild(wxScript);
			}
			var getConfigure = function() {
				if (!isJSSDKLoaded) {
					getJSSDK(getConfigure)
					return
				}
				var _script = newElement('script');

				// http://wx.gz.focus.cn
				_script.src = '/api/wxShareToken?callback=setWXConfig&isAjax=true&platform=' + self.platform + '&_r=' + (new Date()).getTime();
				document.body.appendChild(_script);
				_script.onload = function() {
					document.body.removeChild(_script);
				}
				wx.error(function(res) {
					var txt = '';
					try {
						txt = typeof(res) == 'object' ? JSON.stringify(res) : res;
					} catch (e) {
						// alert(res)
					}
					console.log('wx.error: ' + txt);
				});

				wx.ready(function() {
					setShareData();

					ready_fn.length ? ready_fn.forEach(function(fn, i) {
						fn()
					}) : self.ready();

					isWXReady = true;
				});
			}

			return {
				isWeiXin: isWeiXin,
				platform: '101', // platform 101: 搜狐焦点广州站, 108: 炫时文化
				debug: false,
				jsApiList: [],
				setData: function(data, type){
					this.init();
					setShareData(data, type)
				},
				ready: function(fn) {
					if (typeof(fn) == 'function') {
						ready_fn.indexOf(fn) < 0 && ready_fn.push(fn);
						if (isWXReady) {
							fn();
						}
					}
				},
				configure: getConfigure,
				init: function() {
					self = this;
					if (inited || !isWeiXin) {
						return self
					};

					this.configure();
					window.setWXConfig = function(r) {
						setConfig(r.data.signPackage);
					}

					return self;
				}
			}
		})();
		window.mywx = mywx;
	}
})();