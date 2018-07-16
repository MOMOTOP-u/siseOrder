// pages/logout/logout.js
Page({
  data: {
  },
  onLoad: function (options) {
    wx.clearStorage();
    wx.navigateTo({
      url: '../welcome/welcome',
    })
  }

})