// utils/api/fetch.js 封装请求方法、请求拦截器

const app = getApp()

const BaseUrl = 'http://172.0.0.1:7300/mock'

const TokenWhiteList = [
  '/app/user/get-by-code' // 不需要鉴权的api手动添加到这里
]

/**
 * 设置请求拦截器
 * @param params 请求参数
 */
const fetch = (params = {}) => {
  // 拦截器逻辑
  if (!TokenWhiteList.includes(params.url)) {
    params.header = {
      'content-type': 'application/json', // 默认值
      'token': app.globalData.token || ''
    }
  }

  if (params.url.startsWith('/')) { // 拼接完整URL
    params.url = BaseUrl + params.url
  }

  // 返回promise
  return wx.pro.request({
      ...params
    })
    .then(({
      data: {
        code,
        message,
        data
      }
    }) => {
      // ... 各种异常情况的逻辑处理
      // 与后端约定 code 20000 时正常返回
      if (code === 20000) return Promise.resolve(data)
      return Promise.reject(message)
    })
}

export {
  fetch
}