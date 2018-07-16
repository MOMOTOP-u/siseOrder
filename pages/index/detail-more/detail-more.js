// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    activeIndex: 0,
    toView: 'a0',
    scrollTop: 100,
    screenWidth: 667,
    showModalStatus: false,
    currentType: 0,
    currentIndex: 0,
    spicyIndex: 0,
    temIndex: 0,
    cartList: [],
    sumMonney: 0,
    cupNumber:0,
    showCart: false,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var sysinfo = wx.getSystemInfoSync().windowHeight;
    console.log(sysinfo)
    wx.showLoading({
      title: '努力加载中',
    })
    //将本来的后台换成了easy-mock 的接口，所有数据一次请求完 略大。。
    wx.request({
      url: 'https://rt.zhaiqihua.top/testWxprogram/menuType.php',
      header: {
        'content-type': 'application/json'
      },
      //请求后台数据成功  
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        that.setData({
          listData: res.data,
          loading: true
        })
      }
    })
    wx.request({
      url: 'https://rt.zhaiqihua.top/testWxprogram/test.php',
      header: {
        'content-type': 'application/json'
      },
      //请求后台数据成功  
      success: function (res) {
        that.setData({
          listAllData: res.data,
          loading: true
        })
      }
    })

  },
  selectMenu: function (e) {
    var index = e.currentTarget.dataset.index
    console.log(index)
    this.setData({
      activeIndex: index,
      toView: 'a' + index,
      // scrollTop: 1186
    })
    console.log(this.data.toView);
  },
  scroll: function (e) {
    console.log(e)
    var dis = e.detail.scrollTop
    if (dis > 0 && dis < 247) {
      this.setData({
        activeIndex: 0,
      })
    }
    if (dis > 247 && dis < 422) {
      this.setData({
        activeIndex: 1,
      })
    }
    if (dis > 422 && dis < 597) {
      this.setData({
        activeIndex: 2,
      })
    }
    if (dis > 597 && dis < 670) {
      this.setData({
        activeIndex: 3,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  selectInfo: function (e) {
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    this.setData({
      showModalStatus: !this.data.showModalStatus,
      currentType: type,
      currentIndex: index,
      spicyIndex: 0,
      temIndex: 0
    });
  },

  chooseSE: function (e) {
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    if (type == 0) {
      this.setData({
        spicyIndex: index
      });
    }
    if (type == 1) {
      this.setData({
        temIndex: index
      });
    }
  },

  addToCart: function (event) {
    var id = event.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '../detail-buy/detail-buy?id='+id,
    })
  },
  showCartList: function () {
    console.log(this.data.showCart)
    if (this.data.cartList.length != 0) {
      this.setData({
        showCart: !this.data.showCart,
      });
    }

  },
  clearCartList: function () {
    this.setData({
      cartList: [],
      showCart: false,
      sumMonney: 0
    });
  },
  addNumber: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var cartList = this.data.cartList;
    cartList[index].number++;
    var sum = this.data.sumMonney + cartList[index].price;
    cartList[index].sum += cartList[index].price;

    this.setData({
      cartList: cartList,
      sumMonney: sum,
      cupNumber: this.data.cupNumber+1
    });
  },
  decNumber: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var cartList = this.data.cartList;

    var sum = this.data.sumMonney - cartList[index].price;
    cartList[index].sum -= cartList[index].price;
    cartList[index].number == 1 ? cartList.splice(index, 1) : cartList[index].number--;
    this.setData({
      cartList: cartList,
      sumMonney: sum,
      showCart: cartList.length == 0 ? false : true,
      cupNumber: this.data.cupNumber-1
    });
  },
  goBalance: function () {
    if (this.data.sumMonney != 0) {
      wx.setStorageSync('cartList', this.data.cartList);
      wx.setStorageSync('sumMonney', this.data.sumMonney);
      wx.setStorageSync('cupNumber', this.data.cupNumber);
      wx.navigateTo({
        url: '../order/balance/balance'
      })
    }
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})