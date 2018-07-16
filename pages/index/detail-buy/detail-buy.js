// page/component/details/details.js
import { DBPost } from '../../../db/DBPost.js';
Page({
  data: {
    goods: {},
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false,
    loading: false
  },
  onLoad: function (options) {
    var that= this;
    var postId = options.id;
    this.dbPost = new DBPost(postId);
    this.postData = this.dbPost.getPostItemById().data;
    console.log("ppppp");
    wx.showLoading({
      title: '努力加载中',
    })
    /*评论部分start */
    var comment = this.dbPost.getAllCommentData();
    var len = comment.length;
    wx.hideLoading();
    for (var i = 0; i < len; i++) {
      if (comment[i].postId == postId) {
        this.setData({
          comment: comment[i],
          loading: true
        }) 
      }
    }
    /*评论部分end */
    var username = wx.getStorageSync('username');
    wx.request({
      url: 'https://rt.zhaiqihua.top/testWxprogram/ListAllCart.php',
      data: { username: username },
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
        that.setData({
          cartList: res,
          //总价计算：
          sum: sum
        })
      }
    })
    this.setData({
      post: this.postData,
      username:username
    })
   
    this.setAniation();
  },
  setAniation: function () {
    //定义动画
    var animationUp = wx.createAnimation({
      timingFunction: 'ease-in-out'
    })

    this.animationUp = animationUp
  },
  //点击收藏
  onUpTap: function (event) {
    console.log("1234");
    var postId = event.target.dataset.collect;
    var comment = this.dbPost.getAllCommentData();
    var len = comment.length;
    for (var i = 0; i < len; i++) {
      if (comment[i].postId == postId) {
        if (comment[i].upStatus == 0) {
          comment[i].collectionNum += 1;
          comment[i].upStatus = 1;
        } else {
          comment[i].collectionNum -= 1;
          comment[i].upStatus = 0;
        }
        this.setData({
          'comment.upStatus': comment[i].upStatus,
          'comment.collectionNum': comment[i].collectionNum
        })
      }
    }
      this.animationUp.scale(2).step();
    this.setData({
      animationUp: this.animationUp.export()
    })
    setTimeout(function () {
      this.animationUp.scale(1).step();
      this.setData({
        animationUp: this.animationUp.export()
      })
    }.bind(this), 300);
  },

  onCommentTap: function (event) {
    var postId = event.target.dataset.collect;
    wx.navigateTo({
      url: '../post-comment/post-comment?id=' + postId
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

  goBalance(){
    wx.navigateTo({
      url: '../cart/cart',
    })
  },
  clearCartList(){
    var that = this;
    var username= wx.getStorageSync('username');
    wx.request({
      url: 'https://rt.zhaiqihua.top/testWxprogram/deleteAllCart.php',
      data: {username: username },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      //请求后台数据成功  
      success: function (res) {
        console.log(res.data);
        that.setData({
          cartList: res.data,
        })
      }
    })
  },
  delCount() {
    let num = this.data.num;
    if (num <= 1) {
      let num = 1;
    } else {
      num--;
    }
    this.setData({
      num: num
    })
  },
  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num: num
    })
  },
  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.cartList;                  // 获取购物车列表
    console.log(carts);
    let total = 0;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].num * carts[i].oprice;   // 所有价格加起来
      }
    }
  console.log("aaa");
    this.setData({                                // 最后赋值到data中渲染到页面
      cartList: carts,
      sum: total
    });
  },

  addToCart() {
    var that =this;
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;
    var oname = this.data.post.oname;
    var opic = this.data.post.opic;
    var oprice = this.data.post.oprice;
    var username = wx.getStorageSync('username');
    var id = this.data.post.id;
    wx.request({
      url: 'https://rt.zhaiqihua.top/testWxprogram/addToCart.php',
      data: { oname: oname, opic: opic, oprice: oprice, num: num, total: total, username: username, id: id },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },

      //请求后台数据成功  
      success: function (res) {
        wx.request({
          url: 'https://rt.zhaiqihua.top/testWxprogram/ListAllCart.php',
          data: { username: username },
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
            that.setData({
              cartList: res,
              //总价计算：
              sum: sum
            })
          }
        })
      }
    })

    self.setData({
      show: true
    })
    setTimeout(function () {
      self.setData({
        show: false,
        scaleCart: true
      })
      setTimeout(function () {
        self.setData({
          scaleCart: false,
          hasCarts: true,
          totalNum: num + total
        })
      }, 200)
    }, 300)

  },
  onTapToCart(event) {
    var cartUser = event.currentTarget.dataset.cartUser;
    // ../cart/cart?id={{post.id}}&num={{num}}
    wx.navigateTo({
      url: '../cart/cart?username=' + cartUser ,
    })
  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }

})