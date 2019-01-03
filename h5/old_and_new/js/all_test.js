/* global Swiper, mywx */
$(function () {
	var isTouch = 'ontouchstart' in window;
	var EVENT = {
		start: isTouch ? 'touchstart' : 'mousedown',
		move: isTouch ? 'touchmove' : 'mousemove',
		end: isTouch ? 'touchend' : 'mouseup'
	};
	var VENDOR = /webkit/i.test(navigator.appVersion) ? 'webkit' : /firefox/i.test(navigator.userAgent) ? 'Moz' : /trident/i.test(navigator.userAgent) ? 'ms' : 'opera' in window ? 'O' : '';
  var H_WIN = window.innerHeight;

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

  var _swipe = function () {
    var $_swipe_list = $('.page-container');
    var $_swipe_item = $('.page');
    var isInited = false;
    var page2Timer = null;

    return {
      init: function init(id) {
        if (isInited) {
          return;
        }
        isInited = true;
        H_WIN = window.innerHeight;

        $_swipe_item.each(function () {
          $(this).css({
            height: H_WIN + 'px'
          });
        }).eq(0).addClass('page-cur');

        var point = { y: [] };
        var cur = 0;
        $_swipe_list.on(EVENT['start'], function (e) {
          var _e = isTouch ? e.originalEvent.touches[0] : e;
          point['y'] = [_e["pageY"]];
        }).on('transitionend', function (e) {
          $_swipe_item.removeClass('page-cur').eq(cur).addClass('page-cur');
        });

        $(document).on(EVENT['move'], function (e) {
          if (point['y'].length) {
            var _e = isTouch ? e.originalEvent.touches[0] : e;
            point['y'].push(_e["pageY"]);
            e.preventDefault();
          }
        });

        $(document).on(EVENT['end'], function (e) {
          if (point['y'].length > 1) {
            if (point['y'][0] - point['y'][point['y'].length - 1] > 50) {
              // 向上滑动
              ++cur > $_swipe_item.length - 1 && (cur = $_swipe_item.length - 1);
            } else if (point['y'][0] - point['y'][point['y'].length - 1] < -50) {
              // 向下滑动
              --cur < 0 && (cur = 0);
            }
            $_swipe_list.css('transform', 'translate3d(0,' + '-' + H_WIN * cur + 'px,0)');
            e.preventDefault();


            clearInterval(page2Timer);  // 清除第二页的循环切换

            if(cur == 0) {
              setTimeout(function() {
                show_num($("#num-scroller1"), "123161");
              }, 200);
              setTimeout(function() {
                show_num($("#num-scroller2"), "221936699309");
              }, 2500);
            } else if(cur == 1) {
              changeCircle();
              page2Timer = setInterval(function() {
                changeCircle();
              }, 4000);
            } else if(cur == 2) {
              $("#metro_lines")[0].pauseAnimations();
              $("#metro_lines").find("animate").each(function(i, el) {
                $(el).attr("begin", ((new Date()).getTime() - timeStart) / 1000 + 2 * i);
              });
              $("#metro_lines")[0].unpauseAnimations();
            } else if(cur == 4) {
              show_num($("#num-scroller3"), "3559921");
              show_num($("#num-scroller4"), "10370");
            } else if(cur == 5) {
              show_num($("#num-scroller5"), "100");
              show_num($("#num-scroller6"), "56");
            }
          }
          point['y'] = [];
        });
        window.addEventListener('orientationchange', function (e) {
          $_swipe_item.each(function () {
            $(this).css({
              height: H_WIN + 'px'
            });
          });
        });

        var ASSETS_WIDTH = 375;
        var default_scale = window.innerWidth / ASSETS_WIDTH;
        // ====== 第一页数字增长 =======
        setTimeout(function() {
          show_num($("#num-scroller1"), "123161");
        }, 200);
        setTimeout(function() {
          show_num($("#num-scroller2"), "221936699309");
        }, 2500);

        // ==== 按比例缩放第二页数据SVG =====
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


        // ==== 按比例缩放第三页地铁线SVG =====
        var metroLines = $("#metro_lines")[0];
        var w = window.innerWidth;
        var h = window.innerHeight;
        metroLines.width = 2 * w * 340 / 375;
        metroLines.height = 2 * h * 240 / 603;
        metroLines.style.width = w * 340 / 375;
        metroLines.style.height = h * 240 / 603;

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
      }
    };
  }();

  
  //添加预加载内容
  var res = [
    "http://wx.gz.focus.cn/css/old_and_new/logo.png",
    "http://wx.gz.focus.cn/css/old_and_new/2016.png",
    "http://wx.gz.focus.cn/css/old_and_new/2016_outside.png",
    "http://wx.gz.focus.cn/css/old_and_new/bg1.jpg",
    "http://wx.gz.focus.cn/css/old_and_new/bg2.jpg",
    "http://wx.gz.focus.cn/css/old_and_new/bg3.jpg",
    "http://wx.gz.focus.cn/css/old_and_new/bg4.jpg",
    "http://wx.gz.focus.cn/css/old_and_new/bg5.jpg",
    "http://wx.gz.focus.cn/css/old_and_new/bg6.jpg",
    "http://wx.gz.focus.cn/css/old_and_new/bg_star.jpg",
    "http://wx.gz.focus.cn/css/old_and_new/decoration.png",
    "http://wx.gz.focus.cn/css/old_and_new/green_bg.png",
    "http://wx.gz.focus.cn/css/old_and_new/logo.png",
    "http://wx.gz.focus.cn/css/old_and_new/meteor.png",
    "http://wx.gz.focus.cn/css/old_and_new/number.png",
    "http://wx.gz.focus.cn/css/old_and_new/page1_text1.png",
    "http://wx.gz.focus.cn/css/old_and_new/page1_text2.png",
    "http://wx.gz.focus.cn/css/old_and_new/page2_huangpu.png",
    "http://wx.gz.focus.cn/css/old_and_new/page2_huangpu_circle.png",
    "http://wx.gz.focus.cn/css/old_and_new/page2_panyu.png",
    "http://wx.gz.focus.cn/css/old_and_new/page2_panyu_circle.png",
    "http://wx.gz.focus.cn/css/old_and_new/page2_text1.png",
    "http://wx.gz.focus.cn/css/old_and_new/page2_zengcheng.png",
    "http://wx.gz.focus.cn/css/old_and_new/page2_zengcheng_circle.png",
    "http://wx.gz.focus.cn/css/old_and_new/page3_text1.png",
    "http://wx.gz.focus.cn/css/old_and_new/page3_text2.png",
    "http://wx.gz.focus.cn/css/old_and_new/page4_text1.png",
    "http://wx.gz.focus.cn/css/old_and_new/page4_text2.png",
    "http://wx.gz.focus.cn/css/old_and_new/page5_img1.png",
    "http://wx.gz.focus.cn/css/old_and_new/page5_img2.png",
    "http://wx.gz.focus.cn/css/old_and_new/page7_text1.png",
    "http://wx.gz.focus.cn/css/old_and_new/paticipate.png",
    "http://wx.gz.focus.cn/css/old_and_new/pie_chart.png",
    "http://wx.gz.focus.cn/css/old_and_new/s1.png",
    "http://wx.gz.focus.cn/css/old_and_new/s2.png",
    "http://wx.gz.focus.cn/css/old_and_new/s3.png",
    "http://wx.gz.focus.cn/css/old_and_new/share.png",
    "http://wx.gz.focus.cn/css/old_and_new/stars1.png",
    "http://wx.gz.focus.cn/css/old_and_new/stars2.png",
    "http://wx.gz.focus.cn/css/old_and_new/stars3.png",
    "http://wx.gz.focus.cn/css/old_and_new/stars4.png",
    "http://wx.gz.focus.cn/css/old_and_new/stars5.png",
    "http://wx.gz.focus.cn/css/old_and_new/stars6.png",
  ];

	loader.startLoad(res).handlerLoadComplete(function () {

    $(".wrap").css({"min-height": $(".wrap").width() * 1.608});

    var isLogined = false;
    var ua = navigator.userAgent;
    var userInfo;

    // 检查是否登录
    $.ajax({
      url: "http://login.focus.cn/passport/getUserInfo",
      dataType: "jsonp",
      success: function(data) {
        if(data.errorCode == 0 && $.trim(data.data.mobile) != "") {
          isLogined = true;
          userInfo = data.data;

          if(document.referrer.indexOf("http://login.focus.cn/") >= 0) {
            $(".page-container").hide();
            $(".recommend-view").show();
          }
        } else {
          isLogined = false;
        }
      }
    });

    if(paramToken != "") {  // 如果是转发的链接，则带有tokenA
      $(".page-container").hide();   // 跳过PPT部分
      if(wxToken == paramToken) {  // 如果是本人打开
        $(".help-view").show();
        if(globalPrize > 0) {
          $(".gift-view").show();
          if(globalPrize == 1) {
            // 显示美容券
            $(".cd-key").text(global_cd_key);
            $("[data-prize=" + globalPrize + "]").show();
          } else if(globalPrize == 2) {
            // 显示100购物卡
            $("[data-prize=" + globalPrize + "]").show();
          } else if(globalPrize == 3) {
            // 显示200购物卡
            $("[data-prize=" + globalPrize + "]").show();
          }
        }
      } else {                     // 如果是好友打开
        if(paramTokenB == "") {       // 没有tokenB，则显示好友助力页
          $(".friend-view").show();
        } else {                      // 有tokenB，则表示新用户从会员注册页返回，显示助力成功页
          $(".friend-view-finish").show();
        }
      }
    } else { // 如果是原生链接
      if(count > 0) {
        $(".page-container").hide();
        $(".help-view").show();
        if(globalPrize > 0) {
          $(".gift-view").show();
          if(globalPrize == 1) {
            // 显示美容券
            $(".cd-key").text(global_cd_key);
            $("[data-prize=" + globalPrize + "]").show();
          } else if(globalPrize == 2) {
            // 显示100购物卡
            $("[data-prize=" + globalPrize + "]").show();
          } else if(globalPrize == 3) {
            // 显示200购物卡
            $("[data-prize=" + globalPrize + "]").show();
          }
        }
      } else {
        $(".recommend-view").show();
        showThePPT();
      }
    }

    function showThePPT() {
      // 加入滑动箭头
      $(".page").each(function(i, item) {
        $(item).append('<div class="' + (i == $(".page").length - 1? "global-arrow-top" : "global-arrow-btm") + '">' +
                        '<svg width="38" height="22" version="1.1">' +
                          '<line x1="2" y1="20" x2="20" y2="2" style="stroke:#fff;stroke-width:4;"></line>' +
                          '<line x1="18" y1="2" x2="36" y2="20" style="stroke:#fff;stroke-width:4;"></line>' +
                        '</svg>' +
                      '</div>');
      });

      _swipe.init();

      // 重力感应效果
      // function motion(e) {
      //   var acceleration = e.accelerationIncludingGravity;

      //   if (acceleration && acceleration.x) {
      //     var x = acceleration.x * (/android/i.test(ua) ? 1 : -1);
      //     var y = acceleration.y * 1;
      //     // var z = acceleration.z;
      //     x = x > 4 ? 4 : x < -4 ? -4 : x;
      //     y = y > 6 ? 6 : y < -6 ? -6 : y;
      //     $(".page" + (mySwiper.activeIndex + 1) + " .star-layer").css('transform', 'translate3d(' + (x * 0.2).toFixed(2) + '%,' + (y * 0.2).toFixed(2) + '%,0)');
      //   }
      // }
      // window.addEventListener("webkitDevicemotion", function(e) {
      //   motion(e);
      // }, false);
      // window.addEventListener("devicemotion", function(e) {
      //   motion(e);
      // }, false);

      // 随机生成流星
      // setInterval(function() {
      //   var meteor = $("<div class='meteor'>");
      //   meteor.appendTo(".wrap").css({top: Math.random() * 2 * (getRandom(2) == 0? -1 : 1) + "rem"});
      //   setTimeout(function() {
      //     meteor.addClass("across");
      //   }, 200);
      //   setTimeout(function() {
      //     meteor.remove();
      //   }, 1200);
      // }, 2000);

      
    }


    // 点此参加
    $(".page6-img1").on("click", function() {
      $(".page-container").hide();
      // $(".recommend-view").show();
    });

    $(".one-more").on("click", function() {
      $(".page-container").show();
      showThePPT();
    });

    // 我想要
    $(".iwant").on("click", function() {
      if(isLogined) {
        $(".share").show();
        $.ajax({
          url: "http://wx.gz.focus.cn/game/OANPlus/",
          dataType: "json",
          success: function(data) {

          }
        });
        window.mywx && mywx.setData({
          title: wxuserInfo + "能不能从56万年终奖里分一杯羹就靠你了！",
          link : "http://wx.gz.focus.cn/game/OAN/" + wxToken + "?gid=51"
        });
      } else {
        location.href = "http://login.focus.cn/reg?ru=" + encodeURIComponent("http://wx.gz.focus.cn/game/OAN?gid=51");
      }
      return false;
    });

    // 助一臂之力
    $(".help-friend").on("click", function() {
      if(isLogined) {
        $(".mask, .tips-box").show();
      } else {
        location.href = "http://login.focus.cn/reg?ru=" + encodeURIComponent("http://wx.gz.focus.cn/game/OAN/" + paramToken + "?gid=51&tokenB=" + wxToken);
      }
      return false;
    });

    // 我也想要
    $(".iwant2").on("click", function() {
      location.href = "http://wx.gz.focus.cn/game/OAN?gid=51";
    });

    // 助力自己
    $(".help-myself").on("click", function() {
      $(".share").show();
      window.mywx && mywx.setData({
        title: wxuserInfo + "能不能从56万年终奖里分一杯羹就靠你了！",
        link : "http://wx.gz.focus.cn/game/OAN/" + wxToken + "?gid=51"
      });
      return false;
    });

    $(".share").on("click", function() {$(this).hide();});

    $(".close-tips-box").on("click", function() {
      $(".mask, .tips-box").hide();
      return false;
    });

    // 领取
    $(".get-gift").on("click", function() {
      var self = this;
      if(userInfo && $.trim(userInfo.mobile)) {
        $.ajax({
          url: "http://wx.gz.focus.cn/game/OANGift?gid=51",
          data: {
            name: userInfo.mobile,
            mobile: userInfo.mobile
          },
          dataType: "json",
          success: function(data) {
            if(data.code == 0) {
              if(data.data.prize == 1) {
                // 显示美容券
                $(".cd-key").text(data.data.cd_key);
                $("[data-prize=" + data.data.prize + "]").show();
              } else if(data.data.prize == 2) {
                // 显示100购物卡
                $("[data-prize=" + data.data.prize + "]").show();
              } else if(data.data.prize == 3) {
                // 显示200购物卡
                $("[data-prize=" + data.data.prize + "]").show();
              }

              $(".gift-view").show();
            } else if(data.code == 1002) {
              $(self).addClass("none").text("被抢光了").attr("disabled", "disabled");
            } else {
              alert("领取失败！");
            }
          },
          error: function(xhr, textStatus, errorThrown) {
            console.log(textStatus);
          }
        });
      } else {
        location.href = "http://login.focus.cn/login?ru=" + encodeURIComponent("http://wx.gz.focus.cn/game/OAN/" + wxToken + "?gid=51");
      }
    });


    var titles = [
      "我们准备了56万大礼，你还不来拿吗？",
      "2016广州楼市首份大数据曝光！最多人喜欢的户型居然是...",
      "2016广州楼市首份大数据曝光！最多人关注的地铁盘竟是...",
      "2016广州楼市首份大数据曝光！最多人关注的区域竟是...",
    ];

    var titleNum = getRandom(4);


    // 微信分享
    window.mywx && mywx.setData({
      title : count > 0? wxuserInfo + "能不能从56万年终奖里分一杯羹就靠你了！" : titles[titleNum],
      desc : "广州购房者偏好揭秘",
      link : "http://wx.gz.focus.cn/game/OAN/" + (count > 0? wxToken : "") + "?gid=51",
      imgUrl : 'http://wx.gz.focus.cn/css/old_and_new/icon.jpg',
      success : function (res) {}
    });

    window.mywx && mywx.setData({
      title : titles[titleNum],
      success : function (res) {}
    }, "onMenuShareTimeline");
	});
});

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

function getRandom(max,min){
  //max>x≥min
  max=max || 1;
  min=min || 0;
  return Math.floor(Math.random() * (max - min)) + min;
}

function changeCircle() {
  var $areaCircle = $(".area-circle");
  var tmp = $areaCircle.find(".third");
  $areaCircle.find(".first").removeClass("first").addClass("third");
  $areaCircle.find(".second").removeClass("second").addClass("first");
  tmp.removeClass("third").addClass("second");
  $(".area-map div.active").removeClass("active");
  $(".area-map").find("." + $areaCircle.find(".first")[0].classList.item(0)).addClass("active");
}