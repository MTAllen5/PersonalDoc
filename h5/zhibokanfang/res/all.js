/* global Vue, VueRouter */
(function() {

  // 每一期数据
  var videoData = {
    "1": {
      "cover": "1",
      "zhiboUrl": "https://zhibo.focus.cn/guangzhou/zhibo/13710.html",
      "icon": "1.png",
      "title": "【视频直播】近二十家房企争抢白云黄埔宅地",
      "desc": "新规则下土地市场是冷是热？正在揭晓！"
    },
    "2": {
      "cover": "2",
      "zhiboUrl": "https://zhibo.focus.cn/guangzhou/zhibo/14893.html",
      "icon": "2.jpg",
      "title": "【直播】谁的青春不迷茫 迷茫的青春该不该买房？",
      "desc": "[Emily水]正在直播,快来一起看"
    },
    "3": {
      "cover": "2",
      "zhiboUrl": "https://zhibo.focus.cn/guangzhou/zhibo/16038.html",
      "icon": "3.jpg",
      "title": "【直播】首付需要100万的郊区盘 你会选择买吗？",
      "desc": "[Emily水]正在直播,快来一起看"
    },
    "4": {
      "cover": "2",
      "zhiboUrl": "https://zhibo.focus.cn/guangzhou/zhibo/16877.html",
      "icon": "4.jpg",
      "title": "【直播】520 单身狗如何逆袭恩爱狗？",
      "desc": "[Emily水]正在直播,快来一起看"
    },
    "5": {
      "cover": "2",
      "zhiboUrl": "https://zhibo.focus.cn/guangzhou/zhibo/17206.html",
      "icon": "5.jpg",
      "title": "【直播】专家面对面解读增城最新拍地",
      "desc": "[Emily水]正在直播,快来一起看"
    },
    "6": {
      "cover": "2",
      "zhiboUrl": "https://zhibo.focus.cn/guangzhou/zhibo/17394.html",
      "icon": "6.jpg",
      "title": "【直播】大咖带你了解房屋风水学",
      "desc": "靠山靠水就一定好吗？不设置玄关的房子会怎样..."
    },
    "7": {
      "cover": "2",
      "zhiboUrl": "https://zhibo.focus.cn/guangzhou/zhibo/18671.html",
      "icon": "7.jpg",
      "title": "【海外直播】小水带你看新加坡对岸 高端滨海综合体：富力公主湾",
      "desc": "赶紧进直播感受东南亚风情"
    },
    "8": {
      "cover": "2",
      "zhiboUrl": "https://zhibo.focus.cn/guangzhou/zhibo/19399.html",
      "icon": "8.jpg",
      "title": "【直播】毕业季 是留下还是和这座城市说再见？",
      "desc": "赶紧进来和我们说说你的故事"
    },
    "9": {
      "cover": "2",
      "zhiboUrl": "https://zhibo.focus.cn/guangzhou/zhibo/20212.html",
      "icon": "9.jpg",
      "title": "【直播】毕业季租房 拒绝被人愚弄",
      "desc": "看直播教你迈过租房坑"
    },
    "10": {
      "cover": "2",
      "zhiboUrl": "https://zhibo.focus.cn/guangzhou/zhibo/20948.html",
      "icon": "10.jpg",
      "title": "【直播】地铁设女性车厢 是方便女性还是浪费资源？",
      "desc": "你怎么看？"
    },
    "11": {
      "cover": "2",
      "zhiboUrl": "https://zhibo.focus.cn/guangzhou/zhibo/21814.html",
      "icon": "11.jpg",
      "title": "【直播】有人说：下半年是购房好时机？",
      "desc": "你怎么看？"
    },
    "12": {
      "cover": "12",
      "zhiboUrl": "https://zhibo.focus.cn/guangzhou/zhibo/22094.html",
      "icon": "12.jpg",
      "title": "【直播】情歌天后梁静茹唱歌给你听",
      "desc": "“可惜不是你，陪我到最后.....”"
    }
  };

  // 组件
  var videoCom = Vue.extend({
      template: '<video id="video" :src="\'res/video\' + $route.params.id + \'.mp4\'" :poster="\'images/cover\' + cover($route.params.id) + \'.jpg\'"' +
              ' height="100%" v-on:ended="videoEnded" x-webkit-airplay webkit-playsinline playsinline x5-video-player-type="h5" x5-video-player-fullscreen="true"></video>',
      methods: {
        "cover" : function(id) {
          var _this = this;
          return _this.$root.videoData[id].cover;
        },
        "videoEnded": function() {
          var _this = this;
          var zhiboUrl = _this.$root.videoData[_this.$root.phase].zhiboUrl;
          _this.$root.showPointer = true;

          document.querySelector(".video-box").addEventListener("click", function(e) {
            _hmt.push(['_trackPageview', "/html/zhibokanfang/jumpzhibo"]);
            window.location.href = zhiboUrl;
          });

          setTimeout(function() {
            _hmt.push(['_trackPageview', "/html/zhibokanfang/jumpzhibo"]);
            window.location.href = zhiboUrl;
          }, 5000);
        }
      }
  });

  var routes = [
    {
      path: '/phase_:id',
      component: videoCom
    }
  ];

  var router = new VueRouter({routes: routes});

  var app = new Vue({
    el: "#app",
    router: router,
    data: {
      videoData: videoData,
      showLogo: false,
      showPointer: false,
      phase: Object.getOwnPropertyNames(videoData).length
    },
    mounted: function() {
      this.phase = window.location.hash.split("_")[1];
      document.querySelector("head title").innerText = this.videoData[this.phase].title;
      this.showPointer = true;

      if(this.phase != 12) {
        this.showLogo = true;
      }
    },
    methods: {
      "start": function() {
        document.querySelector("#video").play();
        this.showLogo = false;
        this.showPointer = false;
      }
    }
  });

  var tmpObj = app.videoData[app.phase];
  window.mywx && mywx.setData({
    title : tmpObj.title,
    desc : tmpObj.desc,
    link : "http://wx.gz.focus.cn/html/zhibokanfang/#phase_" + app.phase,
    imgUrl : 'http://wx.gz.focus.cn/html/zhibokanfang/images/icon' + tmpObj.icon + "?v=1",
    success : function () {},
  });
}());
