// utils/api/apis.js 封装所有请求 API

import { fetch } from './fetch'

/* 根据微信code获取用户信息 */
const appUserGetByCode = ({ code } = {}) => fetch({
    url: '/app/user/get-by-code',
    data: { code }
})

/* 扫码登录 */
const appUserQrLogin = ({ qrCode } = {}) => fetch({
    method: 'POST',
    url: '/app/user/qr-login',
    data: { qrCode }
})

/* 个人信息 */
const appUserInfo = () => fetch({
    url: '/app/user/info'
})

/* 系统参数获取，数据字典 */
const appSysParamListByParam = () => fetch({
    url: '/app/sys-param/list-by-param'
})

/* 数据字典所有 */
const appSysParamListAll = () => fetch({
    url: '/app/sys-param/list-all'
})

export {
    appSysParamListAll,   // 数据字典所有
    appSysParamListByParam,   // 系统参数获取，数据字典
    appUserGetByCode,   // 根据微信code获取用户信息
    appUserQrLogin,   // 扫码登录
    appUserInfo   // 个人信息
}
