/* global Swiper */
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
	var res = [
		"images/logo.png"
	];

	loader.startLoad(res).handlerLoadComplete(function () {

    var wxToken = "test";
    var paramToken = "";
    var paramTokenB = "";
    var isLogined = false;
    var page2Timer = null;
    var ASSETS_WIDTH = 375;
    var default_scale = window.innerWidth / ASSETS_WIDTH;
    $.ajax({
      url: "http://login.focus.cn/passport/getUserInfo",
      dataType: "jsonp",
      success: function(data) {
        if(data.errorCode == 0 && $.trim(data.data.mobile) != "") {
          isLogined = true;

          if(document.referrer.indexOf("http://login.focus.cn/") >= 0) {
            $(".page-container").hide();
            $(".recommend-view").show();
          }
        } else {
          isLogined = false;
        }
      }
    });

    if(paramToken != "") {
      $(".page-container").hide();
      if(wxToken == paramToken) {
        $(".help-view").show();
      } else {
        if(paramTokenB == "") {
          $(".friend-view").show();
        } else {
          $(".friend-view-finish").show();
        }
      }
    }

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
      initialSlide: 0,
      wrapperClass: "page-wrapper",
      slideClass: "page",
      slideActiveClass: "page-cur",
      direction: 'vertical',
      onInit: function() {
        setTimeout(function() {
          show_num($("#num-scroller1"), "110000");
        }, 200);
        setTimeout(function() {
          show_num($("#num-scroller2"), "200000000");
        }, 2500);

        // ===========================
        $("#area-data").css({
          width: $(".area-circle").width(),
          height: $(".area-circle").height()
        });
        $("#area-data circle").each(function(i, e) {
          $(e).attr("cx", ($(e).attr("cx") * default_scale).toFixed(2));
          $(e).attr("cy", ($(e).attr("cy") * default_scale).toFixed(2));
          $(e).attr("r", ($(e).attr("r") * default_scale).toFixed(2));
        });
        $("#area-data path").each(function(i, e) {
          var tmp = $(e).attr("d").split(" ");
          for(var i = 0; i < tmp.length; i++) {
            if(!isNaN(tmp[i])) {
              tmp[i] = (tmp[i] * default_scale).toFixed(2);
            }
          }
          $(e).attr("d", tmp.join(" "));
        });
        $("#area-data text").each(function(i, e) {
          $(e).attr("x", ($(e).attr("x") * default_scale).toFixed(2));
          $(e).attr("y", ($(e).attr("y") * default_scale).toFixed(2));
        });

        // ================================
        $("#metro_lines path").each(function(i, e) {
          var tmp = $(e).attr("d").split(" ");
          for(var i = 0; i < tmp.length; i++) {
            if(!isNaN(tmp[i])) {
              tmp[i] = (tmp[i] * default_scale).toFixed(2);
            }
          }
          $(e).attr("d", tmp.join(" "));
        });
        $("#metro_lines text").each(function(i, e) {
          $(e).attr("x", ($(e).attr("x") * default_scale).toFixed(2));
          $(e).attr("y", ($(e).attr("y") * default_scale).toFixed(2));
        });
      },
      onSlideChangeEnd: function(swiper) {
        clearInterval(page2Timer);  // 清除第二页的循环切换

        if(swiper.activeIndex == 0) {
          setTimeout(function() {
            show_num($("#num-scroller1"), "110000");
          }, 200);
          setTimeout(function() {
            show_num($("#num-scroller2"), "200000000");
          }, 2500);
        } else if(swiper.activeIndex == 1) {
          page2Timer = setInterval(function() {
            var $areaCircle = $(".area-circle");
            var tmp = $areaCircle.find(".third");
            $areaCircle.find(".first").removeClass("first").addClass("third");
            $areaCircle.find(".second").removeClass("second").addClass("first");
            tmp.removeClass("third").addClass("second");
            $(".area-map div.active").removeClass("active");
            $(".area-map").find("." + $areaCircle.find(".first")[0].classList.item(0)).addClass("active");
          }, 6000);
        } else if(swiper.activeIndex == 4) {
          show_num($("#num-scroller3"), "3559921");
          show_num($("#num-scroller4"), "10370");
        } else if(swiper.activeIndex == 5) {
          show_num($("#num-scroller5"), "100");
          show_num($("#num-scroller6"), "56");
        }
      }
    });

    // 重力感应效果
		var ua = navigator.userAgent;
    function motion(e) {
      var acceleration = e.accelerationIncludingGravity;

      if (acceleration && acceleration.x) {
        var x = acceleration.x * (/android/i.test(ua) ? 1 : -1);
        var y = acceleration.y * 1;
        // var z = acceleration.z;
        x = x > 4 ? 4 : x < -4 ? -4 : x;
        y = y > 6 ? 6 : y < -6 ? -6 : y;
        $(".page" + (mySwiper.activeIndex + 1) + " .star-layer").css('transform', 'translate3d(' + (x * 0.2).toFixed(2) + '%,' + (y * 0.2).toFixed(2) + '%,0)');
      }
    }
    window.addEventListener("webkitDevicemotion", function(e) {
      motion(e);
    }, false);
    window.addEventListener("devicemotion", function(e) {
      motion(e);
    }, false);

    function getRandom(max,min){
      //max>x≥min
      max=max || 1;
      min=min || 0;
      return Math.floor(Math.random() * (max - min)) + min;
    }

    setInterval(function() {
      var meteor = $("<div class='meteor'>");
      meteor.appendTo(".wrap").css({top: Math.random() * 2 * (getRandom(2) == 0? -1 : 1) + "rem"});
      setTimeout(function() {
        meteor.addClass("across");
      }, 200);
      setTimeout(function() {
        meteor.remove();
      }, 1200);
    }, 2000);

    
    function show_num(obj, num){ 
      var len = num.length;
      var y = 0;
      var w = 0;
      var h = 0;
      var tmp;
      var tmp2 = 0;
      obj.empty(); 
      for(var i = len - 1; i >= 0; i--) {
        tmp = $("<i>");
        obj.prepend(tmp);
        if(++tmp2 == 3 && i != 0) {
          obj.prepend(", ");
          tmp2 = 0;
        }
        w = w || tmp.width().toFixed(2);
        h = w * 2;
        tmp.width(w);
        tmp.height(h);
        y = -parseInt(num.charAt(i)) * h; //y轴位置
        tmp.animate({backgroundPosition :'(0 '+ (20 * h + y) +'px)'}, 2000); 
      } 
		}

    var metroLines = $("#metro_lines")[0];
    var w = window.innerWidth;
    var h = window.innerHeight;
    metroLines.width = 2 * w * 340 / 375;
    metroLines.height = 2 * h * 240 / 603;
    metroLines.style.width = w * 340 / 375;
    metroLines.style.height = h * 240 / 603;

    $(".iwant").on("click", function() {
      if(isLogined) {
        $(".share").show();
      } else {
        location.href = "http://login.focus.cn/login?ru=" + encodeURIComponent("http://wx.gz.focus.cn/game/OAN?gid=51");
      }
      return false;
    });

    $(".share").on("click", function() {$(this).hide();});

    $(".page6-img1").on("click", function() {
      $(".page-container").hide();
      $(".recommend-view").show();
    });

    $(".help-friend").on("click", function() {
      if(isLogined) {
        $(".mask, .tips-box").show();
      } else {
        location.href = "http://login.focus.cn/login?ru=" + encodeURIComponent("http://wx.gz.focus.cn/game/OAN?gid=51&tokenB=" + wxToken);
      }
      return false;
    });

    $(".iwant2").on("click", function() {
      location.href = "http://wx.gz.focus.cn/game/OAN?gid=51";
    });

    $(".close-tips-box").on("click", function() {
      $(".mask, .tips-box").hide();
    });

    $(".help-myself").on("click", function() {
      $(".share").show();
    });

    $(".get-gift").on("click", function() {
      $.ajax({
        url: "http://wx.gz.focus.cn/game/OANGift?gid=51",
        success: function(data) {
          console.log(data);
        }
      });
    });
	});
});