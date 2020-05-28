// pages/posts/posts.js

import Notify from '@vant/weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recdata: null,
    page: 1,
    // page: 119,
    posts: [],
    showLoading: true,
    hasMore: false
  },
  // 拿数据
  getPostsByCateId(recdata) {
    // 显示加载图标
    this.setData({
      showLoading: true
    })
    var str = wx.getStorageSync(recdata + 'List') || '';
    if (str != '') {
      var Storage = JSON.parse(str);
    } else {
      var Storage = '';
    }

    // let url = isNaN(recdata) ? `https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/post/getPostByTab?p=${this.data.page}&size=10&tab=${recdata}` : `https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/post/getPostInCate?p=${this.data.page}&size=10&cateid=${recdata}`;
    wx.request({
      url: isNaN(recdata) ? `https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/post/getPostByTab?p=${this.data.page}&size=10&tab=${recdata}` : `https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/post/getPostInCate?p=${this.data.page}&size=10&cateid=${recdata}`,
      success: (response) => {
        console.log('response', response)
        if (response.data.data) {
          if (!Storage || (Storage.expires < Date.now() && this.data.page == 1)) {
            wx.setStorage({
              data: JSON.stringify({
                expires: Date.now() + 3 * 60 * 60 * 1000,
                data: response.data.data
              }),
              key: recdata + 'List',
            })
          }
          this.setData({
            posts: [...this.data.posts, ...response.data.data]
          });
        }
        if (response.data.msg !== 'OK') {
          // 没有更多内容了
          Notify('没有更多内容了');
          this.setData({
            hasMore: true
          })
        }
      },
      complete: () => {
        this.setData({
          showLoading: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      recdata: options.recdata
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var cachedCateList = wx.getStorageSync(this.data.recdata + 'List');
    if (cachedCateList) {
      cachedCateList = JSON.parse(cachedCateList)
    }
    if (cachedCateList.expires > Date.now()) {
      // 还没过期
      this.setData({
        posts: cachedCateList.data
      })
    } else {
      this.getPostsByCateId(this.data.recdata);
    }
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
    if (this.data.hasMore) {
      Notify('没有更多内容');
    } else {
      this.setData({
        page: this.data.page + 1
      })
      this.getPostsByCateId(this.data.recdata)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})