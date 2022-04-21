const {
  baseUrl
} = require('./env').prod
function request(url, method = "GET", data = {}, header = {}) {
  getApp().globalData.isRequest = true
  const openid = wx.getStorageSync('openid') || undefined
  const userinfo = wx.getStorageSync('userinfo') || undefined
  const uid = wx.getStorageSync('userinfo')['uId'] || undefined
  let fullUrl = undefined
  if(url != 'getuserinfo') fullUrl = url[0] != 'h' ? `${baseUrl}/${url}?openid=${openid}&uid=${uid}` : url;
  else fullUrl = `${baseUrl}/${url}`
  wx.showLoading({
    title: '玩命加载中',
  })

  return new Promise((resolve, reject) => {
    wx.request({
      url: fullUrl,
      method: method,
      data: data,
      header: header,
      success(res) {
        if (res.statusCode == 200) {
          getApp().globalData.isRequest = false
          resolve(res.data)
          wx.hideLoading()
        } else {
          if(res.statusCode == 403) {
            userinfo.vip = null
            wx.setStorageSync('userinfo', userinfo)
          }
          getApp().globalData.isRequest = false
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg,
            icon: 'error'
          })
          reject(res.data)
        }
      },
      fail(error) {
        wx.hideLoading()
        wx.showToast({
          title: '网络开小差了',
          icon: 'error'
        })
        reject('网络开小差了')

      }
    })
  })
}

module.exports = {
  request
}