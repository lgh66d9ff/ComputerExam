// pages/upload/upload.js
const app = getApp()
const {
  getParseData
} = require('../../http/api')
const {
  request
} = require('../../http/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDark: app.globalData.isDark,
    persent: 0,
    filename: '文件名',
  },
  upload() {
    let _this = this;
    _this.setData({
      filename: '文件名',
      persent: 0
    })
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        _this.setData({
          filename: res.tempFiles[0].name
        })
        let name_arr = res.tempFiles[0].name.split('.')
        if (name_arr[name_arr.length - 1] != 'xls' && name_arr[name_arr.length - 1] != 'xlsx') {
          wx.showToast({
            title: '文件错误',
            icon: 'error'
          })
          return;
        }
        const openid = wx.getStorageSync('openid') || undefined
        const uid = wx.getStorageSync('userinfo')['uId'] || undefined
        wx.showLoading({
          title: 'loading'
        })
        let uploadtask = wx.uploadFile({
          filePath: res.tempFiles[0].path,
          name: 'file',
          url: `https://wechat.chhhh.cn/parse?openid=${openid}&uid=${uid}`,
          success(res) {
            let data = JSON.parse(res.data)
            wx.hideLoading()
            wx.showToast({
              title: data.msg,
              icon: data.status != '-1' ? 'success' : 'error'
            })
          }
        })

        uploadtask.onProgressUpdate(res => {
          _this.setData({
            persent: _this.data.persent < 100 ? _this.data.persent+res.progress : _this.data.persent
          })
        })
      },
      fail(error) {
        _this.setData({
          filename: '文件名',
          persent: 0
        })
      }
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