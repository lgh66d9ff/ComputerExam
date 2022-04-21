// pages/correct/correct.js
const {
  getWrongQuestion
} = require('../../http/api')
const {
  treeToNormal,
  isExpired,
  formatExp
} = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDark: app.globalData.isDark,
    list: [],
    today: [],
    windowHeight: 0,
    scrollViewHeight: 0,
    wrong_len: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().globalData.isAuthority()
    this.getInfo()
    this.checkToday()
    this.getRankHeight()
    
  },
  getRankHeight() {
    wx.getSystemInfo({
      success: (result) => {
        this.setData({
          windowHeight: result.windowHeight
        })
      },
    })
    let query = wx.createSelectorQuery().in(this);
    query.select('.wrong_desc').boundingClientRect()
    query.select('.wrong_title').boundingClientRect()
    query.exec((res) => {
      let header = res[0].height
      let footer = res[1] ? res[1].height : 0
      let scrollViewHeight = this.data.windowHeight - header - footer
      this.setData({
        scrollViewHeight: scrollViewHeight
      })
    })
  },
  checkToday() {
    let temp = wx.getStorageSync('today')
    if (temp) {
      temp = JSON.parse(decodeURIComponent(temp))
      if (isExpired(temp['isExpired'])) {
        this.setData({
          today: []
        })
        wx.removeStorageSync('today')
      } else {
        this.setData({
          today: temp['data']
        })
      }
    }
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

  getInfo() {
    getWrongQuestion().then(res => {
      this.setData({
        list: res.data,
        wrong_len: res.len
      })
    }).catch(() => {
      getApp().globalData.isAuthority()
    })
  },
  goPractice(e) {
    wx.navigateTo({
      url: `../question/question?page=7&name=${e.currentTarget.dataset.name}`,
    })
  },
  allQuestion() {
    if (!this.data.list.length) {
      return;
    }
    wx.navigateTo({
      url: `../question/question?page=7&name=all`,
    })
  },
  newWrong() {
    if (!this.data.today.length) {
      return;
    }
    let items = encodeURIComponent(JSON.stringify(this.data.today))
    wx.navigateTo({
      url: `../question/question?page=7&items=${items}`,
    })
  }
})