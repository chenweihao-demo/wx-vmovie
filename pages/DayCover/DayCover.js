// pages/DayCover/DayCover.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayCoverData: null
  },
  // 获取DayCover数据
  getDayCover() {
    var cachedDayCoverData = wx.getStorageSync('dayCoverData')
    if (cachedDayCoverData) {
      cachedDayCoverData = JSON.parse(cachedDayCoverData)
    }
    if (cachedDayCoverData.expires > Date.now()) {
      // 还没过期
      this.setData({
        dayCoverData: cachedDayCoverData.data
      })
    } else {
      // 已经过期
      wx.request({
        url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/DayCover/getDayCover',
        success: (response) => {
          // 获取成功
          console.log(response.data.data)
          if (response.data.data) {
            wx.setStorage({
              data: JSON.stringify({
                expires: Date.now() + 3 * 60 * 60 * 1000,
                data: response.data.data
              }),
              key: 'dayCoverData'
            })
            this.setData({
              dayCoverData: response.data.data
            })
          } else {
            // 网络请求正常 数据错误 降级是否通知用户
          }
        },
        fail: () => {
          // 网络请求失败 服务器挂掉
        },
        complete: () => {

        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDayCover()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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