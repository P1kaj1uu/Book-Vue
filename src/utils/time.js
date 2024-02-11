import dayjs from 'dayjs'
import Utils from './utils'

const filters = {
  textMaxLength(value, maxLength = -1, tail = '...') {
    if (typeof maxLength !== 'number') return value
    if (maxLength === -1) return value
    if (value.length <= maxLength) return value
    return value.substr(0, maxLength) + tail
  },
  
  toDate: function (value) {
    if (!value) return 'xxxx-xx-xx'
    return Utils.dateFormat(value, 'yyyy-MM-dd')
  },
  
  toDateDot: function (value) {
    if (!value) return 'xxxx.xx.xx'
    return Utils.dateFormat(value, 'yyyy.MM.dd')
  },
  
  toLocalDate: function (dt) {
    return Utils.dateFormat(dt, 'yyyy年MM月dd日')
  },
  
  toTime (value) {
    return Utils.dateFormat(value, 'yyyy-MM-dd HH:mm:ss')
  },
  
  toDateTime: function (dt) {
    return dayjs(dt).format('HH:mm:ss')
  },
  
  toLocalDate1: function (dt) {
    if (dt && dt.length === 10) dt = (dt + '000')
    return Utils.dateFormat(dt, 'yyyy年MM月dd日')
  },
  
  subStrTo: function (value, sub) {
    if (value && value.length > sub) {
      return value.substring(0, sub)
    } else {
      return value
    }
  },
  
  toBefore: function (time) {
    if (!time) return time
    if (typeof time === 'string') time = time.replace(' ', 'T').substr(0, 19)
    let date1 = ''
    if (typeof time === 'number') {
      date1 = time
    } else {
      try {
        date1 = new Date(time).getTime()
      } catch (err) {
        // safari时间格式
        let timestampStr = time
        date1 = new Date(timestampStr).getTime() // 2018-01-01
      }
    }
    let date2 = (new Date()).getTime()
    let before = parseInt(parseInt(date2 - date1) / 1000 / 60 / 60)
    if (before < 24) {
      if (before < 1) {
        return '刚刚'
      } else {
        return before + '小时前'
      }
    } else {
      let beforeDay = parseInt(before / 24)
      if (beforeDay < 30) {
        return beforeDay + '天前'
      } else {
        let beforeMonth = parseInt(beforeDay / 30)
        if (beforeMonth < 12) {
          return beforeMonth + '月前'
        } else {
          let beforeYear = parseInt(beforeMonth / 12)
          return beforeYear + '年前'
        }
      }
    }
  },
  
  // 3天内特殊展示，其余展示日期
  last3dayBefore(time) {
    // 文章列表文章的显示时间调整
    // 发布时间1天内，显示：1小时前、2小时前、...、23小时前
    // 发布时间1-3天，显示：1天前、2天前、3天前
    // 发布时间超过3天，显示：2019年05月25日
    if (!time) return time
    if (typeof time === 'string') time = time.replace(' ', 'T').substr(0, 19)
    let date1 = ''
    if (typeof time === 'number') {
      date1 = time
    } else {
      try {
        date1 = new Date(time).getTime()
      } catch (err) {
        // safari时间格式
        // date1 = new Date(time).getTime() // 2018-01-01
      }
    }
    let date2 = (new Date()).getTime()
    let before = parseInt(parseInt(date2 - date1) / 1000 / 60 / 60)
    if (before < 24) {
      if (before < 1) {
        return '刚刚'
      } else {
        return before + '小时前'
      }
    } else {
      let beforeDay = parseInt(before / 24)
      // if (beforeDay < 30) {
      if (beforeDay < 4) {
        return beforeDay + '天前'
      } else {
        // return date
        const d = new Date(time)
        return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
      }
    }
  },
}

export default filters
