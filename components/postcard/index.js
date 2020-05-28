// components/postcard/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    post: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateToPlay: function (e) {
      // console.log(e.currentTarget.dataset.post)
      wx.navigateTo({
        url: '/pages/play/play?postid=' + e.currentTarget.dataset.post.postid,
      })
    }
  }
})