/* global createjs */
var game = function(loader) {

  var cliping = false; // 是否正在夹东西
  var cliped = false; // 是否已夹中东西
  var clipedItem = null; // 被夹中的东西
  var clipSpeed = 4; // 筷子上升下探的速度

  var bg_mp3 = $("#bg_mp3")[0];
  var clip_mp3 = $("#clip_mp3")[0];
  var readygo_mp3 = $("#readygo_mp3")[0];

  // 初始化画布
  var stage = new createjs.Stage("game");
  var w = $(".wrapper").width();
  var h = $(".wrapper").height();
  var ASSETS_WIDTH = 750;
  var ASSETS_HEIGHT = 1206;
  var default_scaleX = Number(w * 2 / ASSETS_WIDTH).toFixed(2);
  var default_scaleY = Number(h * 2 / ASSETS_HEIGHT).toFixed(2);
  stage.canvas.width = w * 2;
  stage.canvas.height = h * 2;
  stage.canvas.style.width = w + "px";
  stage.canvas.style.height = h + "px";
  createjs.Touch.enable(stage);

  // 初始化容器
  var container = new createjs.Container();
  stage.addChild(container);

  // 背景图
  var mt = new createjs.Matrix2D(); // 缩小
  mt.scale(default_scaleX, default_scaleY);
  var gameBg = new createjs.Bitmap(loader.getResult("game_bg"));
  gameBg.regX = gameBg.getBounds().width / 2;
  gameBg.regY = gameBg.getBounds().height / 2;
  gameBg.x = w;
  gameBg.y = h;
  gameBg.scaleX = default_scaleX;
  gameBg.scaleY = default_scaleY;
  container.addChild(gameBg);

  // 倒计时
  var countDownCtn = new createjs.Container();
  countDownCtn.x = 50 * default_scaleX;
  countDownCtn.y = 36 * default_scaleY;
  var countDownBg = new createjs.Shape();
  countDownBg.graphics.beginBitmapFill(loader.getResult("count_down"), "no-repeat", mt).drawRect(0, 0, 249 * default_scaleX, 98 * default_scaleY);
  var countDownText = new createjs.Text("60", "bold " + 40 * default_scaleX + "px Arial", "#7c1e1e");
  countDownText.x = 144 * default_scaleX;
  countDownText.y = 26 * default_scaleY;
  countDownCtn.addChild(countDownBg, countDownText);
  container.addChild(countDownCtn);

  // 计分器
  var scoreCtn = new createjs.Container();
  scoreCtn.x = 440 * default_scaleX;
  scoreCtn.y = 42 * default_scaleY;
  var scoreBg = new createjs.Shape();
  scoreBg.graphics.beginBitmapFill(loader.getResult("score"), "no-repeat", mt).drawRect(0, 0, 259 * default_scaleX, 86 * default_scaleY);
  var scoreText = new createjs.Text("0", "bold " + 40 * default_scaleX + "px Arial", "#7c1e1e");
  scoreText.x = 166 * default_scaleX;
  scoreText.y = 18 * default_scaleY;
  scoreCtn.addChild(scoreBg, scoreText);
  container.addChild(scoreCtn);

  // 夹筷子的手
  var handModule = (function() {
    var hand = new createjs.Bitmap(loader.getResult("hand"));
    var handBounds = hand.getBounds();
    // hand.setTransform(w / 2, 0, 0.5, 0.5, 0, 0, 0, handBounds.width / 2, handBounds.height / 2 + 300);
    hand.regX = handBounds.width / 2;
    hand.regY = handBounds.height / 2 + 300;
    hand.x = w;
    hand.y = 0;
    hand.scaleX = default_scaleX;
    hand.scaleY = default_scaleY;
    var hand_direction = 1; // 筷子手的方向
    var start = false; // 开始标记
    container.addChild(hand);

    function getHandTopPoint() {
      return {
        x: (handBounds.height / 2 - 300) * default_scaleY * Math.sin(-hand.rotation * Math.PI / 180) + hand.x,
        y: (handBounds.height / 2 - 300) * default_scaleY * Math.cos(-hand.rotation * Math.PI / 180) + hand.y
      };
    }

    function clipTest(obj) {
      // var pt = hand.localToLocal(handBounds.width / 2, handBounds.height, obj);
      // return obj.hitTest(pt.x, pt.y);
      var pt = getHandTopPoint();
      return Math.sqrt(Math.pow(pt.x - obj.x, 2) + Math.pow(pt.y - obj.y, 2)) <= obj.getBounds().width / 2;
    }

    function isClipSomething(ary1, ary2) {
      for(var i = 0; i < ary1.length; i++) {
        if(clipTest(ary1[i])) {
          return ary1.splice(i, 1)[0];
        }
      }
      for(i = 0; i < ary2.length; i++) {
        if(clipTest(ary2[i])) {
          return ary2.splice(i, 1)[0];
        }
      }
      return null;
    }

    function isHandHitBorder() {
      var pt = getHandTopPoint();
      if(pt.x <= handBounds.width / 2 * default_scaleX * Math.cos(hand.rotation * Math.PI / 180) || pt.x >= 2 * w - handBounds.width / 2 * default_scaleX * Math.cos(hand.rotation * Math.PI / 180) || pt.y >= 2 * h) {
        return true;
      }
      return false;
    }

    function swing(delta) {
      if(start) {
        hand.rotation += hand_direction * delta / 1000 * 40; // delta是每一帧的时间间隔，单位是毫秒ms
        if(hand.rotation >= 45) {
          hand_direction = -1;
        }
        if(hand.rotation <= -45) {
          hand_direction = 1;
        }
      }
    }

    function resetPos() {
      hand.x = w;
      hand.y = 0;
      cliped = false;
      cliping = false;
    }

    return {
      setStart: function() {
        start = true;
      },
      setStop: function() {
        start = false;
      },
      hand: hand,
      width: handBounds.width,
      height: handBounds.height,
      getHandTopPoint: getHandTopPoint,
      isClipSomething: isClipSomething,
      isHandHitBorder: isHandHitBorder,
      up: function() {
        hand.y -= clipSpeed;
        hand.x -= clipSpeed * Math.tan(-hand.rotation * Math.PI / 180);
        return {x: hand.x, y: hand.y};
      },
      down: function() {
        hand.y += clipSpeed;
        hand.x += clipSpeed * Math.tan(-hand.rotation * Math.PI / 180);
        return {x: hand.x, y: hand.y};
      },
      swing: swing,
      resetPos: resetPos
    };
  }());


  // 汤圆
  var dessertModule = (function() {
    var tangyuans = [];
    var desserts = [];
    var dessert = {
      "images": [loader.getResult("dessert")],
      "frames": [
          [0, 0, 141, 139],
          [147, 21, 101, 98],
          [254, 0, 136, 130],
          [396, 0, 136, 130],
          [0, 175, 111, 111],
          [146, 175, 103, 105],
          [284, 180, 126, 96]
      ],
      "animations": {
          "tangyuan1": [0],
          "tangyuan2": [1],
          "tangyuan3": [2],
          "tangyuan4": [3],
          "dessert1": [4],
          "dessert2": [5],
          "dessert3": [6]
      }
    };
    var spritsheet = new createjs.SpriteSheet(dessert);
    var start = false;

    function getRandom(max,min) {
      max = max || 1;
      min = min || 0;
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function setRandomPosition(spr, type) {
      if(type == "tangyuan") {
        spr.x = getRandom(2 * w - spr.getBounds().width, spr.getBounds().width);
        spr.y = getRandom(2 * h - spr.getBounds().height, 2 * h / 3 + spr.getBounds().height);
      } else {
        spr.x = getRandom(2, 0) < 1? (2 * w + spr.getBounds().width) : -spr.getBounds().width;
        spr.y = getRandom(h * 4 / 3, h * 2 / 3);
      }
      // return spr;
    }

    function strikeTest(objA, objB) {
      return Math.abs(objA.x - objB.x) <= objA.getBounds().width / 2 * default_scaleX + objB.getBounds().width / 2 * default_scaleX &&
              Math.abs(objA.y - objB.y) <= objA.getBounds().height / 2 * default_scaleY + objB.getBounds().height / 2 * default_scaleY;
    }
    function isOverlap(spr, objAry) {
      for(var i = 0; i < objAry.length; i++) {
        if(strikeTest(spr, objAry[i])) {
          return true;
        }
      }
      return false;
    }

    function recursive(spr, type) {
      // spr = setRandomPosition(spr, type);
      setRandomPosition(spr, type);
      if(isOverlap(spr, type == "tangyuan"? tangyuans : desserts)) {
        recursive(spr, type);
      } else {
        (type == "tangyuan"? tangyuans : desserts).push(spr);
      }
    }

    function createTangYuan() {
      var tangyuan = new createjs.Sprite(spritsheet, "tangyuan" + getRandom(5, 1));
      tangyuan.regX = tangyuan.getBounds().width / 2;
      tangyuan.regY = tangyuan.getBounds().height / 2;
      tangyuan.scaleX = default_scaleX;
      tangyuan.scaleY = default_scaleY;
      recursive(tangyuan, "tangyuan");
      return tangyuan;
    }

    function createDessert() {
      var dessert = new createjs.Sprite(spritsheet, "dessert" + getRandom(4, 1));
      dessert.regX = dessert.getBounds().width / 2;
      dessert.regY = dessert.getBounds().height / 2;
      dessert.scaleX = default_scaleX;
      dessert.scaleY = default_scaleY;
      recursive(dessert, "dessert");
      dessert.moveSpeed = (dessert.x > 0? -1 : 1) * (Math.random() * 2 + 1);
      return dessert;
    }

    for(var i = 0; i < 5; i++) {
      container.addChild(createTangYuan());
    }
    for(var j = 0; j < 3; j++) {
      container.addChild(createDessert());
    }

    return {
      setStart: function() {
        start = true;
      },
      setStop: function() {
        start = false;
      },
      tangyuans: tangyuans,
      desserts: desserts,
      obstaclesMove: function() {
        if(start) {
          for(var i = 0; i < desserts.length; i++) {
            desserts[i].x += desserts[i].moveSpeed;
            if(desserts[i].x > 2 * w + desserts[i].getBounds().width || desserts[i].x < -desserts[i].getBounds().width) {
              container.removeChild(desserts.splice(i, 1));
              container.addChild(createDessert());
            }
          }
        }
      },
      createTangYuan: createTangYuan,
      createDessert: createDessert
    };
  }());

  // 计时器
  createjs.Ticker.framerate = 120;
  createjs.Ticker.addEventListener("tick", tickEvent);
  function tickEvent(e) {
    var handCurPt;
    var tmpPt;
    var timer;
    var tmpItem;

    if(!cliping) {
      handModule.swing(e.delta); // 摆动
    } else {
      if(cliped) {
        // 上升
        handCurPt = handModule.up();

        if(clipedItem) {
          // 被夹物上升
          tmpPt = handModule.getHandTopPoint();
          clipedItem.x = tmpPt.x;
          clipedItem.y = tmpPt.y;
        }

        if(handCurPt.y <= 0) {
          // 加分
          if(clipedItem && clipedItem.currentAnimation.indexOf("tangyuan") > -1) {
            scoreText.text = parseInt(scoreText.text) + 1;
          }

          // 回到原位
          handModule.resetPos();
          // 淡出
          if(clipedItem) {
            tmpItem = clipedItem;
            timer = setInterval(function() {
              tmpItem.alpha -= 0.4;
              if(tmpItem.alpha <= 0){
                clearInterval(timer);
                container.removeChild(tmpItem);
                tmpItem = null;
              }
            }, 100);
          }
        }
      } else {
        // 下探
        handCurPt = handModule.down();

        // 是否夹到东西
        clipedItem = handModule.isClipSomething(dessertModule.tangyuans, dessertModule.desserts);
        if(clipedItem) {
          clip_mp3.play();
          cliped = true;
          tmpPt = handModule.getHandTopPoint();
          clipedItem.x = tmpPt.x;
          clipedItem.y = tmpPt.y;

          // 如果点心被夹走，补充点心
          if(clipedItem.currentAnimation.indexOf("tangyuan") > -1) {
            setTimeout(function() {
              container.addChild(dessertModule.createTangYuan());
            }, 3000);
          } else {
            setTimeout(function() {
              container.addChild(dessertModule.createDessert());
            }, 3000);
          }
        }

        // 如果什么都没夹到，碰到边框则返回
        if(handModule.isHandHitBorder()) {
          cliped = true;
        }
      }
    }

    // 障碍物点心来回飞过
    dessertModule.obstaclesMove();

    stage.update(e);
  }

  var chance = 0;
  function gameOver() {
    handModule.setStop();
    dessertModule.setStop();
    var score = parseInt(scoreText.text);
    chance = score > 0 && score <= 10? 1 : (score >= 11 && score <= 30? 2 : (score > 30? 3 : 0));
  }

  return {
    start: function() {
      var timer;
      $(".ready-mask").addClass("show");
      bg_mp3.play();
      readygo_mp3.load();
      clip_mp3.load();
      setTimeout(function() {
        readygo_mp3.play();
      }, 800);
      setTimeout(function() {
        handModule.setStart();
        dessertModule.setStart();
        stage.addEventListener("click", function() {
          cliping = true;
        });
        $(".ready-mask").removeClass("show");

        var cd = 60;
        timer = setInterval(function() {
          countDownText.text = --cd;
          if(cd <= 0) {

            clearInterval(timer);
            gameOver();
            $(".ready-mask").addClass("over");

            globalInfo.raffleCount = globalInfo.raffleCount? 0 : chance;
            if(globalInfo.isLogined){
              localStorage.setItem("mid_winter_info", JSON.stringify(globalInfo));
            }
            $(".raffle-chance span").text(globalInfo.raffleCount);
            setTimeout(function() {
              $("#bg_mp3")[0].pause();
              $(".page").removeClass("cur").filter(".page-raffle").addClass("cur");
            }, 2000);
          }
          if(cd <= 10) {
            countDownText.color = "red";
          }
        }, 1000);
      }, 3000);
    }
  };
};