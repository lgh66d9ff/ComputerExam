// pages/set/set.js
const {
  getUserOpenId,
  payAccount
} = require('../../http/api')
const {
  formatExp
} = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDark: app.globalData.isDark,
    hasUserInfo: false,
    userInfo: {},
    isShow: false,
    account: '',
    password: '',
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
    globalData: getApp().globalData,
    imgList: ['https://chhhh.cn/wechatpay.jpg', 'https://chhhh.cn/alipay.png']
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._init_()
  },
  _init_() {
    this.setData({
      isDark: app.globalData.isDark
    })
    let user = wx.getStorageSync('userinfo')
    let cache = wx.getStorageSync('cache')
    if (user) {
      this.setData({
        userInfo: user,
        hasUserInfo: true
      })
    } else {
      this.setData({
        userInfo: {},
        hasUserInfo: false
      })
    }
    if(cache) this.login(user.nickName, user.avatarUrl, user.gender)
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.imgList // 需要预览的图片http链接列表
    })
  },
  openDark() {
    if (!this.data.isDark) {
      wx.removeStorageSync('dark')
      app.globalData.isDark = true
      this.setData({
        isDark: true
      })
      wx.setNavigationBarColor({
        backgroundColor: this.data.isDark ? '#292a30' : '#42b983',
        frontColor: '#ffffff'
      })

      return;
    }
    app.globalData.isDark = false
    this.setData({
      isDark: false
    })
    wx.setStorageSync('dark', true)
    wx.setNavigationBarColor({
      backgroundColor: this.data.isDark ? '#292a30' : '#42b983',
      frontColor: '#ffffff'
    })
    return;
  },
  showToasts() {
    this.setData({
      account: '',
      password: '',
      isShow: true
    })
  },
  clearStorage() {
    wx.removeStorageSync('openid')
    wx.removeStorageSync('userinfo')
    this.setData({
      hasUserInfo: false,
      userInfo: {},
      isShow: false,
    })
  },
  payVip() {
    if (!this.data.account || !this.data.password) {
      wx.showToast({
        title: '账号密码不能空',
        icon: 'error'
      })
      return;
    }
    let userInfo = wx.getStorageSync('userinfo')
    payAccount({
      'account': this.data.account,
      'password': this.data.password
    }).then((res) => {
      userInfo.vip = res.data
      wx.setStorageSync('userinfo', userInfo)
      this.setData({
        account: '',
        password: '',
        isShow: false,
        userInfo: userInfo
      })
      wx.showToast({
        title: res.msg,
        icon: 'success'
      })
    }, (err) => {

    })
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  onAccount(e) {
    this.setData({
      account: e.detail.value
    })
  },
  onPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  onHelp() {
    wx.navigateTo({
      url: '/pages/help/help',
    })
  },
  onAbout() {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  navigo(e) {
    let id = e.currentTarget.dataset['id']
    let user = wx.getStorageSync('userinfo')
    if (user) user.vip = formatExp(user.vip)
    if (!user.vip) {
      wx.setStorageSync('userinfo', user)
      wx.showToast({
        title: '暂无权限',
        icon: 'error',
        duration: 300
      })
      return;
    }
    wx.navigateTo({
      url: id == '1' ? '/pages/scores/scores' : '/pages/upload/upload',
    })
  },

  getMyArticle() {
    wx.navigateTo({
      url: '/pages/userarticle/userarticle',
    })
  },
  getMyComment() {
    wx.navigateTo({
      url: '/pages/userreply/userreply',
    })
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
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '登录失败',
        })
      }
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
      fail: () => {
        wx.showToast({
          title: '你取消了授权',
          icon: "none"
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  checkStorage(name) {
    return wx.getStorageSync(name)
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
    this._init_()
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
  async onPullDownRefresh() {
    let result = this.checkStorage('userinfo')
    if (result) {
      wx.showNavigationBarLoading();
      let {
        nickName,
        avatarUrl,
        gender
      } = result
      this.login(nickName, avatarUrl, gender)
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    } else {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }, 0)
    }
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