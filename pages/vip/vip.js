// pages/vip/vip.js
Page({

  data: {
  
  },

  onLoad: function (options) {
    var username = wx.getStorageSync('username');
    this.setData({
      username:username
    })
  },

  onTapToOrder(e){
    wx.navigateTo({
      url: '../index/final/final'
    })
  },
  onTapToCard(e){
    wx.navigateTo({
      url: '../card/card'
    })
  },
  onTapToLogout(e){
    wx.navigateTo({
      url: '../logout/logout'
    })
  }
})