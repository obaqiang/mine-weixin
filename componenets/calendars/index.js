// components/calendar/index.js
const calendar = require('./main.js');
const month_ch = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    calendar: {
      type: Object
    },
    config: {
      type: Object,
      observer(val) {
        // 通过配置文件第一次初始化
        this.initCalendar(val);
        this.setData({
          currentMonthIndex: calendar.currentMonthIndex
        })
        // console.log('val.defaultDay', val.defaultDay);
      }
    }
  },
  lifetimes: {
    attached() {
      this.setData({
        page: getCurrentPages()[0]
      })
    },
    detached() {
      // console.log('detached detached detached');
      calendar.lastDate = null;
    }

  },
  /**
   * 组件的初始数据
   */
  data: {
    months: [],
    month_ch,
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    days: [],
    currentMonthIndex: 0, // 当前选中的月份
    page: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initCalendar(config, month_year) {
      // console.log(config, month_year)
      calendar.init(config, month_year);
      // console.log("calendar.dateGrids", calendar.dateGrids)
      this.setData({
        days: calendar.dateGrids,
        months: calendar.monthArr
      })
    },
    // 当月份发生改变
    onMonthChange({
      detail
    }) {
      this.setData({
        currentMonthIndex: detail.key
      });
      this.initCalendar(this.data.config, this.data.months[Number(detail.key)])
    },
    onDateTap({
      currentTarget
    }) {
      const page = this.data.page;
      calendar.jump(currentTarget.dataset.date, this);
      this.setData({
        days: calendar.dateGrids,
      })
      // console.log(this.data.days)
      this.triggerEvent('click', {
        date: currentTarget.dataset.date,
        disable: currentTarget.dataset.disable
      });
    }
  }
})