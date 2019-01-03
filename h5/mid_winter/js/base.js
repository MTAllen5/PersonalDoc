/* global createjs */
var globalInfo = {};
var isAjaxing = false;
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
      $_loading_text.length && $_loading_text.text('汤圆正在制作中... ' + (e.loaded * 100).toFixed(1) + "%");
    };
    var load_complete = function load_complete(e) {};

    loader.on("complete", function (e) {
      $_loading_box.hide();
      load_complete(e);
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
    {id: "btn_close", src: "images/btn_close.png"},
    {id: "btn_more", src: "images/btn_more.png"},
    {id: "btn_replay", src: "images/btn_replay.png"},
    {id: "btn_rule", src: "images/btn_rule.png"},
    {id: "btn_start", src: "images/btn_start.png"},
    {id: "btn_submit", src: "images/btn_submit.png"},
    {id: "close", src: "images/close.png"},
    {id: "cover", src: "images/cover.jpg"},
    {id: "egg", src: "images/egg.png"},
    {id: "egg2", src: "images/egg2.png"},
    {id: "go", src: "images/go.png"},
    {id: "hammer", src: "images/hammer.png"},
    {id: "logo", src: "images/logo.png"},
    {id: "lose_bg", src: "images/lose_bg.png"},
    {id: "raffle_bg", src: "images/raffle_bg.jpg"},
    {id: "ready", src: "images/ready.png"},
    {id: "game_bg", src: "images/game_bg.jpg"},
    {id: "hand", src: "images/hand.png"},
    {id: "dessert", src: "images/dessert.png"},
    {id: "count_down", src: "images/countdown.png"},
    {id: "score", src: "images/score.png"},
    {id: "rule", src: "images/rule.png"},
    {id: "share", src: "images/share.png"},
    {id: "sign_bg", src: "images/sign_bg.png"},
    {id: "win_bg", src: "images/win_bg.png"},
    {id: "clip_mp3", src: "res/clip.mp3"},
    {id: "bg_mp3", src: "res/bg.mp3"},
    {id: "readygo_mp3", src: "res/readygo.mp3"}
  ];

  loader.startLoad(res).handlerLoadComplete(function () {

    function getStorage(name) {
      return JSON.parse(localStorage.getItem(name));
    }

    function setStorage(name, value) {
      localStorage.setItem(name, JSON.stringify(value));
    }

    function isNewDay(oldDay) {
      if(!oldDay) return true;
      else {
        var newDay = new Date();
        oldDay = new Date(oldDay);
        return newDay.getFullYear() > oldDay.getFullYear() || newDay.getMonth() > oldDay.getMonth() || newDay.getDate() > oldDay.getDate();
      }
    }

    function showRule() {
      $(".mask, .rule").show();
    }

    function hideRule() {
      $(".mask, .rule").hide();
    }

    function showSign() {
      $(".mask, .sign").show();
    }

    function hideSign() {
      $(".mask, .sign").hide();
    }

    function showNoChance(text) {
      $(".mask").show();
      $(".nochance").show().find("h2").text(text);
    }

    function showResult(result, isLose) {
      globalInfo = getStorage("mid_winter_info");
      var remain = globalInfo.raffleCount - globalInfo.usedCount;
      var $box = isLose? $(".lose") : (result.prizeInfo == "尚未中奖"? $(".lose") : $(".win"));
      if(remain == 0) {
        $box.find("h5").hide();
        if(!globalInfo.isShared) {
          $box.find(".btn-close").hide();
          $box.find(".btn-more").show();
        } else {
          $box.find(".btn-close").show();
          $box.find(".btn-more").hide();
          $box.find(".btn-close").on(EVENT.start, function() {showNoChance("机会用完了~");});
        }
      }
      $box.find("h5 span").text(remain);
      $box.show();
      $(".mask").show();
      if($box[0].className.indexOf("win") > -1) {
        $(".win h2 span").text(result.prizeInfo);
      }
    }

    $(".wrapper").css({"min-height": $(".wrapper").width() * 1.608});

    globalInfo = getStorage("mid_winter_info") || {};

    var signModule = {
      getSMScode: function(phone, cbk) {
        $.ajax({
          type:'get',
          url:'http://wx.gz.focus.cn/api/getMobileCode',
          dataType:'jsonp',
          data: {
            mobile: phone,
          },
          success: function(data) {
            if(data.code == 0) {
              cbk && cbk();
            } else {
              alert("网络出现问题，请稍后再试");
              console.log(JSON.stringify(data));
            }
          }
        });
      },
      regInfo: function(nickname, phone, smscode, raffleCount, cbk) {
        $.ajax({
          type:'get',
          url:'http://wx.gz.focus.cn/lotteryApi/regInfo',
          dataType:'jsonp',
          data: {
            username: nickname,
            mobile: phone,
            code: smscode,
            gid: 49,
            count: raffleCount
          },
          success: function(data) {
            if(data.code == 0) {
              cbk && cbk();
            } else {
              alert("网络出现问题，请稍后再试");
              console.log(JSON.stringify(data));
            }
          }
        });
      },
      getRaffleResult: function(phone, cbk) {
        $.ajax({
          type: "get",
          url: "http://wx.gz.focus.cn/lotteryApi/getResult",
          dataType: "jsonp",
          data: {
            lid: 1,
            gid: 49,
            mobile: phone
          },
          success: function(data) {
            if(data.code == 0) {
              cbk && cbk(data.data);
            } else if(data.code == 1001) { // 尚未登记信息
              showSign();
            } else if(data.code == 1002) { // 已中奖
              cbk(data.data, true);
            } else if(data.code == 1003) { // 机会用完
              showNoChance("机会用完了~");
            } else {
              alert("系统出现问题");
              console.log(data);
            }
          }
        });
      }
    };

    $(".btn-rule").on(EVENT.start, showRule);

    $("#rule-close").on(EVENT.start, hideRule);

    $(".sign-close").on(EVENT.start, hideSign);

    $(".btn-replay").on(EVENT.start, function() {location.href = location.href + "?timestamp=" + (new Date()).getTime();});

    $(".btn-more").on(EVENT.start, function() {$(".share").show();});

    $(".share").on(EVENT.start, function() {$(".share").hide();});

    $("#win-close").on(EVENT.start, function() {
      $(".win, .mask").hide();
      $(".raffle-eggs-box span").removeClass("break");
      $(".raffle-hammer").removeClass("hit");
    });

    $("#lose-close").on(EVENT.start, function() {
      $(".lose, .mask").hide();
      $(".raffle-eggs-box span").removeClass("break");
      $(".raffle-hammer").removeClass("hit");
    });

    // 开始游戏
    $(".btn-start").on(EVENT.start, function() {

      if(isNewDay(globalInfo.date)) {
        // 重置
        globalInfo = {};
        setStorage("mid_winter_info", globalInfo);
      }
      
      globalInfo.date = (new Date()).getTime();
      if(globalInfo.raffleCount && globalInfo.raffleCount > 0 && globalInfo.usedCount < globalInfo.raffleCount) {
        // 跳到砸蛋页面
        $(".raffle-chance span").text(globalInfo.raffleCount);
        $(".page").removeClass("cur").filter(".page-raffle").addClass("cur");
      } else {
        // 进入游戏
        $(".page").removeClass("cur").filter(".page-game").addClass("cur");
        game(loader).start();
      }
    });


    // 获取验证码
    $("#getSMScode").on(EVENT.start, function() {
      var self = this;
      var phone = $("[name=phone]").val();

      if(!/^1[34578]\d{9}$/.test(phone)) {
        alert("手机号码格式不正确");
        return false;
      }

      signModule.getSMScode(phone, function() {
        var timer, count = 60;
        $(self).text("已发送60s").attr("disabled", "disabled");
        timer = setInterval(function() {
          $(self).text("已发送" + (--count) + "s");
          if(count <= 0) {
            clearInterval(timer);
            $(self).text("发送验证码").removeAttr("disabled");
          }
        }, 1000);
      });

      return false;
    });


    // 提交注册信息
    $("#submitInfo").on(EVENT.start, function() {
      var nickname = $("[name=nickname]").val();
      var phone = $("[name=phone]").val();
      var smscode = $("[name=smscode]").val();
      var raffleCount = globalInfo.raffleCount + 1;

      if($.trim(nickname) == "") {
        alert("姓名不能为空");
        return false;
      }
      if(!/^1[34578]\d{9}$/.test(phone)) {
        alert("手机号码格式不正确");
        return false;
      }
      if($.trim(smscode) == "") {
        alert("验证码不能为空");
        return false;
      }

      signModule.regInfo(nickname, phone, smscode, raffleCount, function() {
        globalInfo.isLogined = true;
        globalInfo.phone = phone;
        globalInfo.usedCount = 0;
        setStorage("mid_winter_info", globalInfo); // 登录成功后保存信息在本地
        hideSign();
      });

      return false;
    });


    // 砸蛋
    $(".raffle-eggs-box span").on(EVENT.start, function(e) {
      if(isAjaxing) {
        return;
      }

      var self = this,
          $hammer = $(".raffle-hammer"),
          pt = $(e.target).position();

      if(!globalInfo.isLogined) {
        showSign();
        return false;
      }

      if(globalInfo.raffleCount == 0) {
        showNoChance("没有砸蛋机会哦");
        return false;
      }

      if(globalInfo.raffleCount <= globalInfo.usedCount) {
        showNoChance("机会用完了~");
        return false;
      }

      isAjaxing = true;

      // 锤子动效
      $hammer.animate({top: pt.top - $hammer.height() / 2, left: pt.left + $hammer.width() / 2}, 800, "swing", function() {
        $(this).addClass("hit");
        setTimeout(function() {
          $(self).addClass("break");

          // 获取抽奖结果
          signModule.getRaffleResult(globalInfo.phone, function(data, isLose) {
            globalInfo = getStorage("mid_winter_info");
            globalInfo.usedCount++;
            setStorage("mid_winter_info", globalInfo);
            showResult(data, isLose);
            isAjaxing = false;
          });
        }, 1800);
      });

      return false;
    });

    window.mywx && mywx.setData({
      title : "汤圆会跑！",
      desc : "99.9%的人夹不到10个！",
      link : "http://wx.gz.focus.cn/html/mid_winter?timestamp=" + (new Date()).getTime(),
      imgUrl : 'http://wx.gz.focus.cn/html/mid_winter/images/icon.jpg',
      success : function () {
        globalInfo = getStorage("mid_winter_info");
        if(!globalInfo.isShared) {
          globalInfo.raffleCount++;
          globalInfo.isShared = true;
        }
        setStorage("mid_winter_info", globalInfo);

        $(".share, .mask, .win, .lose, .nochance").hide();
        $(".raffle-eggs-box span").removeClass("break");
        $(".raffle-hammer").removeClass("hit");
      }
    });
  });
});