// pages/play/play.js
// import {delay} from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postId: null,
    postView: null,
    show: false,
  },
  // 跳转到阅读全文
  allTextContent: function (e) {
    console.log(e.currentTarget.dataset.textcontent);
    var videoContext = wx.createVideoContext('myVideo');
    videoContext.pause();
    wx.navigateTo({
      url: '/pages/text/text',
      success: (res) =>{
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: this.data.postView })
      }
    })
  },
  // 页面跳转
  navigateToPlay: function (e) {
    // console.log(e.currentTarget.dataset.recdata)
    var videoContext = wx.createVideoContext('myVideo');
    videoContext.pause();
    wx.navigateTo({
      url: '/pages/play/play?postid=' + e.currentTarget.dataset.recdata,
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
  // 请求获取页面信息
  getPostView: function (id) {
    wx.request({
      url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/post/view?postid=' + id,
      success: (response) => {
        this.setData({
          postView: response.data.data
        })
      },
      complete: () => {
        this.hideOverlay();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.postid);
    
    this.showOverlay();
    
    this.setData({
      postId: options.postid
    })
    this.getPostView(this.data.postId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // delay(100);
    // var _this= this;
    // setTimeout(function () {
    //   _this.hideOverlay();
    // },300)

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