/* global loginModule, raffleRotation, mywx, createjs */
$(function () {

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
    "images/logo.png",
    "images/btn_start.png",
    "images/btn_start2.png",
    "images/hd.png",
    "images/prize_type_1.png",
    "images/prize_type_2.png",
    "images/raffle_bg.png",
    "images/share.png",
    "images/gradient_bg.png",
    "images/close.png"
  ];

  loader.startLoad(res).handlerLoadComplete(function () {

    //其他初始化
    $(".wrapper").css({"min-height": $(".wrapper").width() * 1.608});

    // ======== 删除旧版本的本地数据 =======//
    localStorage.removeItem("fans_raffle_token");
    localStorage.removeItem("fans_raffle_pid");
    localStorage.removeItem("fans_raffle_rid");
    localStorage.removeItem("fans_raffle_unuserd");

    // 初始化抽奖
    loginModule.init(raffleRotation.init);

    // 获取中奖列表，如果有中奖，则显示最后的中奖信息
    raffleRotation.getMyList(function(data) {
      var prizeInfo = JSON.parse(data.data);
      if(prizeInfo.length > 0) {
        $(".winning-box h4 span").text(prizeInfo[prizeInfo.length - 1].prizeName);
        $(".mask").show();
        $(".winning-box").show();
      }
    });

    var fans_raffle_info = getStorage("fans_raffle_info") || {};
    var isLogined = fans_raffle_info.token? true : false;
    var unusedCount = fans_raffle_info.unusedRoundCount;

    if(isLogined && unusedCount >= 0) {
      $(".btn-start").addClass("active");
      $(".raffle-unuse-chances span").text(unusedCount);
    } else {
      $(".btn-start").removeClass("active");
    }

    $("#play").on("click", function() {
      raffleRotation.raffle(raffleAnimation);
    });

    function raffleAnimation(data) {
      var $raffleBox = $(".raffle-box");
      var startTime = 3;
      var roundTime = 1 * 8 + 4;
      var endTime = 0;
      var pointer = 0;
      var timer = null;
      var timer2 = null;
      var timer3 = null;

      function setPointer() {
        pointer = ++pointer > 8? 1 : pointer;
        return pointer;
      }

      $raffleBox.find(".prize").removeClass("active").filter(":nth-child(" + setPointer() + ")").addClass("active");
      timer = setInterval(function() {
        $raffleBox.find(".prize").removeClass("active").filter(":nth-child(" + setPointer() + ")").addClass("active");
        if(--startTime <= 0) {
          clearInterval(timer);
        }
      }, 500);
      setTimeout(function() {
        timer2 = setInterval(function() {
          $raffleBox.find(".prize").removeClass("active").filter(":nth-child(" + setPointer() + ")").addClass("active");
          if(--roundTime <= 0) {
            clearInterval(timer2);
          }
        }, 100);
      }, 1500);
      setTimeout(function() {
        timer3 = setInterval(function() {
          $raffleBox.find(".prize").removeClass("active").filter(":nth-child(" + setPointer() + ")").addClass("active");
          if(++endTime >= parseInt(data.roundInfo)) {
            clearInterval(timer3);
            $(".winning-box h4 span").text(data.prizeName);
            setTimeout(function() {
              $(".mask").show();
              $(".winning-box").show();
            }, 800);
          }
        }, 500);
      }, 2800);
    }

    $(".winning-close").on("click", function() {
      $(".mask, .winning-box").hide();
    });

    $(".login-close").on("click", function() {
      $(".mask, .login-box").hide();
    });

    $("#share_btn").on("click", function() {
      // $(".share-layer").show();
      $(".mask, .winning-box").hide();
    });
    $(".share-layer").on("click", function() {
      $(".share-layer").hide();
    });

    setInterval(function() {
      var $ul = $(".raffle-winner-list ul");
      $ul.animate({top: -$ul.find("li").height()}, function() {
        $ul.css({top: 0}).find("li:first-child").remove().appendTo($ul);
      });
    }, 3000);

    window.mywx && mywx.setData({
      title : "你有一份搜狐焦点定制的年终礼物在这里，请打开接收！！",
      desc : "人人有份，你敢来我敢送，奖品数量不封顶",
      link : "http://focus.impossiblemission.cn/html/fans_raffle/?timestamp=" + (new Date()).getTime(),
      imgUrl : 'http://wx.gz.focus.cn/html/fans_raffle/images/icon.jpg?v=20161221',
      success : function (res) {
        $(".share-layer").hide();
        // $(".winning-box").hide();
        // $(".cake-box").show();
      }
    });
  });
});

function getStorage(name) {
  return JSON.parse(localStorage.getItem(name));
}

function setStorage(name, value) {
  localStorage.setItem(name, JSON.stringify(value));
}