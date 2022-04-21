// pages/special/special.js
const {
  getChapter
} = require('../../http/api')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isDark: app.globalData.isDark,
    scrollViewHeight: 0,
    list: []
  },
  getRankHeight() {
    wx.getSystemInfo({
      success: (result) => {
        this.setData({
          scrollViewHeight: result.windowHeight
        })
      },
    })
  },
  navigoQuestion(e) {
    let item = e.currentTarget.dataset 
    wx.navigateTo({
      url: `/pages/question/question?id=${item['id']}&name=${item['name']}&page=8`,
    })
  },
  getChapters() {
    getChapter().then(res => {
      this.setData({
        list: res.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRankHeight()
    this.getChapters()
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
    this.setData({
      isDark: app.globalData.isDark
    })
    wx.setNavigationBarColor({
      backgroundColor: this.data.isDark ? '#292a30' : '#42b983',
      frontColor: '#ffffff'
    })
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