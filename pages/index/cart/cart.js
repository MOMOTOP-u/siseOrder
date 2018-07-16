// page/component/new-pages/cart/cart.js
import { DBPost } from '../../../db/DBPost.js';
var cardTeams;
var startX;
var startY;
var endX;
var endY;
var key;
var maxRight = 60;
Page({
  data: {
    carts: [],               // 购物车列表
    hasList: true,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true,    // 全选状态，默认全选
    obj: {
      name: "hello"
    }
  },
  onLoad: function (options) {
    var username = wx.getStorageSync("username");
    var that =this;
    this.setData({
      selected:true,
      // num:postNum,
      username: username
    })
    wx.request({
      url: 'https://rt.zhaiqihua.top/testWxprogram/ListAllCart.php',
      data: { username: username},
      method: 'POST', 
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      //请求后台数据成功  
      success: function (res) {
        var arr = [];
        var sum = 0;
        for (var i = 0; i < res.data.length;i++){
          console.log(res.data[i].oname);
          arr.push(res.data[i].num * res.data[i].oprice);
          res.data[i].selected = true;
          res.data[i].right = 0;
          res.data[i].startRight = 0;
          sum += arr[i];
        }
        that.setData({
          cartList:res.data,
          //总价计算：
          sum:sum
        })
      }
    })
   
  },

  /**
   * 当前商品选中事件
   */
  selectList(e) {
    var that = this;
    const index = e.currentTarget.dataset.index;
    console.log(index);
    let carts = that.data.cartList[index].selected;
    that.data.cartList[index].selected = !carts;
    // carts[index].selected = !selected;
    carts = that.data.cartList;
    this.setData({
      cartList: carts
    });
    this.getTotalPrice();
    var username = wx.getStorageSync("username");
    
    var that = this;
    for(var i = 0;i<carts.length;i++){
      if (carts[i].selected == false) {
        console.log("delete!!!");
        var num = 0;
        var id = carts[i].id;
        wx.request({
          url: 'https://rt.zhaiqihua.top/testWxprogram/updateCart.php',
          data: { num: num, id: id  },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          //请求后台数据成功  
          success: function (res) {
            console.log("update 0 success!!!");
          }
        })
      }else{
        var num = carts[i].num;
        var id = carts[i].id;
        wx.request({
          url: 'https://rt.zhaiqihua.top/testWxprogram/updateCart.php',
          data: { num: num , id : id },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          //请求后台数据成功  
          success: function (res) {
            console.log("update success!!!");
          } 
        })
      }
    }
    
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    var that = this;
    const id = e.currentTarget.dataset.index;
    console.log(id);
    var username = wx.getStorageSync('username');
    wx.request({
      url: 'https://rt.zhaiqihua.top/testWxprogram/deleteCart.php',
      data: { id: id, username: username },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      //请求后台数据成功  
      success: function (res) {
        console.log(res);
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
          cartList: res.data,
          //总价计算：
          sum: sum
        })
      }
    })

  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.cartList;
    console.log(carts);

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      cartList: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    var that = this;
    var num = e.currentTarget.dataset.countNum;
    const index = e.currentTarget.dataset.index;
    if (num <= 1) {
      let num = 1;
    } else {
      num++;
    }
    this.data.cartList[index].num = num
    let carts = that.data.cartList;
    this.setData({
      cartList: carts
    })
    this.getTotalPrice();

  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    var that = this;
    var num = e.currentTarget.dataset.countNum;
    const index = e.currentTarget.dataset.index;
    if (num <= 1) {
      let num = 1;
    } else {
      num--;
    }
    this.data.cartList[index].num = num
    let carts = that.data.cartList;
    this.setData({
      cartList: carts
    })
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.cartList;                  // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].num * carts[i].oprice;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      cartList: carts,
      sum: total
    });
  },


// 左滑删除
//开始滑动
drawStart : function (e) {
    // console.log("drawStart");
    var touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    var cardTeams = this.data.cartList;
    for (var i in cardTeams) {
      var data = cardTeams[i];
      data.startRight = data.right;
    }
    key = true;
  },
  //结束滑动
  drawEnd: function (e) {
    // console.log("drawEnd");
    var cardTeams = this.data.cartList;
    for (var i in cardTeams) {
      var data = cardTeams[i];
      if (data.right <= 100 / 2) {
        data.right = 0;
      } else {
        data.right = maxRight;
      }
    }
    this.setData({
      cartList: cardTeams
    });
  },
  //滑动
  drawMove: function (e) {
    // console.log("drawMove");
    var self = this;
    var dataId = e.currentTarget.id;
    console.log("dataId:");
    console.log(dataId);
    var cardTeams = this.data.cartList;
    if (key) {
      var touch = e.touches[0];
      endX = touch.clientX;
      endY = touch.clientY;
      console.log("startX=" + startX + " endX=" + endX);
      if (endX - startX == 0)
        return;
      var res = cardTeams;
      //从右往左
      console.log(res);
      if ((endX - startX) < 0) {
        for (var k in res) {
          var data = res[k];
          if (res[k].id == dataId) {
            var startRight = res[k].startRight;
            var change = startX - endX;
            startRight += change;
            if (startRight > maxRight)
              startRight = maxRight;
            res[k].right = startRight;
          }
        }
      } else {//从左往右
        for (var k in res) {
          var data = res[k];
          if (res[k].id == dataId) {
            var startRight = res[k].startRight;
            var change = endX - startX;
            startRight -= change;
            if (startRight < 0)
              startRight = 0;
            res[k].right = startRight;
          }
        }
      }
      self.setData({
        cartList: cardTeams
      });

    }
  }
 


})