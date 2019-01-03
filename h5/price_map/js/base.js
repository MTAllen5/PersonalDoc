/* global Vue, mywx */
(function() {
  var isTouch = 'ontouchstart' in window;
  var EVENT = {
    start: isTouch ? 'touchstart' : 'mousedown',
    move: isTouch ? 'touchmove' : 'mousemove',
    end: isTouch ? 'touchend' : 'mouseup',
    tap: isTouch ? 'tap' : 'click'
  };

  var toolFn = {
    getQueryString: function(name) {
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      return r? window.unescape(r[2]) : null;
    },
    getStorage: function(name) {
      return JSON.parse(localStorage.getItem(name));
    },
    setStorage: function(name, value) {
      localStorage.setItem(name, JSON.stringify(value));
    },
    getUserInfo: function(cbk) {
      $.ajax({
        url: "http://login.focus.cn/passport/getUserInfo",
        dataType: "jsonp",
        success: function(data) {
          if(data.code == 200) {
            cbk && cbk(data.data);
          }
        }
      });
    },
  };


  $.getJSON("js/data.json?v=" + (new Date()).getTime(), function(result) {
    init(result.data);
  });

  function init(data) {

    var lastPhase = data[data.length - 1].phase || 1;                      // 最新期数
    var curPhase = parseInt(toolFn.getQueryString("phase") || lastPhase);  // 当前期数
    var userInfo = {};                                                     // 用户信息

    var priceMap = new Vue({
      el: "#priceMap",
      data: function() {
        var len = data[curPhase - 1].themes.length;
        for(var i = 0; i < len; i++) {
          data[curPhase - 1].themes[i].passed = false;
          data[curPhase - 1].themes[i].likeNum = 0;
          data[curPhase - 1].themes[i].liked = false;
        }
        return {
          phaseData: data,
          curPhase: data[curPhase - 1],
          nextDate: "看心情",
          historyShareTips: false,
          themeShareTips: false,
          instructionTips: true,
          coverPassed: false
        };
      },
      methods: {
        showContent: function(event) {
          event.style.opacity = 1;
        },
        phaseCn: function(num) {
          var cnNum = "零一二三四五六七八九";
          var decimal = num < 20? "" : cnNum.charAt(num / 10);
          var digits = num % 10 == 0? "" : cnNum.charAt(num % 10);
          return decimal + (num >= 10? "十" : "") + digits;
        },
        isShared: function(event) {
          if(toolFn.getStorage("price_map_shared")) {
            return;
          }
          this.historyShareTips = true;
          event.returnValue = false;
        },
        go2login: function() {
          location.href = "http://login.focus.cn/login?ru=" + encodeURIComponent(location.href);
        },
        go2map: function() {
          // if(userInfo.uid) {    // 是否登录
          //   this.coverPassed = true;
          //   location.hash = "#phase" + curPhase + "_theme1";
          // } else {
          //   this.go2login();
          // }
          this.coverPassed = true;
          location.hash = "#phase" + curPhase + "_theme1";
        },
        prevTheme: function(themeIndex) {
          if(themeIndex <= 0) {
            this.coverPassed = false;
          } else {
            this.curPhase.themes[themeIndex - 1].passed = false;
          }
          location.hash = themeIndex <= 0? "" : "#phase" + curPhase + "_theme" + themeIndex;
        },
        nextTheme: function(themeIndex) {
          this.curPhase.themes[themeIndex - 1].passed = true;
          location.hash = themeIndex >= this.curPhase.themes.length? "" : "#phase" + curPhase + "_theme" + (themeIndex + 1);
        },
        getLikeNum: function(theme, index) {
          $.ajax({
            url: "http://wx.gz.focus.cn/likeApi/likeCount",
            dataType: "jsonp",
            data: {
              type: "price_map",
              item: "phase" + curPhase + "_theme" + (index + 1),
              user_sign: userInfo.mobile || userInfo.uid
            },
            success: function(data) {
              if(data.code === 0) {
                theme.likeNum = data.data.count;
                theme.liked = data.data.is_like? true : false;
              }
            }
          });
        },
        setLikeNum: function(index) {
          var self = this;
          $.ajax({
            url: "http://wx.gz.focus.cn/likeApi",
            dataType: "jsonp",
            data: {
              type: "price_map",
              item: "phase" + curPhase + "_theme" + (index + 1),
              user_sign: userInfo.mobile || userInfo.uid
            },
            success: function(data) {
              if(data.code === 0) {
                self.curPhase.themes[index].likeNum = data.data.count;
                self.curPhase.themes[index].liked = !self.curPhase.themes[index].liked;
              }
            }
          });
        },
      }
    });

    var mapImg = (function() {
      var figure = document.querySelector(".page-theme .figure");
      var figureRatio = figure.clientWidth / figure.clientHeight;

      function computeDivSizeAndPos(img) {
        var imgRatio = img.width / img.height;
        var cssObj = {};
        if(imgRatio > figureRatio) {
          cssObj = {
            width: figure.clientWidth,
            height: figure.clientWidth / imgRatio,
            top: "50%",
            "margin-top": -figure.clientWidth / imgRatio / 2,
            "background-image": "url(" + img.src + ")"
          };
        } else {
          cssObj = {
            width: figure.clientHeight * imgRatio,
            height: figure.clientHeight,
            left: "50%",
            "margin-left": -figure.clientHeight * imgRatio / 2,
            "background-image": "url(" + img.src + ")"
          };
        }
        return cssObj;
      }

      function createMapDiv(index, cssObj) {
        var parent = document.querySelectorAll(".page-theme")[index];
        var div = parent.querySelector(".map_img");
        for(var p in cssObj) {
          div.style[p] = cssObj[p] + (isNaN(Number(cssObj[p]))? "" : "px");
        }
        return div;
      }

      function computeScaleDistance(e, startTouches) {
        var tan1 = Math.sqrt(Math.pow(e.touches[1].pageX - e.touches[0].pageX, 2) + Math.pow(e.touches[1].pageY - e.touches[0].pageY, 2));
        var tan2 = Math.sqrt(Math.pow(startTouches[1].pageX - startTouches[0].pageX, 2) + Math.pow(startTouches[1].pageY - startTouches[0].pageY, 2));
        return tan1 - tan2;
      }

      function moveImg(obj, x, y, scale) {
        obj.style["-webkit-transform"] = "translate(" + x + "px, " + y + "px) scale(" + scale + ")";
        return obj;
      }

      priceMap.curPhase.themes.map(function(e, i) {
        var div = null;
        var img = new Image();
        img.src = "images/phase" + curPhase + "_map" + (i + 1) + ".jpg";
        img.onload = function() {
          var offsetX = 0;            // 缓存偏移X值
          var offsetY = 0;            // 缓存偏移Y值
          var x = 0;                  // 移动时，临时记录偏移X值
          var y = 0;                  // 移动时，临时记录偏移X值
          var scaleVal = 1;           // 缓存缩放值
          var tmpScaleVal = 1;        // 缩放时，临时记录缩放值
          var startTouches = [];      // 记录移动的起始点
          var double = false;         // 标记是移动还是缩放

          div = createMapDiv(i, computeDivSizeAndPos(this));

          div.addEventListener(EVENT.start, function(e) {
            startTouches = e.touches;
            if(startTouches.length == 2) {
              double = true;
            }
            this.style["-webkit-transition"] = "";
            // scaleVal += 0.2;
          });

          div.addEventListener(EVENT.move, function(e) {
            if(e.touches.length == 1 && !double) {
              if(scaleVal > 1) {  // 图片放大的情况下才允许移动
                x = offsetX + e.touches[0].pageX - startTouches[0].pageX;
                y = offsetY + e.touches[0].pageY - startTouches[0].pageY;
                moveImg(this, x, y ,scaleVal);
              }
            }
            if(e.touches.length == 2) {
              var distanceRatio = computeScaleDistance(e, startTouches) / 100;
              tmpScaleVal = (scaleVal + distanceRatio) <= 0.2? 0.2 : (scaleVal + distanceRatio); //防止scale值为负，导致图片翻转
              moveImg(this, offsetX, offsetY, tmpScaleVal);
            }
          });

          div.addEventListener(EVENT.end, function(e) {
            if(double) {
              scaleVal = tmpScaleVal < 1? 1 : (tmpScaleVal > 4? 4 : tmpScaleVal);
            }
            var horizontalBorderDistance = Math.abs(this.offsetWidth / 2 * (scaleVal - 1) - this.offsetLeft);
            var verticalBorderDistance = Math.abs(this.offsetHeight / 2 * (scaleVal - 1) - this.offsetTop);
            if(scaleVal > 1) {
              if(horizontalBorderDistance - x < 0) {
                x = horizontalBorderDistance;
              }
              if(verticalBorderDistance - y < 0) {
                y = verticalBorderDistance;
              }
              if(horizontalBorderDistance + x < 0) {
                x = -horizontalBorderDistance;
              }
              if(verticalBorderDistance + y < 0) {
                y = -verticalBorderDistance;
              }
              offsetX = x;
              offsetY = y;
            } else {
              offsetX = 0;
              offsetY = 0;
            }
            this.style["-webkit-transition"] = "all .2s linear";
            moveImg(this, offsetX, offsetY, scaleVal);
            if(e.touches.length <= 0){
              double = false;
            }
          });
        };
      });
    }());

    // 判断是否已登录
    toolFn.getUserInfo(function(data) {
      userInfo = data;
      priceMap.curPhase.themes.map(function(theme, i) {
        priceMap.getLikeNum(theme, i);
      });
    });

    window.mywx && mywx.setData({
      title : priceMap.curPhase.shareTitle,
      desc : priceMap.curPhase.shareDesc,
      link : "http://wx.gz.focus.cn/html/price_map/?phase=" + priceMap.curPhase.phase,
      imgUrl : 'http://wx.gz.focus.cn/html/price_map/images/' + priceMap.curPhase.shareIcon + "?timestamp" + (new Date().getTime()),
      success : function () {
        toolFn.setStorage("price_map_shared", true);
        priceMap.historyShareTips = false;
      }
    });
  }

}());