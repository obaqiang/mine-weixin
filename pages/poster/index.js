// pages/poster/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    productImgs: ["https://file.wanchengly.com/Route/RouteImage/2021/07/29/6918516f-f576-4542-be60-9b1332ad44af.png", "https://file.wanchengly.com/Route/RouteImage/2021/07/29/7b6f8724-2db4-4150-9928-f53d6d8106c9.png", "https://file.wanchengly.com/Route/RouteImage/2021/07/29/54397f8e-9224-4df5-9298-d2b327399d0c.png", "https://file.wanchengly.com/Route/RouteImage/2021/07/29/a73456a1-e74e-4d16-97dd-8a339d8a3cdc.png", "https://file.wanchengly.com/Route/RouteImage/2021/07/29/412fca86-e47b-41d8-861a-4c5ee6391b16.png"],
    unit: 1
  },
  onChange() {

  },
  saveImg() {
    // console.log('保存图片')
    this.initCanvas()
    // this.drawCanvas2D()
  },

  // 初始化canvas的相关配置
  initCanvas() {
    let that = this
    const query = wx.createSelectorQuery() // 创建一个dom元素节点查询器
    query.select('#myCanvas') // 选择我们的canvas节点
      .fields({ // 需要获取的节点相关信息
        node: true, // 是否返回节点对应的 Node 实例
        size: true // 是否返回节点尺寸（width height）
      }).exec((res) => { // 执行针对这个节点的所有请求，exec((res) => {alpiny})  这里是一个回调函数
        console.log('canvas相关配置', res)
        const dom = res[0] // 因为页面只存在一个画布，所以我们要的dom数据就是 res数组的第一个元素
        const canvas = dom.node // canvas就是我们要操作的画布节点
        const ctx = canvas.getContext('2d') // 以2d模式，获取一个画布节点的上下文对象
        // const dpr = wx.getSystemInfoSync().pixelRatio // 获取设备的像素比，未来整体画布根据像素比扩大
        // 因为安卓手机适配问题，dpr必须为1
        let dpr = 2
        // 获取设备系统的相关信息
        wx.getSystemInfoAsync({
          success(res) {
            if (res.system.indexOf('Android') > -1) {
              // console.log('是安卓')
              dpr = 1
            }
          }
        })

        // dpr大小影响图片的显示分辨度，可以理解为影响像素的大小，值越大，越高清，但个人猜测过大会影响渲染效率或者加重小程序运行负担
        // const unit = 2
        canvas.width = 750 * dpr
        canvas.height = 1220 * dpr
        ctx.scale(dpr, dpr)
        // that.setData({
        //   canvasDom: dom, // 把canvas的dom对象放到全局
        //   canvas: canvas, // 把canvas的节点放到全局
        //   // 这里直接给ctx赋值在安卓端会出现报错情况
        //   ctx: ctx, // 把canvas 2d的上下文放到全局
        //   dpr: dpr // 屏幕像素比
        // })
        // 安卓机用setData会出现报错，所以直接保存在that中
        that.canvasDom = dom
        that.canvas = canvas
        that.ctx = ctx

        this.drawWork()
      })

  },

  // TODO:开始绘图
  async drawWork() {

    this.drawBg()
    this.drawProductImg()
    this.drawTitle()
    this.drawPrice()
    this.drawTags()
    await this.drawManInfo()
    // await this.drawErCode()
    // await that.drawFooter()
    setTimeout(() => {
      // that.createCanvasImg()

      Promise.race([this.createCanvasImg(), this.saveImgFailed()]).then(res => {
        // console.log(12312312331)
      }).catch(err => {
        console.log('进入保存图片失败逻辑')
        // wx.hideLoading()
        wx.showToast({
          title: '保存图片失败，请重试',
        })
      })
    }, 300)
  },
  /**
   * @description:绘制产品图片 ,高度拉伸，宽度从中间开始裁剪，测试比例宽：高=1:1
   * @params: 
   * @return {type} 
   */
  drawProductImg(that = this, {
    ctx,
    canvas,

  } = this, {
    unit
  } = this.data) {
    let productOffLeft = 20 * unit;
    let productOffTop = 30 * unit;
    let productWidth = 710 * unit;
    let productHeight = 710 * unit;
    const img = canvas.createImage()
    const imgOne = this.downLoadImage(this.data.productImgs[0])
    imgOne.then(res => {
      console.log(res)
      img.src = res.path
      const imgWidth = res.width * unit,
        imgHeight = res.height * unit
      // 裁剪思路：https://blog.csdn.net/vivian_jay/article/details/68933161
      const sx = imgWidth / 2 - imgHeight / 2
      const sy = 0
      const sWidth = imgHeight,
        sHeight = imgHeight
      console.log(img)
      img.onload = () => {
        console.log('执行')
        ctx.drawImage(img, sx, sy, sWidth, sHeight, productOffLeft, productOffTop, productWidth, productHeight)
      }
    })


  },
  /**
   * @description:将canvas2d转成图片显示 
   * @params: 
   * @return {type} 
   */
  createCanvasImg(that = this, {
    ctx,
    canvas,

  } = this) {
    return new Promise(resolve => {


      const unit = that.data.unit
      setTimeout(function () {
        // let _this = this;
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          // canvasId: 'myCanvas',
          canvas: canvas,
          // destWidth：输出图片的宽度，destHeight：输出图片的高度，这里不写750，具体原因待研究
          destWidth: 750 * unit,
          destHeight: 1220 * unit,
          quality: 1.0,
          fileType: 'jpg',
          success(res) {
            console.log('生成图片成功')
            console.log('res', res)
            // let pngData = upng.encode([res.data.buffer], res.width, res.height);
            // let bs64 = wx.arrayBufferToBase64(pngData);
            that.setData({
              tempFilePath: res.tempFilePath
            })
            // wx.hideLoading()

            that.saveImage()
            resolve(true)

          },
          fail(err) {
            console.log('err', err)
            wx.showToast({
              title: '图片生成失败',
              icon: 'none',
            })
            that.triggerEvent('complete');

          },

        }, that)
      }, 300)
    })
  },
  saveImgFailed() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {

        // wx.hideLoading()
        // wx.showToast({
        //   title: '保存图片失败，请重试',
        // })
        reject('failed')
      }, 10000)
    })
  },
  // 检查用户授权权限
  checkSaveImageAuth() {
    let _this = this
    wx.getSetting({
      success(res) {
        // console.log('检查用户授权权限', res)
        let auth = ''
        // 有权限
        if (res.authSetting['scope.writePhotosAlbum'] === true) {
          // console.log('2')
          auth = '2'
          // 无权限
        } else if (res.authSetting['scope.writePhotosAlbum'] === false) {
          // console.log('1')
          auth = '1'
        } else {
          // 未设置
          // console.log('0')
          auth = '0'
        }
        _this.setData({
          saveImageAuth: auth
        })
      }
    })
  },
  /**
   * @description: 保存图片
   * @params: 
   * @return {type} 
   */
  saveImage({
    ctx
  } = this, {
    unit
  } = this.data) {

    let _this = this;

    let tempFilePath = this.data.tempFilePath;
    console.log('需要的连接', tempFilePath)
    // let tempFilePath = this.data.productImage.path
    if (!tempFilePath) {
      wx.showToast({
        title: '图片生成失败',
        icon: 'none',
      })
      return;
    }
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success() {
        wx.showToast({
          title: '已保存到相册，您可将图片分享到朋友圈',
          icon: 'none'
        })
        _this.triggerEvent('complete');
      },
      fail() {
        wx.showToast({
          title: '图片保存失败',
          icon: 'none',
        })
        _this.checkSaveImageAuth()
      },
      complete() {
        // wx.hideLoading();
        ctx.clearRect(0, 0, 750 * unit, 1220 * unit)
      }
    })
  },
  /**
   * @description:绘制标题 
   * @params: 
   * @return {type} 
   */
  drawTitle(that = this, {
    ctx,
    canvas,

  } = this, {
    unit
  } = this.data) {

    ctx.fillStyle = '#333' // 文字颜色
    ctx.font = `${32}px Arial`; // 文字字号
    let title1 = '这是title';
    let title2 = '';
    if (title1.length > 25) {
      title2 = title1.substring(14, 24) + '...'
    } else if (title1.length > 14) {
      title2 = title1.substring(13)
    }
    title1 = title1.substring(0, 14)
    let textWidth = ctx.measureText(title1).width;
    let canvasWidthNoPadding = (750 - 56 * 2) * unit;
    ctx.fillText(title1, 20 * unit, 878 * unit)
    ctx.fillText(title2, 20 * unit, 913 * unit)
  },
  /**
   * @description:画底部公司logo及名字 
   * @params: 
   * @return {type} 
   */
  drawFooter(that = this, {
    ctx,
    canvas,

  } = this, {
    unit
  } = this.data) {
    return new Promise(resolve => {
      //开启新路径
      ctx.beginPath();
      //设定画笔的宽度
      ctx.lineWidth = 1;
      //设置画笔的颜色
      ctx.strokeStyle = "#e8e8e8";
      //设定笔触的位置
      ctx.moveTo(24, 1115);
      //设置移动的方式
      ctx.lineTo(724, 1115);
      //画线
      ctx.stroke();
      //封闭路径
      ctx.closePath();
      console.log('目标信息', app.globalData.goodsUser)
      let brandLogo = app.globalData.goodsUser.brandlogo || null //品牌LOGO
      console.log('绘制品牌lgoo', brandLogo)
      let brandName = app.globalData.goodsUser.brandname || null //品牌名
      console.log('品牌', brandLogo)
      console.log(1111, brandName)
      // sass化处理，将下面的旅多优选或者brandLogo和brandName先隐藏
      resolve(true)
      if (brandLogo) {
        brandLogo = brandLogo.replace('http://', 'https://')
        // 绘制分公司
        ctx.fillStyle = '#333' // 文字颜色
        ctx.font = `bold ${32}px Arial`; // 文字字号
        const textWidth = ctx.measureText(brandName).width;
        // 整个logo+brandName+margin的宽度
        const logoWidth = (textWidth + 41 + 9) * unit
        const textX = (750 / 2 - logoWidth / 2 + 41 + 9) * unit
        const textY = (1153 + 30) * unit
        ctx.fillText(brandName, textX, textY)
        const img = canvas.createImage()
        let brandLogoImg = this.downLoadImage(brandLogo)
        Promise.all([brandLogoImg]).then(imgs => {
          img.src = imgs[0].path
          console.log(imgs[0].path)
          const offLeft = (750 / 2 - logoWidth / 2) * unit
          console.log(offLeft)
          const offTop = 1153 * unit
          const imgWidth = 41 * unit
          const imgHeight = 41 * unit
          img.onload = () => {
            console.log('开始啊啊啊啊')
            if (that.data.appId == 'wxe3a4de02b297bb08') {
              that.circleImg(ctx, img, offLeft, offTop, 21 * unit)
            }

            resolve(true)
          }
        })

      } else {
        // 绘制旅多优选
        const img = canvas.createImage()
        img.src = '/images/icon/logo_lv.png'
        const offLeft = 255 * unit
        const offTop = 1145 * unit
        const imgWidth = 240 * unit
        const imgHeight = 46 * unit
        img.onload = () => {
          // console.log('开始啊啊啊啊')
          console.log('进入逻辑')
          console.log(that.data.appId)
          if (that.data.appId == 'wxe3a4de02b297bb08') {
            console.log('再进入')
            ctx.drawImage(img, offLeft, offTop, imgWidth, imgHeight);
          }

          resolve(true)
        }
      }
    })




  },
  /**
   * @description:绘制价格信息 
   * @params: 
   * @return {type} 
   */
  drawPrice(that = this, {
    ctx,
    canvas,

  } = this, {
    unit
  } = this.data) {
    let priceIcon = '¥';
    // let price = String(that.data.detail.price); // 价格
    let price = '这是价格';
    let priceQi = '起'
    ctx.font = '28px Arial';
    ctx.fillStyle = "#ff5346"
    ctx.fillText(priceIcon, 20 * unit, (770 + 45) * unit);
    let offsetPriceIcon = ctx.measureText(priceIcon).width;
    ctx.font = '56px Arial';
    ctx.fillText(price, (20 + offsetPriceIcon) * unit, (770 + 45) * unit);
    let offsetPrice = ctx.measureText(price).width;
    ctx.font = '28px Arial';
    ctx.fillStyle = "#ccc"
    let skuMarketPrice = '￥' + '123'

    ctx.fillText(skuMarketPrice, (20 * unit + offsetPriceIcon + offsetPrice), 770 * unit + 45 * unit);
    ctx.save()
    let textWidth = ctx.measureText(skuMarketPrice).width;
    ctx.moveTo((20 * unit + offsetPriceIcon + offsetPrice), 770 * unit + 45 * unit - 12 * unit); //设置起点状态
    ctx.lineTo((20 * unit + offsetPriceIcon + offsetPrice + textWidth), 770 * unit + 45 * unit - 12 * unit); //设置末端状态
    ctx.lineWidth = 5; //设置线宽状态
    ctx.strokeStyle = '#ccc'; //设置线的颜色状态
    ctx.stroke(); //进行绘制
    ctx.restore()


  },

  /**
   * @description:绘制标签 
   * @params: 
   * @return {type} 
   */
  drawTags(that = this, {
    ctx,
    canvas,

  } = this, {
    unit
  } = this.data) {

    // console.log(222222,that.properties)
    const tag_a = '一个标签'
    const tag_b = '一个标签'
    const tag_c = '一个标签'
    ctx.font = '24px Arial';
    ctx.fillStyle = "#1FBEAA"
    // 最多画3个tag

    const textAWidth = ctx.measureText(tag_a).width;
    const tag_a_x = 30 * unit
    const tag_a_y = 975 * unit
    if (tag_a) {
      ctx.fillText(tag_a, tag_a_x, tag_a_y);
      this.roundRect(ctx, tag_a_x - 10 * unit, tag_a_y - 25 * unit, (textAWidth + 20 * unit), 35 * unit, 4 * unit)
    }


    // b的x坐标取A框框的横坐标+A框框的宽+10
    const tag_b_x = (tag_a_x - 20 * unit) + (textAWidth + 40 * unit) + 25 * unit
    const textBWidth = ctx.measureText(tag_b).width;
    if (tag_b) {
      ctx.fillText(tag_b, tag_b_x, tag_a_y);
      this.roundRect(ctx, tag_b_x - 10 * unit, tag_a_y - 25 * unit, (textBWidth + 20 * unit), 35 * unit, 4 * unit)
    }


    // c的x坐标取B框框的横坐标+B框框的宽+10
    const tag_c_x = (tag_b_x - 20 * unit) + (textBWidth + 40 * unit) + 25 * unit
    const textCWidth = ctx.measureText(tag_c).width;
    if (tag_c) {
      ctx.fillText(tag_c, tag_c_x, tag_a_y);
      this.roundRect(ctx, tag_c_x - 10 * unit, tag_a_y - 25 * unit, (textCWidth + 20 * unit), 35 * unit, 4 * unit)
    }
    // 酒店商品展示商圈

    const hibusinesszonename = '商圈'
    ctx.font = '24px Arial';
    ctx.fillStyle = "#999999"
    ctx.fillText(hibusinesszonename, 30 * unit, tag_a_y);





  },
  /**
   * @description:绘制用户昵称手机号等信息 
   * @params: 
   * @return {type} 
   */
  drawManInfo(that = this, {
    ctx,
    canvas,

  } = this, {
    unit
  } = this.data) {
    return new Promise(resolve => {


      let avatarImage = this.downLoadImage('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2Fc8%2Fdd%2Fb9%2Fc8ddb934a69d90216f1b406cf3975475.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1630830386&t=0af311461249e1add3e4fb1735654337');

      if (avatarImage) {
        Promise.all([avatarImage]).then(imgs => {
          const img = canvas.createImage()
          img.src = imgs[0].path
          img.onload = () => {
            // ctx.drawImage(img, 36 * unit, 1010 * unit, 64 * unit, 64 * unit)
            that.circleImg(ctx, img, 20 * unit, 1010 * unit, 32 * unit)
            resolve(true)
          }
        })
      }

      // 绘制昵称
      ctx.fillStyle = '#333' // 文字颜色
      ctx.font = `bold ${26}px Arial`; // 文字字号

      let nick_name = '这是姓名'

      if (nick_name) {
        if (nick_name.length > 7) {
          nick_name = nick_name.substring(0, 8) + '...'
        }
        ctx.fillText(nick_name, 110 * unit, 1014 * unit + 24 * unit)
      }

      // 绘制手机号

      let salePhone = String('13032119191');
      let textWidth = ctx.measureText(nick_name).width;
      ctx.fillText(salePhone, 110 * unit + textWidth + 10 * unit, 1014 * unit + 24 * unit);


      // 绘制推荐好产品
      ctx.fillStyle = '#333' // 文字颜色
      ctx.font = `300 ${26}px Arial`; // 文字字号



    })
  },
  /**
   * @description: 绘制圆角矩形,无填充色
   * @params: 
   * @return {type} 
   */
  roundRect(ctx, x, y, w, h, r) {
    // ctx.save();
    if (w < 2 * r) {
      r = w / 2;
    }
    if (h < 2 * r) {
      r = h / 2;
    }
    ctx.beginPath();
    // ctx.setStrokeStyle('#ff7800');
    // ctx.setFillStyle('transparent')
    // ctx.setLineWidth(0.5);
    ctx.strokeStyle = '#1FBEAA';
    // ctx.fillStyle='transparent';
    ctx.lineWidth = 1;
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.stroke();
    ctx.closePath();
    // ctx.draw(true);
  },
  /**
   * @description: canvas 生成圆角图片（头像等）
   * @params: x,y坐标 r半径
   * @return {type} 
   */
  circleImg(ctx, img, x, y, r) {
    ctx.save();
    var d = 2 * r;
    var cx = x + r;
    var cy = y + r;
    // ctx.strokeStyle='green'
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    // ctx.stroke()
    ctx.closePath()
    ctx.clip();
    ctx.drawImage(img, x, y, d, d);
    ctx.restore();
  },
  /**
   * @description:绘制二维码信息 
   * @params: 
   * @return {type} 
   */
  drawErCode(that = this, {
    ctx,
    canvas,

  } = this, {
    unit
  } = this.data) {
    return new Promise(resolve => {
      let ercodeDesc = '长按识别二维码下单';
      // ctx.setFillStyle('#bbb');
      ctx.fillStyle = "#bbb"
      ctx.font = '22px Arial';
      let ercodeDescWidth = ctx.measureText(ercodeDesc).width;
      let offsetErCode = (750 - 30) * unit - ercodeDescWidth;
      ctx.fillText(ercodeDesc, offsetErCode, 1068 * unit);
      // console.log('imgs', imgs[2])

      // ctx.drawImage(imgs[2], 540 * unit, 860 * unit, 165 * unit, 165 * unit)
      const img = canvas.createImage()

      img.src = that.data.erCodeImage.path
      img.onload = () => {
        ctx.drawImage(img, 540 * unit, 860 * unit, 165 * unit, 165 * unit)
        resolve(true)
      }
    })

  },
  /**
   * @description: 绘制背景
   * @params: 
   * @return {type} 
   */
  drawBg({
    ctx,
  } = this) {
    const unit = this.data.unit
    let bgWidth = 750 * unit
    let bgHeight = 1220 * unit
    // ctx.lineWidth = 20;
    ctx.fillStyle = 'transparent'
    ctx.fillRect(0, 0, bgWidth, bgHeight)
    this.roundRectColor(ctx, 0, 0, bgWidth, bgHeight, 20 * unit)
  },
  /**
   * @description: 绘制圆角矩形（纯色填充）
   * @params: 
   * @return {type} 
   */
  roundRectColor(ctx, x, y, w, h, r) {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = '#ffffff'
    ctx.lineJoin = 'round'; //交点设置成圆角
    ctx.lineWidth = r;
    ctx.strokeRect(x + r / 2, y + r / 2, w - r, h - r);
    ctx.fillRect(x + r, y + r, w - r * 2, h - r * 2);
    ctx.stroke();
    ctx.closePath();
  },
  /**
   * @description: 封装的下载云存储文件函数
   * @params: 
   * @return {type} 
   */
  downLoadCloudFile(id) {
    return new Promise((resolve, reject) => {
      wx.cloud.downloadFile({
        fileID: id,
        success: res => {
          // 返回临时文件路径

          resolve(res.tempFilePath)
        },
        fail: err => {
          console.log('err', err)
        }
      })
    })
  },

  /**
   * @description: 封装的下载图片函数
   * @params: 
   * @return {type} 
   */
  downLoadImage(url) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: url,
        success(res) {
          resolve(res)
        },
        fail(err) {
          console.log('出错图片链接：', url)
          wx.showToast({
            title: '图片资源出错',
            icon: 'none'
          })
          reject(err)
        }
      })
    })
  },
  drawCanvas2D() {
    wx.showToast({
      title: '开始生成图片',
      icon: 'none'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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