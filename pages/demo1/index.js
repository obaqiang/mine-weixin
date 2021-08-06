/*
 * @Descripttion: 
 * @Author: shenqiang
 * @Date: 2020-08-28 10:26:23
 * @LastEditors: shenqiang
 * @LastEditTime: 2020-09-03 19:13:39
 */
import { objToPath } from '../../miniprogram_npm/wx-updata/index'  // 你的库文件路径
// pages/demo1/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    test: {
      a: '我的天啊'
    },
    loading:true,
    swiper_tab_data:{

      sticky_top:'0px',
      swiperTop:0
    }
  },
  swiperTab(e){
    // console.log(e.detail)
  },  
  upData(data) {
    return this.setData(objToPath(data))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.pro.showLoading({
    //     title: '加载中',
    //     mask: true
    //   })
    //   .then(() => console.log('in promise ~'))
    this.upData({
      test: {
        a: '我不要'
      },

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})