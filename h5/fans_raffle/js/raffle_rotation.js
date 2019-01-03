function sendAjax(param, suc, err) {
  $.ajax({
    url:param.url,
    data: param.data,
    dataType: param.dataType,
    // type: "GET",
    timeout: 10000,
    success: function(data) {
      suc(data);
    },
    error: function(xhr, status) {
      if (err === undefined) return;
      console.log(xhr, status)
      err();
    },
    complete: function(xhr, status) {
      if (err === undefined) return;
      console.log(xhr, status)
      if (status == "abort" || status == "timeout") {
        err();
        alert("您的网络繁忙,请稍候再试");
      }
    }
  });
}

var loginModule = (function() {
  var loginBaseUrl  = "http://login.focus.cn/"; // 登录根地址
  var isNeedPicCode = false;                    // 是否需要验证码
  var mask          = $(".mask");               // 遮盖层
  var loginBox      = $(".login-box");          // 登录模块
  var btnGetSMSCode = $(".smscode");            // 获取短信验证码按钮
  var picCodeBox    = $(".pic-login-raw");      // 图片验证码块
  var imgcode       = $(".imgcode");            // 图片验证码
  var imgInput      = $("[name=imgcode]");      // 图片验证码输入框
  var phoneInput    = $("[name=phone]");        // 手机输入框
  var smsInput      = $("[name=smscode]");      // 短信验证码输入框
  var btnSubmit     = $(".loginbtn");           // 登录按钮
  var nameInput     = $("[name=nickname]");     // 姓名输入框

  // 检查输入
  function checkInput(type) {
    if($.trim(phoneInput.val()) === "") {
      alert("手机号码不能为空");
      return false;
    }
    if(!/^1[34578]\d{9}$/.test(phoneInput.val())) {
      alert("手机号码格式不正确");
      return false;
    }
    if(type == "submit") {
      if($.trim(nameInput.val()) === "") {
        alert("姓名不能为空");
        return false;
      }
      if($.trim(smsInput.val()) === "") {
        alert("验证码不能为空");
        return false;
      }
      if(isNeedPicCode && $.trim(imgInput.val()) === "") {
        alert("图片验证码不能为空");
        return false;
      }
    }
    return true;
  }

  // 更换图片验证码
  function changeImgCode() {
    imgcode.attr("src", loginBaseUrl + "imgcode/getCaptcha?type=1&t=" + (new Date()).getTime());
  }

  function showPicCode() {
    isNeedPicCode = true;
    picCodeBox.show();
  }

  function sendSMSCountDown() {
    // 验证码发送成功
    var rTime = 60;
    var ctlTimer = setInterval(function () {
      rTime--;
      btnGetSMSCode.text(rTime + "秒后重发");
      if (rTime <= 0) {
        clearInterval(ctlTimer);
        btnGetSMSCode.text("获取验证码").removeAttr("disabled");
      }
    }, 1000);
  }

  // 获取短信验证码
  function getSMScode(phone, picCode) {
    picCode = picCode || "";
    btnGetSMSCode.attr("disabled", "disabled");

    sendAjax({
      url: loginBaseUrl + "captcha/imgControl/getMobileCaptcha",
      data: {
        channel: 7,
        mobile: phone,
        isImgNeed: isNeedPicCode,
        imgcode: picCode
      },
      dataType: "jsonp"
    }, function(res) {
      if (res.errorCode === 0) {
        sendSMSCountDown();
      } else if (res.errorCode == 10) {
        showPicCode();
        btnGetSMSCode.removeAttr("disabled");
        changeImgCode();
      } else {
        alert(res.errorMessage);
        btnGetSMSCode.removeAttr("disabled");
        changeImgCode();
      }
    }, function() {
      alert("获取验证码失败，请稍后刷新重试");
      btnGetSMSCode.removeAttr("disabled");
      changeImgCode();
    });
  }

  // 登录
  function loginFn(phone, smscode, imgCode, nickname, cbk) {
    btnSubmit.attr("disabled", "disabled");

    sendAjax({
      url: loginBaseUrl + "login/imgControl/loginByCaptcha",
      data: {
        channel: 7,
        mobile: phone,
        auto: 1,
        captcha: smscode,
        isImgNeed: isNeedPicCode,
        imgcode: imgCode,
      },
      dataType: "jsonp"
    }, function(data) {
      if(data.errorCode === 0) {
        cbk && cbk(phone, nickname);
      } else if(data.errorCode == 10 || data.errorCode == 6) {
        showPicCode();
      } else {
        alert(data.errorCode + " : " + data.errorMessage);
      }
      btnSubmit.removeAttr("disabled");
      changeImgCode();
    }, function() {
      btnSubmit.removeAttr("disabled");
      changeImgCode();
    });
  }

  function hideLogin() {
    mask.hide();
    loginBox.hide();
  }

  function showLogin() {
    mask.show();
    loginBox.show();
  }

  return {
    init: function(game) {

      // 图形验证码切换
      imgcode.on("click", changeImgCode);

      // 发送验证码按钮
      btnGetSMSCode.on("click", function() {
        if(checkInput()) {
          getSMScode(phoneInput.val(), imgInput.val());
        }
        return false;
      });

      // 登录提交按钮
      btnSubmit.on("click", function() {
        if(checkInput("submit")) {
          loginFn(phoneInput.val(), smsInput.val(), imgInput.val(), nameInput.val(), game);
        }
        return false;
      });
    },
    hideLogin: hideLogin,
    showLogin: showLogin
  };
})();



var raffleRotation = (function() {
  var baseUrl = "http://g.i.focus.cn/";
  var rid = 2510;
  var proName = "fans_raffle";

  var gameParm = getStorage("fans_raffle_info");
  if(gameParm && gameParm.rid != rid) {
    gameParm = null;
    localStorage.removeItem("fans_raffle_info");
  }

  function signGame(phone, nickname) {
    sendAjax({
      url: baseUrl + "raffle/init",
      dataType: "jsonp",
      data: {
        rid: rid,
        userName: phone,
        name: nickname,
        timestamp: (new Date()).getTime()
      }
    }, function(data) {
      if(data.status == 1000 || data.status == 1103) {
        console.log(data);
        gameParm = data.data;
        setStorage("fans_raffle_info", gameParm);

        $(".raffle-unuse-chances span").text(data.data.unusedRoundCount);
        loginModule.hideLogin();

        if(data.data.unusedRoundCount != 0) {
          $(".btn-start").addClass("active");
        } else {
          $(".btn-start").removeClass("active");
        }

      } else if (data.status == 1001) {
        alert("参数有错误");
      } else if (data.status == 1100) {
        alert("活动不存在");
      } else if (data.status == 1101) {
        alert("活动未开始");
      } else if (data.status == 1102) {
        alert("活动已结束");
      } else if (data.status == 1203) {
        alert("用户未被授权");
      } else if (data.status == 1301) {
        // alert("用户尚未登录");
        loginModule.showLogin();
      } else {
        alert("服务器忙,请稍后再试");
      }
    }, function(data) {
      console.log(data);
    });
  }

  // 开始抽奖
  function raffle(cbk) {
    if(!gameParm) {
      loginModule.showLogin();
      return;
    }
    sendAjax({
      url: baseUrl + "raffle/raffle",
      dataType: "jsonp",
      data: {
        rid : gameParm.rid,
        pid : gameParm.pid,
        token : gameParm.token
      }
    }, function(data) {
      console.log(data);
      if(data.status == 1000) {
        gameParm = data.data;
        setStorage("fans_raffle_info", data.data);
        $(".raffle-unuse-chances span").text(data.data.unusedRoundCount);
        cbk && cbk(data.data);
      } else if (data.status == 1001) {
        alert("抽奖：参数有误");
      } else if (data.status == 1002) {
        // alert("抽奖：用户未登录");
        loginModule.showLogin();
      } else if (data.status == 1100) {
        alert("抽奖：活动不存在");
      } else if (data.status == 1101) {
        alert("抽奖：活动未开始");
      } else if (data.status == 1102) {
        alert("抽奖：活动已结束");
      } else if (data.status == 1200) {
        // alert("抽奖：用户未登录");
        loginModule.showLogin();
      } else if (data.status == 1201) {
        alert("抽奖：抽奖机会已用完");
      } else {
        alert("抽奖：服务器忙,请稍后再试");
      }
    }, function() {});
  }

  // 分享增加抽奖机会
  function getChance(cbk) {
    sendAjax({
      url: baseUrl + "raffle/share2chance",
      dataType: "jsonp",
      data: {
        rid : gameParm.rid,
        pid : gameParm.pid,
        token : gameParm.token
      }
    }, function(data) {
      if(data.status == 1000) {
        cbk && cbk();
      } else if (data.status == 1001) {
        alert("分享：参数有误");
      } else if (data.status == 1100) {
        alert("分享：活动不存在");
      } else if (data.status == 1200) {
        alert("分享：用户未登录");
        loginModule.showLogin();
      } else {
        alert("分享：服务器忙,请稍后再试");
      }
    });
  }

  // 获取我的中奖列表
  function getMyList(cbk) {
    if(!gameParm) {
      return;
    }
    sendAjax({
      url: baseUrl + "raffle/mylucklist",
      dataType: "jsonp",
      data: {
        rid : gameParm.rid,
        pid : gameParm.pid,
        token : gameParm.token
      }
    }, function(data) {
      console.log(data);
      cbk && cbk(data);
    });
  }

  return {
    init: signGame,
    raffle: raffle,
    getChance: getChance,
    getMyList: getMyList
  };
})();
