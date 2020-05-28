// pages/index/index.js
var data=new Date();
data=data.getDate();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    show: false,
    cateList: [],
    album: null,
    banner: null,
    hot: null,
    posts: null,
    today: null,
    historyData: [],
    showLoading: false,
    Day:data,
  },

  // 页面跳转到posts页面
  routeToPostsList(e) {
    console.log('xx', e.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/posts/posts?recdata=' + e.currentTarget.dataset.recdata,
    })
  },
  // 页面跳转到搜索页面
  routeToSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  // 显示loading
  showOverlay() {
    this.setData({
      show: true
    })
  },
  // 隐藏loading
  hideOverlay() {
    this.setData({
      show: false
    })
  },
  // 设置finddata的数据进行存储
  setFindDataAnalysis(v) {
    this.setData({
      album: v.album,
      banner: v.banner,
      hot: v.hot,
      posts: v.posts,
      today: v.today,
    })
  },
  // 获取发现数据
  getFindData() {
    var cachedFindData = wx.getStorageSync('findData')
    if (cachedFindData) {
      cachedFindData = JSON.parse(cachedFindData)
    }
    if (cachedFindData.expires > Date.now()) {
      // 还没过期
      this.setFindDataAnalysis(cachedFindData.data)
    } else {
      // 已经过期
      this.showOverlay();
      wx.request({
        url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/index/index',
        success: (response) => {
          // 获取成功
          console.log(response.data.data)
          if (response.data.data) {
            wx.setStorage({
              data: JSON.stringify({
                expires: Date.now() + 3 * 60 * 60 * 1000,
                data: response.data.data
              }),
              key: 'findData'
            })
            this.setFindDataAnalysis(response.data.data);
          } else {
            // 网络请求正常 数据错误 降级是否通知用户
          }
        },
        fail: () => {
          // 网络请求失败 服务器挂掉
        },
        complete: () => {
          this.hideOverlay();
        }
      })
    }
  },
  // 获取historyDay更多数据
  getMoreHistoryDay() {
    this.setData({
      showLoading: true,
    });
    var url = this.data.historyData == 0 ? this.data.posts.next_page_url : this.data.historyData[this.data.historyData.length - 1].next_page_url;
    wx.request({
      url: 'https://api.kele8.cn/agent/https://app.vmovier.com' + url,
      success: (response) => {
        // console.log(response.data.data)
        if (response.data.data) {
          this.data.historyData.push(response.data.data)
          this.setData({
            historyData: [...this.data.historyData]
          })
        }
      },
      complete: () => {
        this.setData({
          showLoading: false,
        });
      }
    })
  },
  // 获取分类数据
  getCateList() {
    // 先去本地拿
    var cachedCateList = wx.getStorageSync('cateList')
    if (cachedCateList) {
      cachedCateList = JSON.parse(cachedCateList)
    }
    if (cachedCateList.expires > Date.now()) {
      // 还没过期
      this.setData({
        cateList: cachedCateList.data
      })
    } else {
      // 已经过期
      this.showOverlay();
      wx.request({
        url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/cate/getList',

        success: (response) => {
          // 获取成功
          if (response.data.data) {
            wx.setStorage({
              data: JSON.stringify({
                expires: Date.now() + 3 * 60 * 60 * 1000,
                data: response.data.data
              }),
              key: 'cateList'
            })

            this.setData({
              cateList: response.data.data
            })
          } else {
            // 网络请求正常 数据错误 降级是否通知用户

          }
        },
        fail: () => {
          // 网络请求失败 服务器挂掉

        },
        complete: () => {
          this.hideOverlay();
        }
      })
    }
  },
  // 跳转到播放页面
  navigateToPlay: function (e) {
    // console.log(e.currentTarget.dataset.post.extra_data.app_banner_param)
    wx.navigateTo({
      url: '/pages/play/play?postid=' + e.currentTarget.dataset.post.extra_data.app_banner_param
    })
  },
  // 跳转到每日好句
  routeToDayCover(){
    wx.navigateTo({
      url: '/pages/DayCover/DayCover',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFindData();
    this.getCateList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getMoreHistoryDay();
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
    if (this.data.active == 0) {
      this.getMoreHistoryDay();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})