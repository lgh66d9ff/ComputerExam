// pages/scores/scores.js
const {
  getUserScore
} = require("../../http/api")
const {
  formatMinSec,
  formatYmdC,
  formatYmd,
  getWeekDay,
  formatExp
} = require("../../utils/util")
const app = getApp()
var wxCharts = require("../../utils/wxcharts.js"); //相对路径
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDark: app.globalData.isDark,
    scoresList: [],
    everyWeek: [],
    imageWidth: 0,
    canvasWidth: 0,
    canvasHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().globalData.isAuthority()

    this.getuserScore()
  },
  getuserScore() {
    getUserScore().then(res => {
      let data = res.data
      let average = res.average
      data.forEach((e) => {
        console.log(formatYmdC(new Date(e.date * 1000)),)
        e.date = formatYmdC(new Date(e.date * 1000)).split('年')[1]
        e.consume = formatMinSec(e.consume)
      })
      average.forEach((e) => e.date = formatYmdC(new Date(e.date * 1000)))
      this.setData({
        scoresList: data,
        everyWeek: average
      })
      this.showLine()
    }).catch(() => {
      getApp().globalData.isAuthority()
    })
  },
  showLine() {
    var windowWidth = '', windowHeight='';    //定义宽高
    try {
      var res = wx.getSystemInfoSync();    //试图获取屏幕宽高数据
      windowWidth = res.windowWidth;   //以设计图750为主进行比例算换
      windowHeight = res.windowWidth / 750 * 550    //以设计图750为主进行比例算换
      this.setData({
        canvasWidth: windowWidth,
        canvasHeight: windowHeight
      })
    } catch (e) {
      console.error('getSystemInfoSync failed!');   //如果获取失败
    }
    let nowWeek = getWeekDay(formatYmd(new Date()))
    let arr = new Array(7)
    arr.fill(0)
    let data = this.data.everyWeek
    data.forEach((e, i) => {
      if (nowWeek.includes(e.date)) arr[nowWeek.indexOf(e.date)] = e.score > arr[nowWeek.indexOf(e.date)] ? e.score : arr[nowWeek.indexOf(e.date)]
    })
    new wxCharts({
      canvasId: 'columnCanvas',
      type: 'line',
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      series: [{
        name: '本周每日最高成绩',
        data: arr
      }],
      yAxis: {
        format: function (val) {
          return val + '分';
        },
        max:150,
        min:0
      },
      width: windowWidth,  //图表展示内容宽度
      height: windowHeight, 
    })
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
})