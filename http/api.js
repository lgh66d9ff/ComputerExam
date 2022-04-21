const {request} = require('./request')
const api = {
  question: "tiku/",
  cancel: "cancel/collect",
  userInfo: "user",
  score: "score",
  rank: 'rank',
  resite: 'resite',
  wrong: 'wrong',
  collect: 'collect',
  learn: 'learn',
  searchcollect: 'searchcollect',
  getOpenId: 'getuserinfo',
  pay: 'binduser',
  getscore: 'getscore',
  feedback: 'feedback',
  chapter: 'chapter',
  chapterquestion: 'chapterquestion',
  wrongchapter: 'wrong_chapter',
  // article: 'article',
  // articlev1: 'v1/article',
  // userarticle: 'user/article',
  // searcharticle: 'search/article',
  // reply: 'reply',
  // comment: 'comment',
  // thumb: 'thumb',
  parse: 'parse'
}

module.exports = {
  getParseData: (data) => {
    return request(api.parse, "POST", data, {
      'Content-type': 'application/x-www-form-urlencoded'
    })
  },
  getQuestion: (data) => {
    return request(api.question, "GET", data)
  },
  postScore: (data) => {
    return request(api.score, 'POST', data, {
      'Content-type': 'application/x-www-form-urlencoded'
    })
  },
  // postThumb: (data) => {
  //   return request(api.thumb, 'POST', data, {
  //     'Content-type': 'application/x-www-form-urlencoded'
  //   })
  // },
  // delThumb: (data) => {
  //   return request(api.thumb, 'DELETE', data, {
  //     'Content-type': 'application/x-www-form-urlencoded'
  //   })
  // },
  // postComment: (data) => {
  //   return request(api.comment, 'POST', data, {
  //     'Content-type': 'application/x-www-form-urlencoded'
  //   })
  // },
  // postReply: (data) => {
  //   return request(api.reply, 'POST', data, {
  //     'Content-type': 'application/x-www-form-urlencoded'
  //   })
  // },
  // getReply: (data) => {
  //   return request(api.reply, 'GET', data)
  // },
  // postArticle: (data) => {
  //   return request(api.article, 'POST', data, {
  //     'Content-type': 'application/x-www-form-urlencoded'
  //   })
  // },
  // putArticle: (data) => {
  //   return request(api.article, 'PUT', data, {
  //     'Content-type': 'application/x-www-form-urlencoded'
  //   })
  // },
  // delArticle: (data) => {
  //   return request(api.article, 'DELETE', data, {
  //     'Content-type': 'application/x-www-form-urlencoded'
  //   })
  // },
  // getArticle: (data) => {
  //   return request(api.article, 'GET', data)
  // },
  // getArticlev1: (data) => {
  //   return request(api.articlev1, 'GET', data)
  // },
  // getUserArticle: () => {
  //   return request(api.userarticle, 'GET')
  // },
  // searchArticle: (data) => {
  //   return request(api.searcharticle, 'GET', data)
  // },
  killQuestion: (data) => {
    return request(api.delete, 'POST', data, {
      'Content-type': 'application/x-www-form-urlencoded'})
  },
  collcetQuestion: (data) => {
    return request(api.collect, 'POST', data,{
      'Content-type': 'application/x-www-form-urlencoded'})
  },
  searchCollect: (data) => {
    return request(api.searchcollect, 'GET', data)
  },
  cancelKill: (data) => {
    return request(api.cancel, 'POST', data,{
      'Content-type': 'application/x-www-form-urlencoded'})
  },
  getUserInfo: (data) => {
    return request(api.userInfo, 'GET', data)
  },
  getCollect: (data) => {
    return request(api.collect, 'GET', data)
  },
  getUserRank: () => {
    return request(api.rank, 'GET')
  },
  getResiteQuestion: (data) => {
    return request(api.resite, 'GET',data)
  },
  getWrongQuestion: () => {
    return request(api.wrong, 'GET')
  },
  getUserOpenId: (data) => {
    return request(api.getOpenId, 'POST', data, {'Content-type': 'application/x-www-form-urlencoded'})
  },
  payAccount: (data) => {
    return request(api.pay, 'POST', data, {'Content-type': 'application/x-www-form-urlencoded'})
  },
  getUserScore: () => {
    return request(api.getscore, 'GET')
  },
  getUserLearn: (data) => {
    return request(api.learn, 'GET', data)
  },
  putFeedBack: (data) => {
    return request(api.feedback, 'POST', data, {'Content-type': 'application/x-www-form-urlencoded'})
  },
  getChapter: () => {
    return request(api.chapter, 'GET')
  },
  getChapterQuestion: (data) => {
    return request(api.chapterquestion, 'GET', data)
  },
  getWrongType: (data) => {
    return request(api.wrongchapter, 'GET', data)
  },
}