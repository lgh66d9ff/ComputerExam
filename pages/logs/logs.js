// logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    list: [{
        pagePath: "/pages/index/index",
        text: "首页",
        iconPath: "/img/shouye.png",
        selectedIconPath: "/img/shouye.png"
      },
      {
        pagePath: "/pages/logs/logs",
        text: "收藏",
        iconPath: "/img/gonglve.png",
        selectedIconPath: "/img/baogao1.png"
      },
      {
        pagePath: "/pages/set/set",
        text: "我的",
        iconPath: "/img/wode.png",
        selectedIconPath: "/img/gerenshezhi.png"
      }
    ],
  },
  onLoad() {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return {
          date: util.formatTime(new Date(log)),
          timeStamp: log
        }
      })
    })
  }
})