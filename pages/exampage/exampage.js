// pages/exampage/exampage.js
const app = getApp()
const {
  getChapter
} = require("../../http/api")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDark: app.globalData.isDark,
    array: [
    ],
    list: [],
    index: 0
  },
  getChapters() {
    getChapter().then(res => {
      let data = res.data
      let name = data.map(item => item.name)
      let chapter = data.map(item => item.data)
      this.setData({
        list: chapter,
        array: [name, chapter[0].map(item => item.name)]
      })
    })
  },
  bindMultiPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    wx.navigateTo({
      url: `/pages/exam/exam?type=${this.data.array[0][e.detail.value[0]] != '本地上传' ? this.data.list[e.detail.value[0]][e.detail.value[1]]['id'] : 'self'}&local=${this.data.array[0][e.detail.value[0]] == '本地上传' && this.data.list[e.detail.value[0]][e.detail.value[1]]['name']}`,
    })
  },
  bindMultiPickerColumnChange: function (e) {
    let change = `array[1]`
    if (!e.detail.column) {
      this.setData({
        [change]: this.data.list[e.detail.value].map(item => item.name)
      })
    }
  },
  navigoExam(e) {
    let page = e.currentTarget.dataset['page']
    let obj = {
      '1': "/pages/exam/exam?type=all",
      '2': "/pages/exam/exam?type=err"
    }
    wx.navigateTo({
      url: obj[page],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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