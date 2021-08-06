/*
 * @Descripttion: 
 * @Author: shenqiang
 * @Date: 2020-08-28 10:25:51
 * @LastEditors: shenqiang
 * @LastEditTime: 2020-09-03 19:12:57
 */

Component({
  externalClasses: ['swiper-head','swiper-body','swiper-int-item'],
  /**
   * 组件的属性列表
   */
  properties: {
    // 导航头部信息
    tab_head: {
      type: Array,
      value: [{
        text: 'tab1'
      }, {
        text: 'tab2'
      }, {
        text: 'tab3'
      }, ],
      observer(val) {

      }
    },
    // 每次切换swiper页面需要的回滚距离
    swiperTop:{
      type:Number,
      value:0,
      observer(val){
        
      }
    },
    // 默认显示的tab
    default_tab:{
      type:Number,
      value:0,
      observer(val){
        if(val){
          this.setData({
            currentTab:val
          })
        }
      }
    },
    // 定位状态，默认sticky定位
    position_status:{
      type:String,
      value:'sticky',
      observer(val){
        
      }
    },
    // 吸顶的距离
    sticky_top: {
      type: String,
      value: '',

    },
    //头部导航的背景颜色，用变量控制是为了控制背景颜色能切换
    sticky_bg: {
      type: String,
      value: '#EFEFF4'
    },

  },
  options: {
    multipleSlots: true,

  },

 
  data: {
    // swiper容器的高度
    swiper_height: 0,
    currentTab: 0,

  },


  methods: {
    /**
     * @description: 用于计算每个tab对应的list部分的高度，并给整个swiper区域赋值，因为每个swiper容器的高度都是相等的，如果不进行高度的计算，将会无法看到短区域的数据
     * @params: currentTab：传入的tab对应的顺序数字
     * @return {type} 
     */
    getHeight(currentTab) {
      let query = wx.createSelectorQuery().in(this);
      query.select('#tab_' + currentTab).boundingClientRect(rect => {
        let height = rect.height;
        this.setData({
          swiper_height: height + 20 + 'px'
        })
      }).exec();
    },
    /**
     * @description: 滑动切换swiper触发(注意：每执行一次clickTab，必定会执行一次swiperTab，但每执行一次swiperTab，不执行clickTab)
     * @params: 
     * @return {type} 
     */
    swiperTab: function (e) {
      this.setData({
        currentTab: e.detail.current
      });
      this.getHeight(this.data.currentTab)
      wx.pageScrollTo({
        scrollTop: this.data.swiperTop + 1
      });
      this.triggerEvent('swiperTab',this.data.currentTab)
    },
    /**
     * @description:点击头部切换swiper触发 (注意：每执行一次clickTab，必定会执行一次swiperTab，但每执行一次swiperTab，不执行clickTab)
     * @params: 
     * @return {type} 
     */
    clickTab: function (e) {
      if (this.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        this.setData({
          currentTab: e.target.dataset.current
        })
       
      }
      this.getHeight(this.data.currentTab)
      wx.pageScrollTo({
        scrollTop: this.data.swiperTop + 1
      });
    },
  },
  lifetimes: {
    attached: function () {
      this.getHeight(this.data.currentTab)
    },
    detached: function () {
    },
  },
})