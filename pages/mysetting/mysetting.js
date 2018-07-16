// page/component/new-pages/user/user.js
Page({
  data: {
    thumb: '',
    orders: [],
    hasAddress: false,
    address: {}
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: '我的订单'
    })
    var user = wx.getStorageSync('username');
    var that = this;
    wx.request({
      url: 'https://rt.zhaiqihua.top/testWxprogram/ListAllCart.php',
      data: { username: user },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      //请求后台数据成功  
      success: function (res) {
        console.log(res.data);
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
  }
})