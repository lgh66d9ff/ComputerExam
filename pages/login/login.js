// pages/login/login.js
const {getUserOpenId} = require('../../http/api')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDark: app.globalData.isDark,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  login(nickname, avator, gender) {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          getUserOpenId({
            'code': res.code,
            'nickname': nickname,
            'avator': avator,
            'gender': gender
          }).then((res) => {
            wx.removeStorageSync('cache')
            wx.setStorageSync('openid', res.result.openid)
            wx.setStorageSync('userinfo', res.result)
            this.setData({
              userInfo: res.result,
              hasUserInfo: true
            })
            wx.navigateBack()
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '登录失败',
          icon: 'error'
        })
      }
    })
  },
  cancel() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  getUserProfile(e) {
    const that = this
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: async (res) => {
        let {
          nickName,
          avatarUrl,
          gender
        } = res.userInfo
        await that.login(nickName, avatarUrl, gender)
      },
      fail: () => {}
    })
  },
  async getUserInfo(e) {
    const that = this
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    let {
      nickName,
      avatarUrl,
      gender
    } = e.detail.userInfo
    await that.login(nickName, avatarUrl, gender)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
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
      backgroundColor: this.data.isDark ? '#1e1f25' : '#ffffff',
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