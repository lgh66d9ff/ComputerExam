// pages/rank/rank.js
const app = getApp()
const {
  getUserRank
} = require('../../http/api')
const {
  formatYmd,
  formatMinSec
} = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        pagePath: "/pages/index/index",
        text: "首页",
        iconPath: "/img/shouye.png",
        selectedIconPath: "/img/shouye.png"
      },
      {
        pagePath: "/pages/collect/collect",
        text: "收藏",
        iconPath: "/img/gonglve.png",
        selectedIconPath: "/img/baogao1.png"
      },
      // {
      //   pagePath: "/pages/discusstion/discusstion",
      //   text: "讨论区",
      //   iconPath: "/img/jiaoliu.png",
      //   selectedIconPath: "/img/fataolun.png"
      // },
      {
        pagePath: "/pages/rank/rank",
        text: "排行榜",
        iconPath: "/img/paihangbang--copy.png",
        selectedIconPath: "/img/paihangbang-.png"
      },
      {
        pagePath: "/pages/set/set",
        text: "我的",
        iconPath: "/img/wode.png",
        selectedIconPath: "/img/gerenshezhi.png"
      }
    ],
    isDark: app.globalData.isDark,
    userInfo: {},
    preList: [],
    preThree: [],
    rankList: {},
    isTotal: false,
    normalAvator: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132"
  },
  clickMode(e) {
    let status = e.currentTarget.dataset['status']
    this.setData({
      isTotal: status,
      preThree: status ? this.data.preList[1] : this.data.preList[0],
    })
  },
  mapRank(item) {
    item.forEach((e) => {
      e.date = formatYmd(new Date(e.date))
      e.consume = formatMinSec(e.consume)
    })
    return item
  },
  // mapSelf(item) {
  //   item.date = item.date !== false ? formatYmd(new Date(item.date)) : 0
  //   item.consume = item.consume !== false ? formatMinSec(item.consume) : 0
  //   return item
  // },
  getRank() {
    getUserRank().then(res => {
      let data = res.data
      data.total = this.mapRank(data.total)
      data.now = this.mapRank(data.now)
      // res.self.total = this.mapSelf(res.self.total)
      // res.self.now = this.mapSelf(res.self.now)
      this.setData({
        preList: [
          [data.now[0], data.now[1], data.now[2]],
          [data.total[0], data.total[1], data.total[2]]
        ],
        preThree: [data.now[0], data.now[1], data.now[2]],
        rankList: data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
    this.setData({
      isDark: app.globalData.isDark
    })
    wx.setNavigationBarColor({
      backgroundColor: this.data.isDark ? '#292a30' : '#42b983',
      frontColor: '#ffffff'
    })
    this.getRank()
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