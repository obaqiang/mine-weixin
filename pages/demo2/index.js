// pages/demo2/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 粘性定位距离顶部的高度
    stickyTop: 0,
    // 目前页面的滚轮滚动距离
    scrollTop: 100,
    showTabs: [{
      text: 'tab1',
      scrollNum: 0,
      suitId: 'aa'
    }, {
      text: 'tab2',
      scrollNum: 0,
      suitId: 'bb'
    }, {
      text: 'tab3',
      scrollNum: 0,
      suitId: 'cc'
    }]
  },
  // 获取ins-tabs组件的位置信息
  tellPos(e) {
    console.log('ins-tabs组件的位置信息', e)
  },
  // 告知ins-tabs组件目前滚动到哪一块状态
  tellCurStatus(e) {
    // console.log('ins-tabs目前滚动到', e)
  },
  initTabs() {
    this.calScrollTop(this.data.showTabs).then(res => {
      // 注意这里使用的setTimeout时为了让页面渲染完成后在进行传递数据，
      // 必须用setTimeout方式，否则scrollNum 始终为0，具体原因未知，猜测 与小程序的渲染加载方式有关
      setTimeout(() => {
        res[0].scrollNum = 0
        this.setData({
          showTabs: res
        })
      }, 500)

    })
  },
  // 计算每个tab对应的区域的位置值
  calScrollTop(tabs) {
    return new Promise(resolve => {
      tabs.forEach((item, index) => {
        // 计算每个tab对应的高度
        let query = wx.createSelectorQuery();
        query.select('#' + item.suitId).boundingClientRect(rect => {
          // 注意这里要加上已经滚动的距离，因为rect中的top是相对目前的屏幕高度
          tabs[index].scrollNum = rect.top + this.data.scrollTop
        }).exec();
      })
      resolve(tabs)
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initTabs()
  },
  onPageScroll(event) {
    this.setData({
      scrollTop: event.scrollTop
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