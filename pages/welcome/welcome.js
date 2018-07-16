const app = getApp()

Page({
  data: {
    reg: false,
    _num: 1,
    inputType: false
  },
  passwordBtn: function (event) {
    this.setData({
      _num: event.target.dataset.num,
      inputType: false
    })
    if (event.target.dataset.num == 2) {
      wx.navigateTo({
        url: "../index/register/register",
      });
    } else {
      wx.navigateTo({
        url: "../welcome/welcome",
      });
    }
  },
  loginBtn:function(e){
    wx.navigateTo({
      url: '../welcome/welcome',
    })
  },
  formSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    // console.log(formData.username);
    wx.request({
      url: 'https://rt.zhaiqihua.top/testWxprogram/login.php',
      data: { oname: formData.username, opass: formData.password },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      //请求后台数据成功  
      success: function (res) {
        if (typeof (res.data) != "object") {
          // console.log(typeof(res.data));
          console.log("登录失败");
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 2000
          })
        } else {
          console.log("登录成功!");
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          });
          wx.setStorage({
            key: 'username',
            data: formData.username,
          })
          wx.switchTab({
            url: "../index/index",
            success: function () {
              console.log("jump success")
            },
            fail: function () {
              console.log("jump failed")
            },
            complete: function () {
              console.log("jump complete")
            }
          });
        }
      },
      fail:function(res){
        console.log("请求失败");
      }
    })
  }
})