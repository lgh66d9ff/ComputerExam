// pages/collect/collect.js
const {
  formatExp
} = require('../../utils/util')
const {
  cancelKill,
  getCollect,
  searchCollect
} = require('../../http/api')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDark: app.globalData.isDark,
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
    questionList: [],
    questionLen: 0,
    currentPage: 1,
    isShow: false,
    questionInfo: {},
    touchDot: 0,
    touchMove: 0,
    scrollViewHeight: 0,
    scrollViewWidth: 0,
    userInfo: null,
    globalData: getApp().globalData,
    search: '',
    isSearch: false,
    btnLoading: false
  },
  findCollect() {
    if (!this.data.search) return
    this.setData({
      btnLoading: true
    })
    searchCollect({
      word: this.data.search
    }).then(res => {
      this.setData({
        isSearch: res.search,
        questionList: res.data,
        questionLen: res.len
      })
    })
    this.setData({
      search: '',
      btnLoading: false
    })
  },
  inputSearch(val) {
    this.setData({
      search: val.detail.value
    })
  },
  loadMore() {
    if (this.data.isSearch) return;
    let page = this.data.currentPage
    if (page >= (this.data.questionLen / 10)) {
      wx.showToast({
        title: '已经到底了哦',
        icon: 'none'
      });
      return;
    }
    this.getQuestionList(page + 1)
    this.setData({
      currentPage: page + 1
    })
  },
  setPuple() {
    this.setData({
      isShow: false
    })
  },
  startTouch(e) {
    this.setData({
      touchDot: e.touches[0].pageX,
      touchMove: 0
    })
  },
  moveTouch(e) {
    this.data.touchMove = e.touches[0].pageX
  },
  endTouch(e) {
    if (!this.data.touchMove) {
      return;
    }

    let diff = this.data.touchMove - this.data.touchDot
    if (this.data.touchMove && diff < -20) {
      if (!this.data.questionList[this.data.questionInfo.index + 1]) {
        this.loadMore()
        return;
      }
      let item = this.data.questionList[this.data.questionInfo.index + 1]
      item.index = this.data.questionInfo.index + 1
      this.setData({
        questionInfo: item,
      })
    } else if (this.data.touchMove && diff > 20 && this.data.questionList[this.data.questionInfo.index - 1]) {
      let item = this.data.questionList[this.data.questionInfo.index - 1]
      item.index = this.data.questionInfo.index - 1
      this.setData({
        questionInfo: item,
      })
    }
    return;
  },
  getQuestionList(page) {
    if (page == 1) {
      this.setData({
        questionList: [],
        questionLen: 0,
        currentPage: 1
      });
    }
    if (this.data.globalData.isRequest) return;
    const that = this
    getCollect({
      'page': page
    }).then(res => {
      this.data.questionList.push(...res.data)
      that.setData({
        questionList: this.data.questionList,
        questionLen: res.len,
      })
      if (this.data.questionInfo.index) {
        let item = this.data.questionList[this.data.questionInfo.index + 1]
        item.index = this.data.questionInfo.index + 1
        this.setData({
          questionInfo: item,
        })
      }

    }).catch(() => {
      this.setData({
        questionList: [],
        questionLen: 0
      })
      getApp().globalData.isAuthority()
    })
  },
  showToast(e) {
    let item = Object.assign({}, e.currentTarget.dataset.item);
    this.data.questionList.forEach(function (e, i) {
      if (e.question == item.question) {
        item.index = i;
      }
    })
    this.setData({
      questionInfo: item,
      isShow: true
    })

  },
  cancelKill(e) {
    let that = this
    const index = e.currentTarget.dataset.id
    cancelKill({
      'id': this.data.questionList[index].id
    }).then(async (res) => {
      wx.showToast({
        title: res.msg,
      })
      this.data.questionList.splice(index, 1)
      that.setData({
        questionList: this.data.questionList
      })
    })
  },
  getRankHeight() {
    wx.getSystemInfo({
      success: (result) => {
        this.setData({
          scrollViewHeight: result.windowHeight,
          scrollViewWidth: result.windowWidth
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRankHeight()
    let user = wx.getStorageSync('userinfo')
    if (user) user.vip = formatExp(user.vip)
    if (!user.vip) {
      wx.setStorageSync('userinfo', user)
      wx.showToast({
        title: '暂无权限',
        icon: 'error',
        duration: 300
      })
      this.setData({
        questionList: []
      })
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }, 300)
      return;
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
    let user = wx.getStorageSync('userinfo')
    if (user) user.vip = formatExp(user.vip)
    if (!user.vip) {
      this.setData({
        questionList: []
      })
      wx.setStorageSync('userinfo', user)
      wx.showToast({
        title: '暂无权限',
        icon: 'error',
        duration: 300
      })

      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }, 300)
      return;
    } else if (user && user.vip) {
      this.setData({
        userInfo: user,
        questionList: [],
        questionLen: 0,
        currentPage: 1
      })
      this.getQuestionList(1)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      questionInfo: {},
      isShow: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let result = wx.getStorageSync('userinfo')
    if (result) {
      wx.showNavigationBarLoading();
      this.getQuestionList(1)
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
  onReachBottom() {
    this.loadMore()
  },

})