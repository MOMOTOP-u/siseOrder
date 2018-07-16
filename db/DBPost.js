var util = require('../util/util.js')

class DBPost {
  constructor(postId) {
        this.storageKeyName = 'postList';
        this.postId = postId;
    }

    //获取指定id号的文章数据
    getPostItemById() {
        var postsData = this.getAllPostData();
        console.log(postsData);
        var len = postsData.length;
        for (var i = 0; i < len; i++) {
            if (postsData[i].id == this.postId) {
              console.log("postsData[i].id" + postsData[i].id);
              console.log("this.postId" + this.postId);
                return {
                    index: i,
                    data: postsData[i]
                }
            }
        }
    }

    //获取指定id号的评论数据
    getCommentItemById() {
      var postsData = this.getAllCommentData();
      var len = postsData.length;
      console.log("this.postId:");
      console.log(this.postId);
      for (var i = 0; i < len; i++) {
        if (postsData[i].postId == this.postId) {
          return {
            index: i,
            data: postsData[i]
          }
        }
      }
    }
    //获取文章的评论数据
    getCommentData() {
      console.log("itemData:");
      var itemData = this.getCommentItemById().data;
      console.log(itemData);
      itemData.comments.sort(this.compareWithTime); //按时间降序
      var len = itemData.comments.length,
        comment;
      for (var i = 0; i < len; i++) {
        // 将comment中的时间戳转换成可阅读格式
        comment = itemData.comments[i];
        comment.create_time = util.getDiffTime(comment.create_time, true);
      }
      return itemData.comments;
    }

    compareWithTime(value1, value2) {
      var flag = parseFloat(value1.create_time) - parseFloat(value2.create_time);
      if (flag < 0) {
        return 1;
      } else if (flag > 0) {
        return -1
      } else {
        return 0;
      }
    }


    /*得到全部文章信息*/
    getAllPostData() {
        // execSetStorageSync(data);
        var res = wx.getStorageSync(this.storageKeyName);
        console.log("aaa");
        if (!res) {
            console.log("bbb");
            // res = require('../data/data.js').postList;
            // this.initPostList(res);
        }
        return res;
    }

    /*得到全部评论信息*/
    getAllCommentData() {
      var res = require('../data/data.js').postList;
      return res;
    }

    /*初始化缓存数据*/
    execSetStorageSync(data) {
        wx.setStorageSync(this.storageKeyName, data);
    }


    //点赞
    up() {
        var data = this.updatePostData('up');
        return data;
    }

    /*发表评论*/
    newComment(newComment) {
      this.updatePostData('comment', newComment);
    }

    /*初始化缓存数据*/
    execSetStorageSync(data) {
      wx.setStorageSync(this.storageKeyName, data);
    }

    //更新本地的点赞、评论信息、收藏、阅读量
    updatePostData(category, newComment) {
      var itemData = this.getCommentItemById();
        var postData = itemData.data;
        console.log("postData:" + postData.upStatus);
        var allPostData = this.getAllCommentData();
        switch (category) {
            case 'comment':
              postData.comments.push(newComment);
              postData.commentNum++;
              break;
            default:
                break;
        }
        allPostData[itemData.index] = postData;
        this.execSetStorageSync(allPostData);
        return postData;
    }
};

export { DBPost }