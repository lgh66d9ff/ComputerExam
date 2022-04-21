const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatYmd = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${formatNumber(year)}/${formatNumber(month)}/${formatNumber(day)}`
}

const formatYmdC = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${formatNumber(year)}年${formatNumber(month)}月${formatNumber(day)}日`
}


const formatMinSec = total => {
  let min = parseInt(total / 60);
  let sec = parseInt(total % 60);
  return `${formatNumber(min)}分${formatNumber(sec)}秒`
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const formatSecond = (total) => {
  let min = parseInt(total / 60);
  let sec = parseInt(total % 60);
  return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`
}

const calcScore = (items) => {

  let score = items.filter((e) => {
    return e && e['type'] == true
  })
  let total = items.filter((e) => {
    return e
  })
  return [total, score.length * 3];
}

const wrongQuestion = (items) => {
  let result = items.filter((e) => {
    return e && e['type'] == false
  })
  return result
}

const debounce = function (func, delay) {
  let timeout = null
  return function () {
    let context = this
    let args = arguments
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, delay)
  }
}

const treeToNormal = (items) => {
  let result = []
  items.forEach((e) => {
    result.push(...e.questions)
  })
  return result;
}

const isExpired = (exporets) => {
  const current = Math.floor((new Date()).getTime() / 1000)
  return current > exporets
}

const wrong = (arr) => {
  return [].slice.call(arr,0).filter((e) => {
    return e.type == false
  })
}

const returnWrong = (arr, items) => {
  let result = []
  items.forEach((e) => {
    arr.forEach((i) => {
      if(e.id == i.id) {
        result.push(i)
      }
    })
  })
  return result
}

const formatExp = function(vip) {
  if(!vip) return null;
  var expired = vip / 1000
  var now = new Date().getTime() / 1000;
  var result = (expired - now) / 86400;
  return result > 0 ? vip : null;
}

function getWeekDay(dateString) {
  let dateStringReg = /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/;
  if (dateString.match(dateStringReg)) {
      let presentDate = new Date(dateString),
          today = presentDate.getDay() !== 0 ? presentDate.getDay() : 7;
      return Array.from(new Array(7), function (val, index) {
          return formatDate(new Date(presentDate.getTime() - (today - index - 1) * 24 * 60 * 60 *
              1000));
      });
  } else {
      throw new Error('dateString should be like "yyyy-mm-dd" or "yyyy/mm/dd"');
  }
  function formatDate(date) {
      return formatNumber(date.getFullYear()) + '年' + formatNumber((date.getMonth() + 1)) + '月' + formatNumber(date.getDate())+'日';
  }
}

function rsa_private_key() {
  return `MIICXQIBAAKBgQCxvMmCyTRP6jp1sd8JFFMX7Qy31DeqxdrB0wzH5gqMQcuzI20Fl1G6g1VIZQGe6wvEaX2OgT5y2jpjzFxOOTkAgfbNVmwwlHLHWlvoDjujMeToXTCibfNUKIgPW0w1mJuVpICZhr9a6pEaY1INUahA70kqNEoZaS7dljQUqoupNQIDAQABAoGAG6FnIZCo3rw2zqwnqZrXbhKZFbeFLeRTOoArmPnfQuhJmUrVEczxKicXlMkLBEsIScZCfBWwgRysKMPmHPeoBMn5XP4Ne6RLgSU5AOGodifEU9Ulhf2l4tNvAUktPn8iZSi75KLIPzXAiF41GIQeYvVIZQ5St7VMeWUHDD28IHMCQQDMsxeYyjpnRcqAD3o3NbZmOwqIGlpdvaL+LSDaN2hAQROqhFbTnbZ2iU3ZXGlC0RC8n/w453p2aVPodqmE7wDjAkEA3kfi1WdSi6AK3A/lIaNZ/QfQiVt4TrIeTTLDt2fOMbK1l8dVWRuai3a+vPB3qDLN5FJ5UxbJR2MVqYYwy2NBBwJBALrXAUPR2msnFcW72tcH7Nv1KhC+1RrZHCwarvDfQAXeIIA02TfAraoWe3tZ0S5Ou5MgCE08Y9gvHYqCvQp8SPcCQQDdehsWL4EcBjdL1bqkrbK4X9T1R+Kz5t4yZWaFlDTrZ/lwZfkwdESkuYiLkb5oJVbpLRQeKhIbwyqOY1qzDQ55AkANO5kR4TBf/VBdnQe0/Ue2zw+ixwv7qkwIb6ehDfmFqmnw8y92lECKmb7CEpkPQQFWvucyrq81vV9ph/59nMlH`
}

function rsa_public_key() {
  return '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxvMmCyTRP6jp1sd8JFFMX7Qy31DeqxdrB0wzH5gqMQcuzI20Fl1G6g1VIZQGe6wvEaX2OgT5y2jpjzFxOOTkAgfbNVmwwlHLHWlvoDjujMeToXTCibfNUKIgPW0w1mJuVpICZhr9a6pEaY1INUahA70kqNEoZaS7dljQUqoupNQIDAQAB-----END PUBLIC KEY-----'
}


module.exports = {
  formatExp,
  formatTime,
  formatSecond,
  formatYmd,
  formatMinSec,
  calcScore,
  wrongQuestion,
  debounce,
  treeToNormal,
  wrong,
  returnWrong,
  isExpired,
  formatYmdC,
  getWeekDay,
  rsa_public_key,
  rsa_private_key
}