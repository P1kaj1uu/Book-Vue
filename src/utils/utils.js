import dayjs from 'dayjs'

export default {
  /*
   * description:时间处理函数,传入时间戳、时间格式、Date()等返回字符串时间或者自定义函数的返回值。
   * @param {*} time 传入时间戳、时间格式、Date() 等
   * @param {*} format
   *            输出格式。包含固定格式 日期date  日期+时间datetime
   *           自定义格式 yyyy-MM-dd HH:mm:ss
   *                     yyyy-MM-dd hh:mm:ss  12小时制
   *                     yyyy-MM-dd HH:mm:ss.ms
   *                     yyyy/MM/dd HH:mm:ss
   *                     自定义函数(dateInfo)=>{} 返回dateInfo对象 可拿到year month day hour hour_12 mintu second milliSecond
   *
   * @param {*} isPadded 是否需要在<10的情况下补0
   * @returns 字符串或者由你自定义函数的返回值
   */
  formate(time, format, isPadded) {
    function _formateNormalize(formatter) {
      if (typeof format === 'function') {
        return formatter
      }
      if (typeof format !== 'string') {
        throw new TypeError('formatter not a string')
      }
      if (format === 'date') {
        formatter = 'yyyy-MM-dd'
      }
      if (format === 'datetime') {
        formatter = 'yyyy-MM-dd HH:mm:ss'
      }
      return function formateFn(dateInfo) {
        const {
          year,
          month,
          day,
          hour,
          hour_12,
          minute,
          second,
          milliSecond,
        } = dateInfo
        formatter = formatter
          .replaceAll('yyyy', year)
          .replaceAll('MM', month)
          .replaceAll('dd', day)
          .replaceAll('HH', hour)
          .replaceAll('hh', hour_12)
          .replaceAll('mm', minute)
          .replaceAll('ss', second)
          .replaceAll('ms', milliSecond)
        return formatter
      }
    }
    let date = new Date(time)

    format = _formateNormalize(format)
    const dateInfo = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      hour_12: date.getHours() % 12,
      minute: date.getMinutes(),
      second: date.getSeconds(),
      milliSecond: date.getMilliseconds(),
    }
    function _padded(prop, length) {
      dateInfo[prop] = dateInfo[prop].toString().padStart(length, '0')
    }
    if (isPadded) {
      _padded('year', 4)
      _padded('month', 2)
      _padded('day', 2)
      _padded('hour', 2)
      _padded('hour_12', 2)
      _padded('minute', 2)
      _padded('second', 2)
    }
    return format(dateInfo)
  },

  dateFormat(dt, format) {
    if (dt && typeof dt === 'number') dt = new Date().setTime(dt)
    if (dt && typeof dt === 'string' && dt.length === 13)
      dt = new Date().setTime(parseInt(dt))
    if (dt && typeof dt === 'string' && dt.length === 10)
      dt = new Date().setDate(parseInt(dt + '000'))
    if (new Date(dt) === 'Invalid Date') {
      return dt
    }
    dt = new Date(dt)
    let o = {
      'M+': dt.getMonth() + 1, // month
      'd+': dt.getDate(), // day
      'H+': dt.getHours(), // hour
      'm+': dt.getMinutes(), // minute
      's+': dt.getSeconds(), // second
      'q+': Math.floor((dt.getMonth() + 3) / 3), // quarter
      S: dt.getMilliseconds(), // millisecond
    }
    if (/(y+)/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (dt.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return format
  },
}
