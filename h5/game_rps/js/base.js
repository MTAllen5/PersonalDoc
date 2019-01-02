$(function () {
	var isTouch = 'ontouchstart' in window;
	var EVENT = {
		start: isTouch ? 'touchstart' : 'mousedown',
		move: isTouch ? 'touchmove' : 'mousemove',
		end: isTouch ? 'touchend' : 'mouseup'
	};

  $(".page-start").addClass("cur");
  $(".wrapper").css({"min-height": $(".wrapper").width() * 1.608});

  var game = (function() {
    var flip = false;                   // 出拳显示的方向标记，正为向左，负为向右
    var win = 0;
    var score = 0;
    var valAry = [];
    var life = 3;                       // 生命值
    var countdown = 3000;               // 单次猜拳的限定时间，赢的次数越多，限定时间约短
    var pauseCountdown = 0;
    var timer_countdown = null;
    var continuous_win = 0;

    // view元素
    var el_list = $(".rps-list");        // AI出拳显示框
    var el_life = $(".life-val");        // 生命值
    var el_countdown = $(".time-val");   // 倒计时
    var el_score = $(".score-val");      // 分数
    var el_point = $(".rps-point");      // 分数奖励显示框
    var el_rpsBtn = $(".rps-btn>div");   // 出拳按钮(Array)

    /*
     * 倒计时的处理函数
     * 
     * 如果倒计时为0,
     * 显示miss提示(mistake)
     * 此时如果生命值跌为0，则结束游戏
     * 否则重新出拳(createItem)，并重新倒计时
     * 
     */
    function countDown(isGoOn) {
      pauseCountdown = isGoOn? pauseCountdown : countdown;
      clearInterval(timer_countdown);

      timer_countdown = setInterval(function() {
        pauseCountdown -= 100;
        formatTime(pauseCountdown);

        if(pauseCountdown <= 0) {
          mistake();
          if(life <= 0) {
            gameOver();
          } else {
            createItem();
            countDown();
          }
        }

      }, 100);
    }

    // 创建AI出拳列表
    function createItem() {
      var item;
      switch(random(2)) {
        case 0: item = "rock"; valAry.unshift(0); break;
        case 1: item = "paper"; valAry.unshift(1); break;
        case 2: item = "scissors"; valAry.unshift(2);
      }
      el_list.prepend('<div class="rps-item' + (flip? ' flip' : '') + '" style="background-image: url(images/' + item + '.png);"></div>');
      flip = !flip;
    }

    function showPoint(pt) {
      el_point.append('<div class="rps-point-item" style="background-image: url(images/p_' + pt + '.png);"></div>');
    }

    function random(max, min) {
      return Math.floor(Math.random() * (max + 1)) + (min || 0);
    }

    function mistake() {
      el_life.find("i").eq(life - 1).addClass("miss");
      --life;
    }

    function formatTime(time) {
      time = parseFloat(time / 1000).toFixed(1);
      el_countdown.html(time + "s");
    }

    function pause() {
      clearInterval(timer_countdown);
    }

    function goon() {
      countDown(true);
    }

    function gameOver() {
      clearInterval(timer_countdown);
      submitScore(score);
      $(".score-result").html(score);
      $(".page").removeClass("cur");
      $(".page-result").addClass("cur");
    }

    function reset() {

    }

    function submitScore(score) {
      sendAjax({
        url: "http://wx.gz.focus.cn/game/single",
        data: {
          gid: 44,
          score: score
        },
        type: "jsonp"
      }, function(res) {
        alert(JSON.stringify(res));
      }, function(res) {

      });
    }

    function sendAjax(param, suc, err) {
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

    return {
      init: function() {
        el_list.empty();
        for(var i = 0; i < 6; i++) {
          createItem();
        }

        el_rpsBtn.on(EVENT.end, function() {
          clearInterval(timer_countdown);
          var val = $(this).data("value");
          if(countdown > 0) {
            var diff = val - valAry[3];
            if(diff == 0) {
              score += 5;
              showPoint(5);
              continuous_win = 0;
            } else if(diff == 1 || diff == -2) {
              if(++continuous_win > 5) {
                score += 10;
                showPoint(10);
              } else {
                score += 8;
                showPoint(8);
              }
              win++;
            } else {
              continuous_win = 0;
              mistake();
              if(life <= 0) {
                gameOver();
                return;
              }
            }
            el_score.html(score);
            createItem();
            countdown = win > 10? (win > 20? (win > 30? 500 : 1000) : 2000) : 3000;
            countDown();
          }
        });

        return this;
      },
      start: function() {
        countDown();
      },
      pause: pause,
      goon: goon,
      replay: reset
    };
  }());

  game.init();


  $("#startGame").on(EVENT.start, function() {
    $(".page").removeClass("cur").filter(".page-game").addClass("cur");
    game.start();
  });
  $("#instr").on(EVENT.start, function() {
    $(".mask, .instructions").show();
  });
  $("#instr-close").on(EVENT.start, function() {
    $(".mask, .instructions").hide();
  });
  $(".pause").on(EVENT.start, function() {
    $(".mask, .pause-box").show();
    game.pause();
  });
  $("#go-on").on(EVENT.start, function() {
    $(".mask, .pause-box").hide();
    game.goon();
  });
  $("#one-more").on(EVENT.start, function() {
    if(localStorage.getItem("game_rps_shared")) {
      game.replay();
    } else {
      $(".mask, .share-box").show();
    }
  });
  $(".share-box").on(EVENT.start, function() {
    $(".mask, .share-box").hide();
  });
  $("#rank").on(EVENT.start, function() {
    $(".mask, .rank-box").show();
  });
  $("#rank-close").on(EVENT.start, function() {
    $(".mask, .rank-box").hide();
  });


  // window.mywx && mywx.setData({
  //   title : "",
  //   desc : "",
  //   link : "http://wx.gz.focus.cn/html/game_rps",
  //   imgUrl : 'http://wx.gz.focus.cn/html/game_rps/images/icon.jpg',
  //   success : function (res) {
  //     localStorage.setItem("game_rps_shared", 1);
  //     console.log(res);
  //   }
  // });
});