//index.js
Page({
  data: {
    searchValue: ''
  },
  //下拉刷新
  onPullDownRefresh:function(){
    // wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    // wx.hideNavigationBarLoading();
  }, 
  // 搜索页面跳回
  onLoad: function (options) {
    wx.showLoading({
      title: '努力加载中',
    })
    if (options && options.searchValue) {
      this.setData({
        searchValue: ""
      });
    }
    var that = this;
    wx.request({
      url: 'https://rt.zhaiqihua.top/testWxprogram/test.php',
      header: {
        'content-type': 'application/json'
      },
      //请求后台数据成功  
      success: function (res) {
        wx.hideLoading();
        that.setData({
          postList: res.data
        })
        wx.setStorage({
          key: 'postList',
          data: res.data
        })
        console.log("setStorage");
      }
    })
  },
 
  onTapToDetail(event) {
    var postId = event.currentTarget.dataset.postId;
    console.log(postId);
    wx.navigateTo({
      url: 'detail-buy/detail-buy?id=' + postId,
    })
  },
  onTapToMore(event){
    wx.switchTab({
      url: 'detail-more/detail-more'
    })
  },
  // 搜索入口  
  wxSearchTab: function () {
    wx.redirectTo({
      url: '../search/search'
    })
  }






})
