// pages/question/question.js
const app = getApp()
const {
  getResiteQuestion,
  putFeedBack,
  getChapterQuestion,
  collcetQuestion,
  getWrongType
} = require('../../http/api');
const {rsa_private_key} = require('../../utils/util')
const Encrypt  = require('../../utils/jsencrypt.js')
let cryptFirst = new Encrypt.JSEncrypt();
cryptFirst.setPublicKey(rsa_private_key())

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDark: app.globalData.isDark,
    pageid: undefined,
    isCurrentIndex: 0,
    isSelect: '',
    rightNum: 0,
    wrongNum: 0,
    isInfo: false,
    isMemory: false,
    isChecked: false,
    isFeedback: false,
    content: "",
    feedItem: {
      qid: undefined,
      answer: '',
      date: undefined
    },
    quizList: [],
    quizLen: 0,
    touchDot: 0,
    touchM: 0,
    scrollViewHeight: 0,
    globalData: getApp().globalData
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().globalData.isAuthority()
    this.setData({
      pageid: options.page,
      quizList: options.page == "7" ? (options.items ? JSON.parse(decodeURIComponent(options.items)) : this.getWrongQuestion(options.name)) : (options.page == '8' ? this.getCQuestion(options.id, options.name) : [])
    })
    options.page != "7" && options.page != "8" && this.getQuestion();
    this.getRankHeight()
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
  showInfo() {
    this.setData({
      isInfo: !this.data.isInfo
    })
  },
  navigoQuestion(e) {
    const index = e.currentTarget.dataset.index
    if(index === this.data.isCurrentIndex) return;
    this.setData({
      isCurrentIndex: index,
      isInfo: false,
      isSelect: '',
      isChecked: false
    })
    this.decryptRsa()
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
          let choiceChange = `quizList[${index}].isCollect`
          this.setData({
            [choiceChange]: true
          })
          wx.showToast({
            title: res.msg,
          })
        }
      })
    }
  },
  getCQuestion(id, name) {
    getChapterQuestion({id, name}).then(res => {
      this.setData({
        quizList: res.data,
        quizLen: res.data.length
      })
    })
  },
  getWrongQuestion(type) {
    getWrongType({type}).then(res => {
      this.setData({
        quizList: res.data,
        quizLen: res.data.length
      })
    })
  },
  showFeedBack() {
    this.setData({
      isFeedback: true,
      feedItem: {}
    })
  },
  hidePopup(e) {
    const status = e.currentTarget.dataset.status
    this.setData({
      [status]: false,
      feedItem: {}
    })
  },
  showMessage(status,content){
    wx.lin.showMessage({
        type:status == 1 ? 'success' : 'error',
        content: content
    })
},
  putFeedback() {
    if (!this.data.feedItem['answer']) {
      this.setData({
        isFeedback: false,
        feedItem: {}
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
  setFeedItem(e) {
    this.setData({
      feedItem: {
        qid: this.data.quizList[this.data.isCurrentIndex]['id'],
        answer: e.detail.currentKey,
        date: undefined
      }
    })
  },
  clickMode(e) {
    let status = e.currentTarget.dataset.status;
    this.setData({
      isMemory: status
    })
    this.decryptRsa()
  },
  decryptRsa() {
    let answer = this.data.quizList[this.data.isCurrentIndex]['answer']
    if(answer.length == 1) return;
    let rsaAnswer = cryptFirst.decrypt(answer)
    let choseChange = `quizList[${this.data.isCurrentIndex}].answer`
    this.setData({
      [choseChange] : rsaAnswer
    })
  },
  touchStart(e) {
    this.setData({
      touchDot: e.touches[0].pageX,
      touchM: 0
    })
    console.log(e.touches[0])
  },
  touchMove(e) {
    this.data.touchM = e.touches[0].pageX;
  },
  localQuestion(type) {
    let index = this.data.isCurrentIndex
    this.setData({
      isCurrentIndex: type ? (index < this.data.quizList.length - 1 ? index + 1 : index) : (index > 0 ? index - 1 : index),
      isSelect: '',
      isChecked: false
    })
  },
  // 策略模式 定义一个通用类
  changeMode(diff, status) {
    const that = this
    let localOrHttp = {
      'local': () => {
        if (diff > -40 && diff < 40) return
        that.localQuestion(diff <= -40 ? 1 : 0)
      },
      'http': () => {
        if (diff > -40 && diff < 40) return
        that.getQuestion(diff <= -40 ? that.data.quizList[0].memory + 1 : that.data.quizList[0].memory - 1)
      }
    }
    return localOrHttp[status ? 'http' : 'local']()
  },
  touchEnd(e) {
    let diff = this.data.touchM - this.data.touchDot
    if ((this.data.quizList.memory < 1 || this.data.quizList[0].memory > this.data.quizLen)) {
      return;
    }
    if (this.data.touchM) {
      this.changeMode(diff, this.data.quizList[0].memory)
      this.decryptRsa()
    }
  },
  judges(e) {
    let isSelect = e.currentTarget.dataset.option
    this.decryptRsa()
    let rsaAnswer = this.data.quizList[this.data.isCurrentIndex].answer

    this.setData({
      isSelect: isSelect,
      isChecked: true,
      rightNum: rsaAnswer == isSelect ? this.data.rightNum + 1 : this.data.rightNum,
      wrongNum: rsaAnswer != isSelect ? this.data.wrongNum + 1 : this.data.wrongNum
    })
  },
  getQuestion(type) {
    const that = this
    const list = {
      3: type,
      4: Math.floor(Math.random() * that.data.quizLen)
    }
    type = list[that.data.pageid]
    getResiteQuestion(type ? {
      type: type
    } : {}).then((res) => {
      if (that.data.pageid == 3) wx.setStorageSync('cache', {
        'cache': true
      })
      that.data.quizList = []
      that.data.quizList.push(res.data.result)
      that.setData({
        quizList: that.data.quizList,
        quizLen: res.data.len,
        isSelect: '',
        isChecked: false
      })
    }).catch(() => {
      getApp().globalData.isAuthority()
    })
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
})