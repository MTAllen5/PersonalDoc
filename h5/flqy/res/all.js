$(function () {
  var video = $('#video')[0];
  var view = (function () {
    return {
      change: function (page) {
        $('.page').hide();
        $('.page-' + page).show();

        if (page == 'player') {
          video.play();
        }
      }
    };
  })();

  var loader = function () {
    var $_loading_progress = $('.progress')
    var $_loading_text = $('.loading_text');
    var $_start_box = $('.btn-start');
    var loader = new createjs.LoadQueue();

    var load_progess = function load_progess(e) {
      $_loading_text.length && $_loading_text.text((e.loaded * 100).toFixed(0) + "%");
      $_loading_progress.find('span').css({width: (e.loaded * 100).toFixed(0) + "%"})
    };
    var load_complete = function load_complete(e) {};

    loader.on("complete", function (e) {
      load_complete(e);
      $_loading_progress.hide();
      $_loading_text.hide();
      $_start_box.show();
    });
    loader.on("progress", function (e) {
      load_progess(e);
    });

    return {
      getResult: function getResult(id) {
        return loader.getResult(id);
      },
      startLoad: function startLoad(list) {
        $_loading_progress.show();
        $_loading_text.show();
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

  var res = ["res/video.mp4?v=2"];

  loader.startLoad(res).handlerLoadComplete(function () { //使用startLoad预加载文件，加载完成后执行handlerLoadComplete里面的方法

    $(".btn-start").on("click", function() {
      view.change('player');
    })

    video.onended = function() {
      view.change('end');
    };

    $(".btn-review").on("click", function() {
      video.currentTime = 0;
      view.change('player');
    });

    $(".btn-share").on("click", function() {
      $(".share").show();
    });

    $(".share").on("click", function() {
      $(this).hide();
    });

  });

  $(document).on('touchmove', function (e) {
    e.preventDefault();
  });
});