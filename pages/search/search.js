// pages/search/search.js
import Dialog from '@vant/weapp/dialog/dialog';
import Notify from '@vant/weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchData: [],
    hotWord: null,
    historyWords: [],
    value: '',
    showloading: false,
    showkw:true,
    hasMore:false,
    showMore:false,
  },
  // input为空隐藏结果
  hidenResult(e){
    if(e.detail==''){
     this.setData({
      showkw:true
     })
    }
  },
  // clearFn
  clearFn() {
    Dialog.confirm({
        message: '清空搜索记录？',
      })
      .then(() => {
        // on confirm
      })
      .catch(() => {
        // on cancel
      });
  },
  clearall() {
    this.setHistoryWords(1, '-')
  },
  // 设置historywords数据
  setHistoryWords(v, key) {
    var cachedhistorywords = wx.getStorageSync('historywords');
    if (cachedhistorywords) {
      cachedhistorywords = JSON.parse(cachedhistorywords);
      switch (key) {
        case '+':
          this.setData({
            value: v
          })
          let isExist = cachedhistorywords.some(item => {
            return item == v;
          });
          if (!isExist) {
            cachedhistorywords.push(v);
            wx.setStorage({
              data: JSON.stringify(cachedhistorywords),
              key: 'historywords',
            });
            this.setData({
              historyWords: cachedhistorywords
            })
          }
          break;
        case '-':
          cachedhistorywords.length = 0;
          wx.setStorage({
            data: JSON.stringify(cachedhistorywords),
            key: 'historywords',
          });
          this.setData({
            historyWords: cachedhistorywords
          })
          break;
        default:
          this.setData({
            historyWords: cachedhistorywords
          })
          break;
      }
    } else if (v == '') {
      return;
    } else {
      wx.setStorage({
        data: JSON.stringify([v]),
        key: 'historywords',
      });
      this.setData({
        historyWords: [v]
      })
    }
  },
  // 搜索取消函数
  onCancel(e) {
    wx.navigateBack()
  },
  // 确定搜索时触发函数
  onSearch(e) {
    if (isNaN(e.detail.x)) {
      this.getHistoryWord(e.detail)
      this.setHistoryWords(e.detail, '+')
    } else {
      this.getHistoryWord(e.currentTarget.dataset.keydata)
      this.setHistoryWords(e.currentTarget.dataset.keydata, '+')
    }
    // 
  },
  // 获取热门搜索数据
  getHotWord() {
    var cachedhotWord = wx.getStorageSync('hotWordData');
    if (cachedhotWord) {
      cachedhotWord = JSON.parse(cachedhotWord)
    }
    if (cachedhotWord.expires > Date.now()) {
      // 还没过期
      this.setData({
        hotWord: cachedhotWord.data,
      })
    } else {
      // 已经过期
      // this.showOverlay();
      wx.request({
        url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/search/index/kw',
        success: (response) => {
          // 获取成功
          console.log(response);
          if (response.data.data) {
            wx.setStorage({
              data: JSON.stringify({
                expires: Date.now() + 3 * 60 * 60 * 1000,
                data: response.data.data
              }),
              key: 'hotWordData'
            })
            this.setData({
              hotWord: response.data.data,
            })
          } else {
            // 网络请求正常 数据错误 降级是否通知用户
          }
        },
        fail: () => {
          // 网络请求失败 服务器挂掉
        },
        complete: () => {
          // this.hideOverlay();
        }
      })
    }
  },
  // 获取搜索详情数据
  getHistoryWord(v) {
    this.setData({
      showloading: true,
      showkw:false,
      searchData:null
    })
    var str = v.replace(/\s*/g, "")
    wx.request({
      url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/search?kw=' + str,
      success: (response) => {
        console.log(response)
        this.setData({
          searchData: [response.data.data]
        })
        
      },
      complete:() => {
        this.setData({
          showloading: false,
        })
      }
    })
  },
  // 获取更多
  getMore(){
    this.setData({
      showMore:true
    })
    wx.request({
      url: 'https://api.kele8.cn/agent/https://app.vmovier.com' + this.data.searchData[this.data.searchData.length-1].result.next_page_url,
      success: (response) => {
        console.log(response)
        this.data.searchData.push(response.data.data)
        this.setData({
          searchData: this.data.searchData
        })
        if (response.data.msg != 'ok') {
          console.log('hasMore=true 了')
          // 没有更多内容了
          Notify('没有更多内容了');
          this.setData({
            hasMore: true
          })
        }
      },
      complete:() => {
        this.setData({
          showMore:false,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotWord();
    this.setHistoryWords('', '0');
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
    if (this.data.hasMore) {
      Notify('没有更多内容');
    } else {
      this.getMore();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})