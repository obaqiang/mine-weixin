// componenets/ins-tabs/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    theme: { //tabs的样式主题，我这里提供两种，normal:默认 small：文字等相关偏小的主题
      type: String,
      value: 'normal'
    },
    adjustTop: { //给予用户自己调节内容到顶部的距离
      type: Number,
      value: 200
    },
    scrollTop: {
      type: Number,
      value: 0,
      observer(val) {
        // 1、当页面滚动、监听距离，
        // 2、tab自动根据距离切换到对应的位置
        if (!this.data.tabLock) {
          const scrollSection = this.data.scrollSection
          if (scrollSection.length > 0) {
            scrollSection.forEach((item, index) => {
              // 判断当前页面的滚动距离对应tabs的哪一块区域，告知页面当前tabs所在
              let a = item[0],
                b = item[1]
              if (val > a && val < b && this.data.curIndex != index) {
                // 这里对curIndex  进行判断是为了防止重复进行setData，影响小程序的性能
                this.setData({
                  curIndex: index
                })
                this.triggerEvent('tellCurText', this.data.tabs[this.data.curIndex].text)
              }
            })
            if (val > scrollSection[scrollSection.length - 1][1]) {
              // 当数值大于最大的tabs的值的时候，应该为最后一个tab
              this.setData({
                curIndex: scrollSection.length
              })
              this.triggerEvent('tellCurText', this.data.tabs[this.data.curIndex].text)
            }
          }
        }
      }
    },
    scrollX: { //tabs组件横向是否可以滚动
      type: Boolean,
      value: false
    },
    stickyTop: { //吸顶时，对应的高度
      type: Number,
      value: 0,
      observer(val) {

      }

    },
    tabs: {
      type: Array,
      value: [],
      observer(val) {
        // 将tabs转变为一个距离的区间 
        const scrollSection = val.reduce((resArr, curVal, curIndex, arr) => {
          if (curIndex < arr.length - 1) {
            let obj = [curVal.scrollNum, arr[curIndex + 1].scrollNum]
            resArr.push(obj)
          }
          return resArr
        }, [])
        this.setData({
          scrollSection: scrollSection
        })
        this.calPos()
      }
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    curIndex: 0,
    // 1、tabLock= true  所著后scroll的变化将无法影响tab切换
    tabLock: false,
    scrollSection: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    calPos() {
      // 计算tabs对应的位置信息并告知页面，方便页面需要其位置信息时使用
      let query = wx.createSelectorQuery().in(this);
      query.select('#insTabs').boundingClientRect(rect => {
        this.triggerEvent('tellPos', rect)
      }).exec();
    },
    changeTab(e) {
      // 1、切换tab
      // 2、并使页面滚动到对应的位置
      // 3、页面滚动时不能影响tab，tab锁状态打开
      // 每次点击都要把上次的副作用移除，去掉影响,这一步非常重要，否则会出现tab回弹的问题
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.setData({
        curIndex: e.currentTarget.dataset.index
      })
      this.triggerEvent('tellCurText', this.data.tabs[this.data.curIndex].text)
      const scrollTop = this.data.tabs[this.data.curIndex].scrollNum - this.data.adjustTop
      // 这里的200可根据个人需要进行调整
      wx.pageScrollTo({
        duration: 500,
        scrollTop: scrollTop
      })
      this.setData({
        tabLock: true
      })
      // 这里的1s 就是说1s内scroll滚动将影响对tabs的切换
      this.timer = setTimeout(() => {
        this.setData({
          tabLock: false
        })
      }, 1000)

    },
  }
})