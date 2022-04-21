// app.js
const {formatExp} = require('./utils/util')
App({
  onLaunch() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {

        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }

    // 展示本地存储能力
    const openid = wx.getStorageSync('openid') || null
    const userInfo = wx.getStorageSync('userinfo') || null
    this.globalData.openid = openid
    this.globalData.userInfo = userInfo
    
    if (this.userInfoReadyCallback) { //当index.js获取到了globalData就不需要回调函数了，所以回调函数需要做做一个判断，如果app.js中有和这个回调函数，那么就对这个函数进行调用，并将请求到的结果传到index.js中
      this.userInfoReadyCallback(userInfo);
    }
  },
  globalData: {
    userInfo: null,
    token: null,
    openid: null,
    cookie: '',
    isRequest: false,
    isDark: false,
    isAuthority: function() {
      let user = wx.getStorageSync('userinfo')
      if (user) user.vip = formatExp(user.vip)
      if (!user.vip) {
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
      }
    }
  }
})
