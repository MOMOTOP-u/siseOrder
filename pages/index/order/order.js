// page/component/orders/orders.js
Page({
  data: {
    address: {},
    hasAddress: false,
    total: 0,
  },
  onLoad:function(){
    var that = this;
    var user = wx.getStorageSync('username');
    wx.request({
      url: 'https://rt.zhaiqihua.top/testWxprogram/ListAllCart.php',
      data: { username: user },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      //请求后台数据成功  
      success: function (res) {
        var arr = [];
        var sum = 0;
        for (var i = 0; i < res.data.length; i++) {
          console.log(res.data[i].oname);
          arr.push(res.data[i].num * res.data[i].oprice);
          res.data[i].selected = true;
          sum += arr[i];
        }
        console.log(res.data[0]);
        that.setData({
          cartList: res,
          //总价计算：
          sum: sum
        })
      }
    })
  },

 
  toPay() {
        wx.navigateTo({
          url: '../final/final'
        })
      },
  onShow: function () {
    const self = this;
    wx.getStorage({
      key: 'address',
      success(res) {
        self.setData({
          address: res.data,
          hasAddress: true
        })
      }
    })
  },

})