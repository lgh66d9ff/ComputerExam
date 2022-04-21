// pages/exam/exam.js
const app = getApp()
const {
  getQuestion,
  postScore,
  collcetQuestion,
  putFeedBack
} = require('../../http/api')
const {
  formatSecond,
  calcScore,
  wrongQuestion,
  wrong,
  formatYmd,
  returnWrong,
  isExpired,
  rsa_private_key
} = require('../../utils/util')
const Encrypt  = require('../../utils/jsencrypt.js')
let cryptFirst = new Encrypt.JSEncrypt();
cryptFirst.setPublicKey(rsa_private_key())
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDark: app.globalData.isDark,
    scrollViewHeight: 0,
    windowHeight: 0,
    currentIndex: 0,
    quizList: [],
    myOption: new Array(50),
    errOption: [],
    feedItem: {
      qid: undefined,
      answer: '',
      date: undefined
    },
    persent: 0,
    touchDot: 0,
    touchM: 0,
    touchTopStart: 0,
    touchTopEnd: 0,
    finalScore: 0,
    isShow: false,
    isChecked: null,
    isCommit: false,
    isInfo: false,
    isFeedback: false,
    isSelect: '',
    rightNum: 0,
    wrongNum: 0,
    total: '30:00',
    timer: null,
    second: 1800,
    count: 50,
    content: '',
    consume: 0,
    score: 0,
    notNum: 0,
    errorNum: 0,
    examType: '',
    globalData: getApp().globalData
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRankHeight()
    getApp().globalData.isAuthority()
    if (wx.getStorageSync('exam')) {
      wx.showModal({
        title: "提示",
        content: "你当前还有一个未完成的考试，是否继续?",
        success: (res) => {
          if (res.confirm) {
            let data = JSON.parse(wx.getStorageSync('exam'))
            Object.keys(data).forEach((e) => {
              this.setData({
                [e]: data[e]
              })
            })
            this.setData({
              timer: null
            })
            this.setData({
              timer: setInterval(this.timers, 1000)
            })
          } else {
            this._init_(options['type'], options['local'])
            wx.removeStorageSync('exam')
          }
        }
      })
    } else this._init_(options['type'], options['local'])
    this.setData({
      examType: options['type']
    })
  },
  _init_(type, local) {
    clearInterval(this.data.timer)
    this.setData({
      timer: null,
      second: 1800,
      total: "30:00",
      consume: 0
    })
    this.getQuestions(type, local)
  },
  decryptRsa() {
    let answer = this.data.quizList[this.data.currentIndex]['answer']
    if(answer.length == 1) return;
    let rsaAnswer = cryptFirst.decrypt(answer)
    let choseChange = `quizList[${this.data.currentIndex}].answer`
    this.setData({
      [choseChange] : rsaAnswer
    })
  },
  setFeedItem(e) {
    this.data.feedItem = {
      qid: this.data.quizList[this.data.currentIndex]['id'],
      answer: e.detail.currentKey,
      date: undefined
    }
    this.setData({
      feedItem: this.data.feedItem
    })
  },
  hidePopup(e) {
    const status = e.currentTarget.dataset.status
    this.setData({
      [status]: false
    })
  },
  showInfo() {
    this.setData({
      isInfo: !this.data.isInfo
    })
  },
  showFeedBack() {
    this.setData({
      isFeedback: true,
      feedItem: {}
    })
  },
  showMessage(status, content) {
    wx.lin.showMessage({
      type: status == 1 ? 'success' : 'error',
      content: content
    })
  },
  getRankHeight() {
    wx.getSystemInfo({
      success: (result) => {
        this.setData({
          windowHeight: result.windowHeight
        })
      },
    })
    let query = wx.createSelectorQuery().in(this);
    query.select('.timeInterval').boundingClientRect()
    query.select('.title').boundingClientRect()
    query.select('.process').boundingClientRect()
    query.select('.nav_menu').boundingClientRect()
    query.exec((res) => {
      let header = res[0].height
      let title = res[1].height
      let process = res[2].height
      let footer = res[3].height
      let scrollViewHeight = this.data.windowHeight - header - title - process - footer
      this.setData({
        scrollViewHeight: scrollViewHeight
      })
    })
  },
  putFeedback() {
    if (!this.data.feedItem['answer']) {
      this.setData({
        isFeedback: false
      })
      this.showMessage(-1, '请选择反馈的正确答案');
      return
    }
    this.data.feedItem['date'] = new Date().getTime()
    putFeedBack(this.data.feedItem).then(res => {
      this.setData({
        isFeedback: false
      })
      this.showMessage(res.status, res.msg)
    })
  },
  getQuestions(type, local) {
    getQuestion({type: type, local: local}).then(async (res) => {
      if(!res.data.length) {
        wx.navigateTo({
          url: '/pages/index/index',
        })
        return;
      }
      await this.setData({
        quizList: res.data
      })
      this.setTime()
    }).catch(() => {
      getApp().globalData.isAuthority()
    })
  },
  Settlement() {
    let scores = calcScore(this.data.myOption)
    clearInterval(this.data.timer)
    this.setData({
      isShow: true,
      isInfo: false,
      timer: null,
      score: scores[1],
      notNum: this.data.count - scores[0].length,
      errorNum: wrongQuestion(this.data.myOption).length
    })
    
    
  },
  continueAnswer() {
    if (this.data.isShow) {
      this.setData({
        isShow: false
      })
      this.data.second && !this.data.isCommit && (this.setData({
        timer: setInterval(this.timers, 1000)
      }))
    }
  },
  checkScore() {
    if (this.data.notNum == 50) {
      wx.showToast({
        title: '至少做一题吧~',
        icon: "none"
      })
      return;
    }
    if (this.data.globalData.isRequest || this.data.isCommit) return;
    clearInterval(this.data.timer)
    this.setData({
      timer: null
    })
    let score = calcScore(this.data.myOption)
    let data = {
      result: score[0],
      score: score[1],
      date: new Date().getTime(),
      consume: this.data.consume,
      examType: this.data.examType
    }
    postScore({
      data: JSON.stringify(data)
    }).then(res => {
      this.setData({
        isCommit: true
      })
      let result = returnWrong(this.data.quizList, wrong(data.result))
      let time = Math.floor(((new Date(formatYmd(new Date()) + ' 00:00:00')).getTime() + 86400000) / 1000)
      wx.setStorageSync('cache', {
        cache: true
      })
      if (wx.getStorageSync('today')) {
        let temp = JSON.parse(decodeURIComponent(wx.getStorageSync('today')))
        isExpired(temp['isExpired']) ? (wx.removeStorageSync('today') && wx.setStorageSync('today', encodeURIComponent(JSON.stringify({
          data: result,
          isExpired: time
        })))) : (wx.setStorageSync('today', encodeURIComponent(JSON.stringify({
          data: [].concat(temp['data'], result),
          isExpired: time
        }))));
      } else wx.setStorageSync('today', encodeURIComponent(JSON.stringify({
        data: result,
        isExpired: time
      })))
      wx.removeStorageSync('exam')
      wx.setStorageSync('done', true)
      wx.showModal({
        title: "提示",
        content: "交卷成功，是否返回主页？",
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    })
  },
  collectQues(e) {
    if (this.data.globalData.isRequest) return;
    let index = e.currentTarget.dataset.id
    if (!this.data.quizList[index]['isCollect']) {
      let qId = this.data.quizList[index]['id']
      collcetQuestion({
        'id': qId
      }).then(res => {
        if (res.data) {
          this.data.quizList[index]['isCollect'] = true
          this.setData({
            quizList: this.data.quizList
          })
          wx.showToast({
            title: res.msg,
          })
        }
      })
    }
  },
  timers() {
    let that = this
    that.setData({
      second: that.data.second - 1
    })
    that.setData({
      total: formatSecond(that.data.second),
      consume: that.data.consume + 1
    })
    if (that.data.second === 0) {
      that.Settlement()
    }
  },
  setTime() {
    let that = this
    if (that.data.second != 1800) {
      return;
    } else {
      this.setData({timer: setInterval(that.timers, 1000)})
      wx.onAppHide((res) => {
        if(this.data.isCommit) return;
        clearInterval(that.data.timer)
        that.setData({
          timer: null
        })
      })
      wx.onAppShow((result) => {
        if(this.data.isCommit) return;
        !that.data.timer && (that.setData({
          timer: setInterval(that.timers, 1000)
        }))
      })
    }
  },
  touchStart(e) {
    this.setData({
      touchDot: e.touches[0].pageX,
      touchTopStart: e.touches[0].pageY,
      touchTopEnd: 0,
      touchM: 0
    })
  },
  touchMove(e) {
    this.setData({
      touchM: e.touches[0].pageX,
      touchTopEnd: e.touches[0].pageY
    })
  },
  changeMode(diff, top) {
    const that = this
    const index = this.data.currentIndex
    let preOrNext = {
      'pre': () => index > 0 && that.setPercent(),
      'next': () => index < 49 && that.setPercent(1)
    }
    return diff <= -40 && top <= 50 ? preOrNext['next']() : (diff >= 40 && top <= 50 ? preOrNext['pre']() : '')
  },
  touchEnd(e) {
    if (!this.data.touchM) return;
    let diff = this.data.touchM - this.data.touchDot
    let topDiff = this.data.touchTopEnd - this.data.touchTopStart
    if (this.data.touchM) this.changeMode(diff, topDiff)
  },
  setPercent(type) {
    const that = this
    let index = that.data.currentIndex
    that.setData({
      currentIndex: type ? index + 1 : index - 1,
    })
    this.decryptRsa();
    that.setData({
      persent: that.data.currentIndex / 50 * 100,
      isChecked: null
    })
  },
  navigoQuestion(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentIndex: index,
      isInfo: false
    })
    this.decryptRsa()
  },
  addOption(e) {
    if (this.data.isCommit || this.data.consume == 1800) return;
    let option = e.currentTarget.dataset.option
    let currentQue = this.data.quizList[option[0]]
    this.decryptRsa()
    this.data.myOption[option[0]] = {
      'id': currentQue['id'],
      'isSelect': option[1],
      'isChecked': true,
      'type': true
    }
    this.setData({
      isSelect: option[1],
      isChecked: true
    })
    if (option[1] == currentQue.answer) {
      this.setData({
        myOption: this.data.myOption,
        rightNum: this.data.rightNum + 1
      })
      if (this.data.currentIndex < 49 && this.data.second)
        setTimeout(() => (this.setPercent(1)), 500)
    } else {
      this.data.myOption[option[0]]['type'] = false
      this.setData({
        myOption: this.data.myOption,
        wrongNum: this.data.wrongNum + 1
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
    clearInterval(this.data.timer)
    this.setData({timer: null})
    if (!this.data.isCommit && this.data.quizList.length && this.data.second) {
      delete this.data['isDark']
      wx.setStorageSync('exam', JSON.stringify(this.data))
    }

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