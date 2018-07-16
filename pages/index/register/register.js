// pages/index/register/register.js
Page({
  data: {

  },
  onLoad: function (options) {

  },
  formSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    // console.log(formData.username);
    wx.request({
      url: 'https://rt.zhaiqihua.top/testWxprogram/register.php',
      data: { oname: formData.username, otel: formData.telephone, opass: formData.password },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      //请求后台数据成功  
      success: function (res) {
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 2000
        });
        wx.navigateTo({
          url: "../../welcome/welcome"
        });
      }

    })
  }
})