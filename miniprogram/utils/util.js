/**
 * 通用工具函数
 */

/**
 * 格式化时间
 * @param {Date} date 日期对象
 * @returns {string} 格式化后的时间字符串
 */
function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

/**
 * 数字补零
 * @param {number} n 数字
 * @returns {string} 补零后的字符串
 */
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 防抖函数
 * @param {function} fn 要执行的函数
 * @param {number} delay 延迟时间（毫秒）
 * @returns {function} 防抖后的函数
 */
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {function} fn 要执行的函数
 * @param {number} interval 间隔时间（毫秒）
 * @returns {function} 节流后的函数
 */
function throttle(fn, interval = 300) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn.apply(this, args)
    }
  }
}

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 计算两点之间的距离（米）
 * @param {number} lat1 纬度1
 * @param {number} lon1 经度1
 * @param {number} lat2 纬度2
 * @param {number} lon2 经度2
 * @returns {number} 距离（米）
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3 // 地球半径（米）
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * 格式化距离
 * @param {number} meters 米
 * @returns {string} 格式化后的距离字符串
 */
function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)}米`
  } else {
    return `${(meters / 1000).toFixed(1)}公里`
  }
}

/**
 * 存储封装
 */
const storage = {
  set(key, value, expire = 0) {
    const data = {
      value,
      expire: expire ? Date.now() + expire * 1000 : 0
    }
    wx.setStorageSync(key, JSON.stringify(data))
  },
  
  get(key) {
    const dataStr = wx.getStorageSync(key)
    if (!dataStr) {
      return null
    }
    
    try {
      const data = JSON.parse(dataStr)
      if (data.expire && Date.now() > data.expire) {
        wx.removeStorageSync(key)
        return null
      }
      return data.value
    } catch (e) {
      return null
    }
  },
  
  remove(key) {
    wx.removeStorageSync(key)
  },
  
  clear() {
    wx.clearStorageSync()
  }
}

/**
 * 网络请求封装
 * @param {object} options 请求选项
 * @returns {Promise} 请求结果
 */
function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: options.header || { 'content-type': 'application/json' },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: reject
    })
  })
}

/**
 * 显示提示信息
 * @param {string} title 提示内容
 * @param {string} icon 图标类型
 * @param {number} duration 显示时长
 */
function showToast(title, icon = 'none', duration = 2000) {
  wx.showToast({
    title,
    icon,
    duration
  })
}

/**
 * 显示加载提示
 * @param {string} title 提示内容
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading()
}

module.exports = {
  formatTime,
  formatNumber,
  debounce,
  throttle,
  generateUUID,
  calculateDistance,
  formatDistance,
  storage,
  request,
  showToast,
  showLoading,
  hideLoading
}