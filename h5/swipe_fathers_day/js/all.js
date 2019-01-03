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
	var res = [
    "/images/bg.jpg",
    "/images/bg2.jpg",
    "/images/comments-title.png",
    "/images/header.png",
    "/images/heart.png",
    "/images/heart_unlike.png",
    "/images/info-btn.png",
    "/images/info-title.png",
    "/images/logo.png",
    "/images/page1-hero.png",
    "/images/page1-seal.png",
    "/images/page1-text1.png",
    "/images/page1-text2.png",
    "/images/page1-text3.png",
    "/images/page1-yan.png",
    "/images/page2-hero.png",
    "/images/page2-text1.png",
    "/images/page2-text2.png",
    "/images/page3-hero.png",
    "/images/page3-text1.png",
    "/images/page3-text2.png",
    "/images/page4-hero.png",
    "/images/page4-text1.png",
    "/images/page4-text2.png",
    "/images/page5-hero.png",
    "/images/page5-text1.png",
    "/images/page5-text2.png",
    "/images/page6-img.png",
    "/images/page6-text1.png",
    "/images/page6-text2.png",
    "/images/page7-btn.png",
    "/images/page7-text1.png"
  ];

	loader.startLoad(res).handlerLoadComplete(function () {

		// 加入滑动箭头
		$(".page").each(function(i, item) {
			$(item).append('<div class="' + (i == $(".page").length - 1? "global-arrow-top" : "global-arrow-btm") + '">' +
            					'<svg width="38" height="22" version="1.1">' +
              					'<line x1="2" y1="20" x2="20" y2="2" style="stroke:#cc1213;stroke-width:4;"></line>' +
              					'<line x1="18" y1="2" x2="36" y2="20" style="stroke:#cc1213;stroke-width:4;"></line>' +
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
			if($(this).hasClass("play")) {
				$(this).removeClass("play");
				$("#audio")[0].pause();
			} else {
				$(this).addClass("play");
				$("#audio")[0].play();
			}
		});

	  //其他初始化
	  function sendComment(content) {
	  	$.ajax({
				url: "/commentApi/commentNew",
				dataType: "json",
				data: {
					username: isLogin.name,
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
            $("#conmment").val("");
            $(".page-container").hide();
            $(".comments-list").show();
          } else {
            alert("网络出现点问题哦~");
          }
				}
			});
	  }

	  function getComment() {
      $.ajax({
        url: "/commentApi/commentList",
        dataType: "json",
        data: {
          type: "swipe_fathers_day",
          pageSize: 5000,
          uid: GDATA.token
        },
        success: function(result) {
          var html = "";
          var comments;
          if(result.code == 0) {
            comments = result.data.comments;
            comments.sort(function(a, b) {
              return b.likes_count - a.likes_count;
            });
            for(var i = 0; i < comments.length; i++) {
              html += '<li>' +
              					'<span class="comment-rank">' + (i + 1) + '</span>' +
                        '<img class="comment-img" src="' + comments[i].icon + '">' +
                        '<div class="comment-ctn"><strong>' + comments[i].username + '：</strong>' + unescape(comments[i].content) + '</div>' +
                        '<span class="comment-likes' + (comments[i].is_like == 0? '' : ' liked') + '" data-cid="' + comments[i].comment_id + '">' + comments[i].likes_count + '</span>' +
                      '</li>';
            }
          } else if(result.code == 1001) {
            html += "<li style='display: block; text-align: center; padding: .1rem 0; font-size: .14rem;'>暂无告白~</li>";
          }
          $(".comments-list ul").html(html);
        }
      });
    }

    function setNum(cid, cbk) {
      $.ajax({
        url: "/commentApi/CommentLike",
        dataType: "json",
        data: {
          comment_id: cid,
          type: "swipe_fathers_day",
          uid: GDATA.token
        },
        success: function(result) {
          if(result.code === 0) {
            cbk && cbk();
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

	  	var userInfo = {
	  		name: name,
	  		mobile: mobile
	  	}
	  	localStorage.setItem("is_login_swipe_father_day", JSON.stringify(userInfo));
	  	isLogin = userInfo;

	  	$(".mask, .info").hide();
      $("#submit").trigger("click");
	  });


	  $(".comments-list").on("click", ".comment-likes", function() {
	  	var _this = this;
	  	setNum($(_this).data("cid"), function() {
	  		$(_this).toggleClass("liked");
        if($(_this).hasClass("liked")) {
          $(_this).text(Number($(_this).text()) + 1);
        } else {
          $(_this).text(Number($(_this).text()) - 1);
        }
	  	});
	  });

    $("#oneMore").on("click", function() {
      window.location = "http://wx.gz.focus.cn/game/single/?gid=62";
    });

    $("#oneMoreCom").on("click", function() {
      $(".page-container").show();
      $(".comments-list").hide();
    });

    mywx.setData({
      'title': '今年父亲节你还在晒老照片吗？',
      'desc': '看恒大生态世纪城带你玩转新花样！漫画版老爸已全面上线，欢迎来晒！',
      'link': 'http://wx.gz.focus.cn/game/single/?gid=62',
      'imgUrl': 'http://wx.gz.focus.cn/css/swipe_fathers_day/res/images/icon.jpg'
    });
	});
});