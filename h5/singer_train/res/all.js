/* global Vue, voteList, Router, userinfo */
(function() {

  window.mywx && mywx.setData({
    title : "中国新歌声人气票选，我就差你一票了",
    desc : "投我一票，助我晋级",
    link : "http://wx.gz.focus.cn/xswh/?type=vote03",
    imgUrl : "http://wx.gz.focus.cn/css/singer_train/images/icon.png",
    success : function () {}
  });

  var app = new Vue({
    el: "#app",
    data: {
      voteSelect: {},
      contestant: [],
      payContestant: {portrait: ""},
      tipsMsg: "",
      voteNum: 1,
      showCover: true,
      showRules: false,
      showVote: false,
      showMsgTips: false,
      showMask: false,
      history: false,
      isFreeVote: false,
      timer: null,
      countDown: null,
      showPersonal: false,
      imageUrl: "/css/singer_train/images/",
      commentContent: "",
      showVoteList: true,
      isPopular: false,
      popup: false
    },
    mounted: function() {
      setTimeout(function() {
        $(".wrapper").addClass("start");
      }, 200);
    },
    computed: {
      nextPhase: function() {
        return (new Date()).getTime() > (new Date("2017/5/17 00:00:00")).getTime();
      },
      now: function() {
        return (new Date()).getTime();
      }
    },
    methods: {
      resetIndex: function() {
        // this.voteSelect = {},
        // this.contestant = [];
        this.payContestant = {portrait: ""};
        this.tipsMsg = "";
        this.voteNum = 1;
        this.showCover = true;
        this.showRules = false;
        this.showPersonal = false;
        this.showVote = false;
        this.showMsgTips = false;
        this.showMask = false;
        this.isFreeVote = false;
        clearInterval(this.timer);
        this.timer = null;
        this.countDown = null;
        this.showPersonal = false;
        this.commentContent = "";
        clearInterval(danmuTimer);
        clearInterval(scrollTimer);
        signPerson = -1;
        this.showVoteList = false;
      },
      checkRoute: function(vote_id) {
        router.setRoute(vote_id == "0"? "history" : "vote_" + vote_id);
      },
      jump2vote: function(vote_id, detail_id) {
        this.voteSelect = voteList[vote_id];
        this.voteSelect.vote_id = vote_id;
        this.getCountDown();
        this.getVoteResult(detail_id);
        this.showCover = false;
        this.history = false;
        this.showRules = true;
      },
      getDT: function(time) {
        return (time? new Date(time) : new Date()).getTime();
      },
      computedTime: function(time) {
        if(time <= 0) {
          return null;
        }
        var hour = Math.floor(time / 1000 / 60 / 60);
        time = time - 1000 * 60 * 60 * hour;
        var min = Math.floor(time / 1000 / 60);
        time = time - 1000 * 60 * min;
        var sec = Math.floor(time / 1000);
        return {
          hour: hour,
          min: min,
          sec: sec
        };
      },
      getCountDown: function() {
        var self = this;
        this.countDown = null;
        clearInterval(this.timer);
        $.ajax({
          url: "http://wx.gz.focus.cn/xswh/getTime",
          dataType: "jsonp",
          success: function(result) {
            var timestamp = self.getDT();
            var sevDiffStart = self.getDT(result.data) - self.getDT(self.voteSelect.voteStart);
            var sevDiffEnd = self.getDT(self.voteSelect.voteEnd) - self.getDT(result.data);
            if(sevDiffStart > 0 && sevDiffEnd <= 1000 * 60 * 60 * 24 * 3) {
              self.timer = setInterval(function() {
                var diff = self.getDT() - timestamp;
                var computedTime = self.computedTime(sevDiffEnd - diff);
                self.countDown = computedTime? "投票时间还剩" + computedTime.hour + "小时" + computedTime.min + "分" + computedTime.sec + "秒" : "投票已结束";
                if(!computedTime) {clearInterval(self.timer);}
              }, 1000);
            } else {
              self.countDown = null;
            }
          }
        });
      },
      getVoteResult: function(detail_id) {
        var self = this;
        self.contestant = [];
        $.ajax({
          url: "http://wx.gz.focus.cn/xswh/getVoteResult",
          dataType: "jsonp",
          data: {
            vote_id: this.voteSelect.vote_id
          },
          success: function(result) {
            var key = "";
            var ct = self.voteSelect.contestant;
            if(result.code === 0 && result.data) {
              for(var i = 0; i < result.data.length; i++) {
                key = result.data[i].id;
                ct[key].detail_id = key;
                ct[key].portrait = (ct[key].noPort? "portrait" : key) + ".jpg";
                ct[key].count = result.data[i].total;
                ct[key].rank = i + 1;
                self.contestant.push(ct[key]);
              }

              // 前端票数排序
              if(self.contestant.sort) {
                self.contestant.sort(function(a, b) {
                  return b.count - a.count;
                });
                self.contestant.map(function(a, i) {
                  a.rank = i + 1;
                });
              }

              // 如果是个性页面
              if(detail_id) {
                self.payContestant = self.voteSelect.contestant[detail_id];
                var title = "";
                if(self.voteSelect.vote_id == "18") {
                  title = "，投我一票，助我直晋新歌声总决赛";
                } else if(self.voteSelect.vote_id == "19" || self.voteSelect.vote_id == "20") {
                  title = "，中国新歌声“直晋总决赛”票选，我就差你一票了";
                } else {
                  title = "，中国新歌声直晋半决赛，我就差你一票了";
                }
                window.mywx && mywx.setData({
                  title : "我是" + self.payContestant.name + title,
                  link : "http://wx.gz.focus.cn/xswh/?type=vote03&garden=" + self.voteSelect.vote_id + "_" + self.payContestant.detail_id,
                  imgUrl : "http://wx.gz.focus.cn/css/singer_train/images/" + (self.payContestant.portrait != "portrait.jpg"? "portrait/" + self.payContestant.portrait : "icon.png")
                });
                self.bulletComments();
              }
            }
          }
        });
      },
      getOrderID: function() {
        var self = this;
        this.showMask = true;
        $.ajax({
          url: "http://wx.gz.focus.cn/xswh/getOrderID",
          dataType: "jsonp",
          data: {
            type: this.voteSelect.pro_type,
            goods_count: this.voteNum,
            realname: userinfo.nickname,
            token: userinfo.token,
            detail_id: this.payContestant.detail_id,
            vote_id: this.voteSelect.vote_id
          },
          success: function(data) {
            if(data.code === 0) {
              self.wxPay(data.data.order_id);
            } else if(data.code == 9999) {
              if(data.msg.match("活动尚未开始")) {
                self.tipsMsg = "投票即将开始";
              } else if(data.msg.match("目前已截止")) {
                self.tipsMsg = "投票已经结束了";
              } else {
                self.tipsMsg = data.msg;
              }
              self.showMsgTips = true;
              self.showMask = false;
            }
          },
          error: function() {
            self.voteError();
          }
        });
      },
      wxPay: function(oid) {
        var self = this;
        $.ajax({
          url: "http://wx.gz.focus.cn/xswh/wxPay",
          dataType: "jsonp",
          data: {
            order_id: oid,
            json: 1,
            temp: (new Date()).getTime()
          },
          success: function(result) {
            if(result.code === 0) {
              wx.chooseWXPay({
                timestamp: result.data.jsApiData.timeStamp,
                nonceStr: result.data.jsApiData.nonceStr,
                package: result.data.jsApiData.package,
                signType: result.data.jsApiData.signType,
                paySign: result.data.jsApiData.paySign,
                success: function () {
                  self.voteSuccess(self.payContestant.detail_id); // 支付成功后的回调函数
                },
                cancel: function() {
                  self.showMask = false;
                }
              });
            }
          },
          error: function() {
            self.voteError();
          }
        });
      },
      voteFree: function() {
        var self = this;
        $.ajax({
          url: "http://wx.gz.focus.cn/xswh/vote",
          dataType: "jsonp",
          data: {
            vote_id: this.voteSelect.vote_id,
            detail_id: this.payContestant.detail_id,
          },
          success: function(result) {
            if(result.code === 0) {
              self.voteSuccess(self.payContestant.detail_id);
            } else {
              self.voteError();
            }
          },
          error: function() {
            self.voteError();
          }
        });
      },
      showPersonalPage: function(obj) {
        this.payContestant = obj;
        var title = "";
        if(this.voteSelect.vote_id == "18") {
          title = "，投我一票，助我直晋新歌声总决赛";
        } else if(this.voteSelect.vote_id == "19" || this.voteSelect.vote_id == "20") {
          title = "，中国新歌声“直晋总决赛”票选，我就差你一票了";
        } else {
          title = "，中国新歌声直晋半决赛，我就差你一票了";
        }
        window.mywx && mywx.setData({
          title : "我是" + obj.name + title,
          link : "http://wx.gz.focus.cn/xswh/?type=vote03&garden=" + this.voteSelect.vote_id + "_" + obj.detail_id,
          imgUrl : "http://wx.gz.focus.cn/css/singer_train/images/" + (obj.portrait != "portrait.jpg"? "portrait/" + obj.portrait : "icon.png")
        });
        router.setRoute("vote_" + this.voteSelect.vote_id + "/" + this.payContestant.detail_id);
      },
      showVotePay: function() {
        var self = this;
        this.voteNum = 1;

        $.ajax({
          url: "http://wx.gz.focus.cn/xswh/checkFreeVote",
          dataType: "jsonp",
          data: {
            vote_id: this.voteSelect.vote_id,
            detail_id: this.payContestant.detail_id,
          },
          success: function(result) {
            if(result.code === 0) { // 可以投免费票
              self.isFreeVote = true;
              self.showVote = true;
            } else if(result.code == 1001 || result.code == 1003) { // 投票次数已达最高
              self.isFreeVote = false;
              self.showVote = true;
            } else if(result.code == 1002) { // 投票还没开始或者已经结束
              // self.tipsMsg = self.voteSelect.vote_id >= 10? "投票尚未开始" : "投票已经结束";
              self.tipsMsg = "投票已经结束";
              self.showMsgTips = true;
            } else { // ID不能为空或者其他问题
              self.voteError();
            }
          },
          error: function(xhr, s, e) {
            console.log(s, e);
            self.voteError();
          }
        });
      },
      closeVotePay: function() {
        this.showVote = false;
      },
      getComment: function() {
        var _this = this;
        $.ajax({
          url: "http://wx.gz.focus.cn/commentApi/commentList",
          dataType: "jsonp",
          data: {
            curPage: this.getRandom(5, 1),
            type: "singer_train_" + _this.payContestant.detail_id
          },
          success: function(result) {
            if(result.code == 0) {
              danmuAry = result.data.comments;
            }
          }
        });
      },
      sendComment: function() {
        var _this = this;
        $.ajax({
          url : "http://wx.gz.focus.cn/commentApi/commentNew",
          dataType: "jsonp",
          data: {
            username: userinfo.token + "-" + userinfo.nickname,
            content: escape(this.commentContent),
            type: "singer_train_" + this.payContestant.detail_id
          },
          success: function(result) {
            if(result.code == 0) {
              _this.tipsMsg = "评论成功";
              _this.showMsgTips = true;
              _this.commentContent = "";
            } else {
              console.log(result);
              _this.voteError();
            }
          },
          error: function(xhr, status, errorThrown) {
            console.log(status, errorThrown);
            _this.voteError();
          }
        });
      },
      checkCommment: function() {
        if(this.commentContent.length <= 0) {
          this.tipsMsg = "请输入印象内容";
          this.showMsgTips = true;
          return;
        }
        if(this.commentContent.length > 15) {
          this.tipsMsg = "印象字数限制15个字符以内";
          this.showMsgTips = true;
          return;
        }
        this.sendComment();
      },
      bulletComments: function() {
        var _this = this;
        _this.getComment();
        danmuTimer = setInterval(function() {
          _this.getComment();
        }, 8000);

        scrollTimer = setInterval(function() {
          danmuAry.index = (danmuAry.index === undefined || danmuAry.index >= danmuAry.length)? 0 : danmuAry.index + 1;
          var text = danmuAry[danmuAry.index];
          var pos = _this.getRandom(10) * 10;
          var speed = _this.getRandom(10, 6);
          if(text) {
            if(text.username != "d3d87820a0057e3c6283947fdd7c8b0f") { // 屏蔽搞屎棍
              $(".bullet-comments").append('<div class="danmu-item" style="top: ' + pos + '%; right: 0; -webkit-animation: danmu ' + speed + 's linear forwards;">' + unescape(text.content) + '</div>');
              if($(".danmu-item").length > 15) {
                $(".danmu-item").eq(0).remove();
              }
            }
          }
        }, 800);
      },
      imgUrl: function(imgName) {
        return this.imageUrl + "portrait/" + imgName;
      },
      ruleUrl: function() {
        return this.imageUrl + "rules_" + this.voteSelect.vote_id + ".png" + "?v=" + this.now;
      },
      bigImgUrl: function(imgName) {
        return this.imageUrl + "person/" + (imgName? (this.payContestant.detail_id + ".jpg") : (this.voteSelect.vote_id == "18"? "default2.jpg" : "default.jpg"));
      },
      voteSuccess: function(detail_id) {
        this.getVoteResult(detail_id);
        this.showVote = false;
        this.showMask = false;
        this.tipsMsg = "投票成功";
        this.showMsgTips = true;
      },
      voteError: function() {
        this.tipsMsg = "网络错误，请稍后再试";
        this.showMsgTips = true;
        this.showMask = false;
      },
      getRandom: function(max,min) {
        max = max || 1;
        min = min || 0;
        return Math.floor(Math.random() * (max - min)) + min;
      }
    }
  });

  var signPerson = -1;
  var danmuTimer;
  var scrollTimer;
  var danmuAry = [];

  var routes = {
    "/index": function() {
      app.history = false;
      app.resetIndex();
    },
    "/history": function() {
      app.history = true;
      app.resetIndex();
    },
    "/vote_:vote_id": {
      "/": function(vote_id) {
        app.showVoteList = true;
        if(signPerson > 0) {
          app.showPersonal = false;
        } else {
          app.jump2vote(vote_id);
        }
        app.isPopular = (vote_id == "18");
        var title = "";
        if(app.voteSelect.vote_id == "18") {
          title = "中国新歌声“最佳人气选手”票选，我就差你一票了";
        } else if(app.voteSelect.vote_id == "19" || app.voteSelect.vote_id == "20") {
          title = "中国新歌声“直晋总决赛”票选，我就差你一票了";
        } else {
          title = "中国新歌声直晋半决赛，我就差你一票了";
        }
        window.mywx && mywx.setData({
          title : title,
          link : "http://wx.gz.focus.cn/xswh/?type=vote03&garden=" + vote_id,
          imgUrl : "http://wx.gz.focus.cn/css/singer_train/images/icon.png"
        });
        signPerson = 0;
        clearInterval(danmuTimer);
        clearInterval(scrollTimer);
        danmuAry = [];
        $(".bullet-comments").empty();
      },
      "/:detail_id": function(vote_id, detail_id) {
        if(signPerson !== 0) { // 如果是分享链接直接进来的
          app.isPopular = (vote_id == "18");
          app.jump2vote(vote_id, detail_id);
        } else {   // 如果是列表进来的
          app.bulletComments();
        }
        app.showPersonal = true;
        signPerson = 1;
      }
    }
  };

  var router = Router(routes);

  router.init("/index");

  if(userinfo.vote_id) {
    router.setRoute('vote_' + userinfo.vote_id + (userinfo.detail_id? '/' + userinfo.detail_id : ''));
  }

}());
