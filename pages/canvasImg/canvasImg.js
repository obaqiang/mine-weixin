// pages/canvasImg/canvasImg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePath: ''
  },
  downLoadImage(url) {
    console.log(url)
    if (!url) {
      return
    }
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: url,
        success(res) {
          console.log(res)
          resolve(res)
        },
        fail(err) {
          console.log('出错图片链接：', url)
          wx.showToast({
            title: '图片资源出错',
            icon: 'none'
          })
          wx.hideLoading()
          reject(err)
        }
      })
    })
  },
  initCanvas() {
    let that = this
    const query = wx.createSelectorQuery() // 创建一个dom元素节点查询器
    query.select('#myCanvas') // 选择我们的canvas节点
      .fields({ // 需要获取的节点相关信息
        node: true, // 是否返回节点对应的 Node 实例
        size: true // 是否返回节点尺寸（width height）
      }).exec((res) => { // 执行针对这个节点的所有请求，exec((res) => {alpiny})  这里是一个回调函数
        const dom = res[0] // 因为页面只存在一个画布，所以我们要的dom数据就是 res数组的第一个元素
        const canvas = dom.node // canvas就是我们要操作的画布节点
        const ctx = canvas.getContext('2d') // 以2d模式，获取一个画布节点的上下文对象
        const dpr = 1
        canvas.width = 750 * dpr
        canvas.height = 1220 * dpr
        ctx.scale(dpr, dpr)
        that.canvasDom = dom
        that.canvas = canvas
        that.ctx = ctx

        const img = canvas.createImage()

        let path = that.downLoadImage('https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1473836766,4030812874&fm=26&gp=0.jpg')
        path.then(res => {
          img.src = res.path
          img.onload = () => {
            ctx.drawImage(img, 0, 0, 750, 750)
          }
        })

      })
  },
  saveImage({
    ctx,
    canvas,
  } = this) {
    let that = this
    try {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvas: canvas,
        destWidth: 750,
        destHeight: 1220,
        quality: 1.0,
        fileType: 'jpg',
        success(res) {
          console.log(res)
          that.setData({
            tempFilePath: res.tempFilePath
          })
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success() {
              wx.showToast({
                title: '已保存到相册，您可将图片分享到朋友圈',
                icon: 'none'
              })
            },
            fail() {
              console.log(1123)
              wx.showToast({
                title: '图片保存失败',
                icon: 'none',
              })
            },
            complete() {
              console.log(123)
              ctx.clearRect(0, 0, 750 * unit, 1220 * unit)
            }
          })


        },
        fail(err) {
          console.log('err', err)
          wx.showToast({
            title: '图片生成失败',
            icon: 'none',
          })
        },
      }, that)
    } catch (error) {
      console.log(error)
    }

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initCanvas()
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