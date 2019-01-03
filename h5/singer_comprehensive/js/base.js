/* globals Swiper, mywx, IScroll */
$(function () {
  var isTouch = 'ontouchstart' in window;
  var EVENT = {
    start: isTouch ? 'touchstart' : 'mousedown',
    move: isTouch ? 'touchmove' : 'mousemove',
    end: isTouch ? 'touchend' : 'mouseup',
    tap: isTouch ? 'tap' : 'click'
  };

  var timer1, 
      timer2, 
      top = 2;  // 评论的热门条数




  // 首页轮播图
  new Swiper('.lunbo-container', {
    autoplay: 4000,
    pagination: '.swiper-pagination',
    onInit: function(swiper) {newDescMove(swiper);},
    onSlideChangeEnd: function(swiper) {newDescMove(swiper);}
  });

  // 轮播图描述左右晃动效果
  function newDescMove(swiper) {
    var activeSlide = $(swiper.slides[swiper.activeIndex]),
        activeDesc = activeSlide.find(".desc span"),
        distance = activeDesc.width() - activeSlide.find(".desc div").width();

    if(distance <= 0) {return;}

    // 清除计时器、停止动画、复位
    clearTimeout(timer1);
    clearInterval(timer2);
    $(swiper.slides).find(".desc span").stop().css({left: 0});

    // 当前焦点图的描述开始左右摇动
    timer1 = setTimeout(function() {
      move(activeDesc, distance);
      timer2 = setInterval(function() {
        move(activeDesc, distance);
      }, 8000);
    }, 1000);

  }

  // 左右摇动
  function move(activeDesc, distance) {
    activeDesc.animate({left: -distance}, 4000, "linear", function() {
      activeDesc.animate({left: 0}, 4000, "linear");
    });
  }

  


  // 导航栏效果
  var swiper = new Swiper(".nav", {
    slidesPerView: 4, 
    onInit: function() {$(".pointer").width($(".nav-box li").width());}
  });

  var scroll = new IScroll(".main-iscroll", {probeType: 3, click: true, mouseWheel: true});

  scroll.on("scroll", function() {
    if($(".nav-box").offset().top <= 0) {
      $(".nav-pin").css({opacity: 1, zIndex: 1});
    } else {
      $(".nav-pin").css({opacity: 0, zIndex: -1});
    }
  });

  scroll.on("scrollEnd", function() {
    var tmp = -99999;
    var tmpObj;
    $(".page").each(function(i, e) {
      var top = $(e).offset().top - $(".nav-pin").height();
      if(top <= 0 && top >= tmp) {
        tmp = top;
        tmpObj = e;
      }
    });
    var index = tmpObj? $(".nav-box a[href*=#" + $(tmpObj).attr("name") + "]").parent().index() : 0;
    $(".nav li").removeClass("active");
    $(".nav-box li:eq(" + index + ")").addClass("active");
    $(".nav-pin li:eq(" + index + ")").addClass("active");
    $(".nav .pointer").animate({left: $(".nav-box li:eq(" + index + ")").position().left}, 100);
    swiper.forEach(function(e) {e.slideTo(index);});
  });

  $('a[href^=#],area[href^=#]').on("click", function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var $target = $(this.hash);
      $target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
      if ($target.length) {
        var targetOffset = $target.offset().top + Math.abs(scroll.y) - $(".nav-pin").height();
        scroll.scrollTo(0, -targetOffset, 800, IScroll.utils.ease.quadratic);
        return false;
      }
    }
    // return false;
  });





  // 弹窗
  var version = "1.6"; 
  
  var popupModule = (function() {
    var versionNum = localStorage.getItem("singer_comprehensive_version");
    var popupp = localStorage.getItem("singer_comprehensive_popup");
    var signTime = popupp? new Date(parseInt(popupp)) : new Date("2000-01-01");
    var nowTime = new Date();

    function showPop() {
    	$(".mask").show();
      $(".popup").addClass("show");
    }

    function hidePop() {
    	$(".mask").hide();
      $(".popup").removeClass("show");
    }

    function setPopData() {
      localStorage.setItem("singer_comprehensive_version", version);
      localStorage.setItem("singer_comprehensive_popup", (new Date()).getTime());
    }

    function fullPopup(imgUrl, desc, title) {
      var popNews = $(".popNews").eq(0);
      var popBox = $(".popup");
      var popNewsInfo = {
        srcUrl: popNews.find("a").attr("href"),
        title: title || popNews.find(".title").text() || popNews.find(".desc").text(),
        imgUrl: imgUrl || popNews.find(".atlas img").eq(0).attr("src"),
        desc: desc
      };
      popBox.find("a").attr("href", popNewsInfo.srcUrl);
      popBox.find("img").attr("src", popNewsInfo.imgUrl);
      popBox.find(".desc").text(popNewsInfo.title);
      popBox.find(".popup-text").text(popNewsInfo.desc);
    }

    fullPopup("images/68.jpg", "2016年的最后一天！什么和跨年最配？当然是最美新歌声！来吧，“17”听听新歌声。", "【回顾】2016中国新歌声广州赛区迎最严初选");

    if(version != versionNum || signTime.getFullYear() < nowTime.getFullYear() || signTime.getMonth() < nowTime.getMonth() || signTime.getDate() < nowTime.getDate()) {
      setPopData();
      setTimeout(function() {
        showPop();
      }, 300);
    }

    $(".popup-close").on(EVENT.end, function() {
      hidePop();
    });

    return {
    	showPop: showPop,
    	hidePop: hidePop
    };
  }());






  var commentsModule = (function() {
    var user = null;
    var pages = 0;
    var curPage = 0;
    var commentsList = $(".comments-list ul");
    var commentcount = $("#comment-count");

    return {
      // 判断是否登录
      isLogin: function(suc, err) {
        this.sendAjax({
          url: "http://login.focus.cn/passport/getUserInfo",
          type: "jsonp"
        }, function(data) {
          if(data.errorCode == 1) { // 如果未登录则跳转到登录页面
            location.href = "http://login.focus.cn/login?ru=" + encodeURIComponent(window.location.href);
          } else if(data.errorCode == 0) {
            user = data.data;
            suc && suc(data.data);
          } else {
            alert("网络出错，登录失败！");
          }
        }, function(res) {
          console.log(res);
          err? err() : alert("网络出错");
        });
      },

      // 获取评论列表
      getCommentList: function(curPage, top) {
        var self = this;

        self.sendAjax({
          url: "http://wx.gz.focus.cn/xswh/commonList",
          type: "jsonp",
          data: {
            curPage: curPage,
            uid: user.uid
          },
        }, function(data) {
          console.log(data)
          if(data.code == 0) {
            self.renderPaginationBar(data.data);
            self.renderCommentList(data.data);
            commentcount.text(data.data.count);
            self.sendAjax({
              url: "http://wx.gz.focus.cn/xswh/commonList",
              type: "jsonp",
              data: {
                curPage: 0,
                top: top,
                uid: user.uid
              },
            }, function(data) {
              if(data.code == 0) {
                self.renderCommentList(data.data, "hot");
              }
            }, function(res) {
              console.log(res);
              alert("网络出错");
            });
          } else {
            console.log(data.msg);
          }
        }, function(res) {
          console.log(res);
          alert("网络出错");
        });
      },

      // 渲染评论列表模板
      renderCommentList: function(data, hot) {
        var html = "";
        for(var i = 0; i < data.comments.length; i++) {
          if(unescape(data.comments[i].content) == "") {
            continue;
          }
          html += "<li class=\"" + (hot? hot : "") + "\" data-id=\"" + data.comments[i].comment_id + "\">" +
                    "<img class=\"portrait\" src=\"" + (data.comments[i].icon? data.comments[i].icon : "images/portrait.png") + "\">" +
                    "<div class=\"comments-user\">" + data.comments[i].username + "</div>" +
                    "<p class=\"comments-other\">" + data.comments[i].time + "</p>" +
                    "<div class=\"comments-content\">" + unescape(data.comments[i].content) + "</div>" +
                    "<span class=\"like" + (data.comments[i].is_like == 1? " liked" : "") + "\"><i></i><span>" + data.comments[i].likes_count + "</span></span>" +
                  "</li>";
        }
        hot? commentsList.prepend(html) : commentsList.html(html);
        // iscroll = new IScroll(".comments-list");
      },

      // 发送评论
      submitComment: function(content, suc) {
        var self = this;
        this.sendAjax({
          url: "http://wx.gz.focus.cn/xswh/commentNew",
          type: "jsonp", 
          data: {
            uid: user.uid,
            username: user.nickName || user.userName,
            mobile: user.mobile,
            content: escape(content)
          }
        }, function(data) {
          if(data.code == 0) {
            self.getCommentList(0, top);
            suc && suc();
          }
        }, function(res) {
          console.log(res);
          alert("网络出错");
        });
      },

      // 点赞
      likeTheComment: function(id, cbk) {
        this.sendAjax({
          url: "http://wx.gz.focus.cn/xswh/commonLike",
          type: "jsonp",
          data: {
            comment_id: id,
            userID: user.uid
          }
        }, function(data) {
          console.log(data);
          if(data.code == 0) {
            cbk && cbk();
          }
        }, function(res) {
          console.log(res);
          alert("网络出错");
        });
      },

      // 渲染页码条
      renderPaginationBar: function(data) {
        pages = data.pages;
        curPage = parseInt(data.curPage);
        $(".pagination-bar span").show();
        if(curPage <= 0) {
          $(".pagination-bar .prev").hide();
        }
        if(curPage >= pages - 1) {
          $(".pagination-bar .next").hide();
        }
      },

      getPages: function() {
        return pages;
      },

      getCurPage: function() {
        return curPage;
      },

      sendAjax: function(param, suc, err) {
        if (typeof param !== "object") throw new Error("ajax 传参格式错误");
        $.ajax({
          url:param.url,
          data: param.data,
          dataType: param.type,
          // type: "GET",
          timeout: 10000,
          success: function(data) {
            if (typeof suc !== "function") throw new Error("ajax 成功回调未传或格式错误");
            suc(data);
          },
          error: function() {
            if (err === undefined) return;
            if (typeof err !== "function") throw new Error("ajax 失败回调未传或格式错误");
            err();
          },
          complete: function(xhr, status) {
            if (err === undefined) return;
            if (status == "abort" || status == "timeout") {
              err();
              alert("您的网络繁忙,请稍候再试");
            }
          }
        });
      }
    };
  }());

  

  // 评论条
  $(".comments-bar").on(EVENT.end, function() {
    commentsModule.isLogin(function() {
      $(".main").addClass("rotate");
      $(".comments-module").removeClass("rotate");
      commentsModule.getCommentList(0, top);
    });
  });

  $(".back").on(EVENT.end, function() {
    $(".comments-module").addClass("rotate");
    $(".main").removeClass("rotate");
  });


  // 发送评论
  $("#publish").on(EVENT.end, function() {
    var ctn = $.trim($("[name=comments-text]").val()),
        self = this;

    $(self).attr("disabled", "disabled").addClass("sending");

    if(ctn === "") {
      alert("请输入评论内容！");
      $(self).removeAttr("disabled").removeClass("sending");
      return;
    }

    commentsModule.submitComment(ctn, function() {
      $(".tips").show();
      setTimeout(function() {
        $(".tips").addClass("show");
      }, 100);
      setTimeout(function() {
        $(".tips").removeClass("show");
      }, 1800);
      $(self).removeAttr("disabled").removeClass("sending");
      $("[name=comments-text]").val("");
    });
  });

  // 点赞
  $(".comments-list").on(EVENT.end, ".like", function() {
    var self = this;
    commentsModule.likeTheComment($(this).parent().data("id"), function() {
      if($(self).hasClass("liked")) {
        $(self).removeClass("liked");
        $(self).html("<i></i>" + (parseInt($(self).text()) - 1));
      } else {
        $(self).addClass("liked");
        $(self).html("<i></i>" + (parseInt($(self).text()) + 1));
      }
    });
  });

  $("[name=comments-text]").on("focus", function() {
    $("body").animate({scrollTop: $("body").height()});
  });


  // 页码条
  $(".pagination-bar .start").on(EVENT.end, function() {
    commentsModule.getCommentList(0, top);
  });
  $(".pagination-bar .end").on(EVENT.end, function() {
    commentsModule.getCommentList(commentsModule.getPages() - 1, top);
  });
  $(".pagination-bar .next").on(EVENT.end, function() {
    commentsModule.getCommentList(commentsModule.getCurPage() + 1, top);
  });
  $(".pagination-bar .prev").on(EVENT.end, function() {
    commentsModule.getCommentList(commentsModule.getCurPage() - 1, top);
  });


  // 微信分享
  window.mywx && mywx.setData({
    title : "《中国新歌声》广州赛区海选正式启动！",
    desc : "11月19日，第二季《中国新歌声》广州赛区海选启动仪式暨首场初选正式开唱！",
    link : "http://wx.gz.focus.cn/html/singer_comprehensive",
    imgUrl : 'http://wx.gz.focus.cn/html/singer_comprehensive/images/icon.jpg',
    success : function (res) {}
  });
});