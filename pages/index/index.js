// index.js
// 获取应用实例
const app = getApp()
const {
  getUserOpenId,
  getUserLearn
} = require('../../http/api')
const {
  formatExp,
  formatTime,
  formatMinSec
} = require('../../utils/util')

Page({
  data: {
    globalData: app.globalData,
    isDark: app.globalData.isDark,
    list: [{
        pagePath: "/pages/index/index",
        text: "首页",
        iconPath: "/img/shouye.png",
        selectedIconPath: "/img/home.png"
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
    userInfo: {},
    learnList: [],
    currentPage: 1,
    learnLen: 0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindGoMessage() {
    wx.navigateTo({
      url: '/pages/message/message',
    })
  },
  onLoad() {
    let user = wx.getStorageSync('userinfo')
    this.getLearn(1)
    if (user)
      this.login(user.nickName, user.avatarUrl, user.gender)
    
  },
  onShow: function () {
    let time = parseInt(formatTime(new Date()).split(' ')[1].split(':')[0]);
    !wx.getStorageSync('dark') && !app.globalData.isDark && (time >= 21 || time <= 7) ? (app.globalData.isDark = true) : '';
    this.setData({
      isDark: app.globalData.isDark
    })
    wx.setNavigationBarColor({
      backgroundColor: this.data.isDark ? '#292a30' : '#42b983',
      frontColor: '#ffffff'
    })
    let user = this.checkStorage('userinfo')
    let done = wx.getStorageSync('done')
    if (user) {
      user.vip = formatExp(user.vip)
      wx.setStorageSync('userinfo', user)
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
    if (done) {
      this.getLearn(1)
      wx.removeStorageSync('done')
    }
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  checkStorage(name) {
    return wx.getStorageSync(name)
  },
  getLearn(page) {
    if (page == 1) {
      this.setData({
        learnList: [],
        learnLen: 0,
        currentPage: 1
      });
    }
    if (this.data.globalData.isRequest) return;
    const that = this;
    getUserLearn({
      page
    }).then(res => {
      let data = res.data
      data.forEach(item => {
        item.time = formatTime(new Date(item.time))
        item.consume = formatMinSec(item.consume)
      })
      that.data.learnList.push(...data)
      that.setData({
        learnList: that.data.learnList,
        learnLen: res.len
      })
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
          icon: 'error'
        })
      }
    })
  },
  getQuestion(e) {
    let userInfo = this.checkStorage('userinfo')
    const id = e.currentTarget.dataset.pageid;
    const list = {
      1: '/pages/special/special',
      2: "/pages/exampage/exampage",
      3: `/pages/question/question?page=${id}`,
      4: `/pages/question/question?page=${id}`,
      5: "/pages/correct/correct",
      6: "/pages/rank/rank",
      7: ""
    }
    if (id == 6) {
      wx.navigateTo({
        url: list[id]
      })
    } else if (!userInfo && id != 6) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    } else {
      userInfo.vip = formatExp(userInfo.vip)
      if (!userInfo.vip && id != 6) {
        wx.setStorageSync('userinfo', userInfo)
        wx.showToast({
          title: '暂无权限',
          icon: 'error'
        })
        return;
      }
      wx.navigateTo({
        url: list[id]
      })
    }
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
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage() {

  },
  async onPullDownRefresh() {
    //在当前页面显示导航条加载动画
    let result = this.checkStorage('userinfo')
    if (result) {
      wx.showNavigationBarLoading();
      let {
        nickName,
        avatarUrl,
        gender
      } = result
      this.login(nickName, avatarUrl, gender);
      await this.getLearn(1);
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
  loadMore() {
    let page = this.data.currentPage
    if (page >= (this.data.learnLen / 10)) {
      wx.showToast({
        title: '已经到底了哦',
        icon: 'none'
      });
      return;
    }
    this.getLearn(page + 1)
    this.setData({
      currentPage: page + 1
    })
  },
  onReachBottom() {
    this.loadMore()
  }
})