import {
  warn,
  formatDate
} from './utils.js';

class Calendar {
  constructor() {
    this.config = null;
    this.defaultDay = ''; // 默认日期
    this.dateGrids = [];
    this.dateGridsMap = null;
    this.monthArr = []; // 可选月份
    this.lastDate = null; // 记住当前选中的日期
    this.currentMonthIndex = 0; // 初始化时选中的日期
    // month
  }
  // 指定月份共多少天
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  }
  // 指定月份第一天是星期几
  getFirstDayOfWeek(year, month) {
    return new Date(year, month - 1, 1).getDay();
  }

  // 指定日期星期几
  getDayOfWeek(year, month, date) {
    return new Date(year, month - 1, date).getDay();
  }

  // 计算上月应占格子
  calculatePreMonthGrids(year, month) {
    if (Number(month) === 0) year = year - 1;
    let emptyGrids = [];
    const preMonthDays = this.getThisMonthDays(year, month - 1); // 上个月一共多少天
    const lastDayOfLastWeek = this.getDayOfWeek(year, month - 1, preMonthDays); // 上个月最后一天是星期几
    let lastMonthEmptyGrid = [];
    const length = preMonthDays - lastDayOfLastWeek;
    for (let i = preMonthDays; i >= length; i--) {
      let date = formatDate(`${year}-${month - 1 < 10 ? '0' + Number(month - 1) : month - 1}-${i < 10 ? '0' + Number(i) : i}`)
      let obj = {
        date: date,
        day: i,
        disable: true,
        show: false,
      }
      lastMonthEmptyGrid.push(obj);
    }
    // 单月日历，上月占天数
    if (lastMonthEmptyGrid.length >= 7) {
      lastMonthEmptyGrid = []
    }
    lastMonthEmptyGrid = lastMonthEmptyGrid.reverse();
    return lastMonthEmptyGrid;
  }
  // 计算本月应占格子
  calculateThisMonthGrids(year, month) {
    const config = this.config;
    // console.log('config.enableDays', config.enableDays)
    // console.log('onfig.enableDays.length', config.enableDays.length)
    const setEnableDay = !!(config.enableDays && config.enableDays.length);
    // console.log("config", config.enableDays && config.enableDays.length)
    let thisMonthGrids = [];
    const thisMonthDays = this.getThisMonthDays(year, month); // 这个月一共多少天
    for (let i = 1; i <= thisMonthDays; i++) {
      let date = formatDate(`${year}-${month < 10 ? '0' + Number(month) : month}-${i < 10 ? '0' + Number(i) : i}`)
      // console.log("setEnableDay", setEnableDay)
      let obj = {
        date: date,
        day: i,
        disable: setEnableDay,
        show: true
      }
      thisMonthGrids.push(obj);
    }
    return thisMonthGrids;
  }
  // 初始化日历数据
  initDateGrids(year, month) {
    let lastMonthEmptyGrids = this.calculatePreMonthGrids(year, month);
    let thisMonthGrids = this.calculateThisMonthGrids(year, month);
    let dateGrids = lastMonthEmptyGrids.concat(thisMonthGrids);
    let dateGridsMap = new Map();
    // 只渲染当月数据
    for (let value of dateGrids) {
      dateGridsMap.set(value.date, value)
    }
    return dateGridsMap;
  }
  // 初始化日历
  init(config, month_year) {
    this.config = config;
    let curDate, curMonth, curYear;
    let defaultDay = config.defaultDay;
    // 判断是否有默认指定日期
    let days;
    if (defaultDay && typeof defaultDay === 'string') {
      days = config.defaultDay.split('-');
      if (days.length < 3) return warn('默认日期 defaultDay 格式应该为：2019-5-5 或2019-05-05');
      [curYear, curMonth, curDate] = days;
    } else {
      const date = new Date();
      curYear = date.getFullYear();
      curMonth = date.getMonth() + 1;
      curDate = date.getDate();
    }
    if (!this.lastDate) this.lastDate = defaultDay;
    this.defaultDay = defaultDay;
    // 如果没有defaultDay
    if (!curYear && !curMonth && !curDate) {
      const today = new Date();
      curYear = today.getFullYear();
      curMonth = today.getMonth() + 1;
      curDate = today.getDate();
    }
    if (!!month_year) {
      curMonth = month_year.month;
      curYear = month_year.year;
    }
    if (curMonth < 10) {
      curMonth = '0' + Number(curMonth)
    }
    let dateGridsMap = this.initDateGrids(curYear, curMonth);
    // 判断是否有选中日期
    if (this.lastDate != null) {
      const lastValue = dateGridsMap.get(this.lastDate);
      if (!!lastValue) {
        lastValue.current = true;
        dateGridsMap.set(this.lastDate, lastValue);
      }
    }
    // 可选日期
    if (config.enableDays && config.enableDays.length) {
      for (let key of config.enableDays) {
        if (dateGridsMap.has(key)) {
          let value = dateGridsMap.get(key);
          value.disable = false;
          dateGridsMap.set(key, value);
        }
      }
    }
    // 禁选日期
    if (config.disableDays && config.disableDays.length) {
      for (let key of config.disableDays) {
        if (dateGridsMap.has(key)) {
          let value = dateGridsMap.get(key);
          value.disable = true;
          dateGridsMap.set(key, value);
        }
      }
    }
    // 设置日期插槽中的信息
    if (config.labelsGroups) {
      for (let key in config.labelsGroups) {
        if (dateGridsMap.has(key)) {
          const value = dateGridsMap.get(key);
          value.labels = config.labelsGroups[key];
          dateGridsMap.set(key, value)
        }
      }
    }


    this.dateGridsMap = dateGridsMap;
    this.dateGrids = [...dateGridsMap.values()];
    this.calcMonthArr(config);
  }

  // 计算顶部tab显示的月份
  // 如果有指定可选日期，则根据可选日期计算出tab中的月份
  // 否则根据当前月往后推算3个月
  calcMonthArr(config) {
    const defaultDays = this.defaultDay.split('-');
    // 如果有指定可选日期，则根据可选日期计算出tab中的月份
    if (config.enableDays && config.enableDays.length) {
      let enableDays = config.enableDays;
      let yearMap = new Map();
      for (let value of enableDays) {
        const days = value.split('-');
        let monthSet;
        if (yearMap.has(days[0])) {
          monthSet = new Set(yearMap.get(days[0]));
        } else {
          monthSet = new Set();
        }
        monthSet.add((days[1]))
        yearMap.set(days[0], [...monthSet]);
      }
      const monthArr = [];
      let index = 0;
      let finded = false; // 是否找到了当前日期
      for (let key of yearMap.keys()) {
        for (let value of yearMap.get(key)) {
          if (defaultDays[0] === key && defaultDays[1] === value) {
            this.currentMonthIndex = index;
            finded = true;
          }
          if (!finded) index++;
          monthArr.push({
            year: key,
            month: value
          })
        }
      }
      this.monthArr = monthArr;
    }
  }
  jump(date, _this) {
    if (date === this.lastDate) return;
    // 选择默认选中的
    const dateGridsMap = this.dateGridsMap;
    const value = dateGridsMap.get(date);
    if (value.disable) return;
    value.current = true;
    dateGridsMap.set(date, value);
    // 清空上一个lastDate对应的current
    this.clearLastDateCurrent();
    this.lastDate = date;
    this.dateGridsMap = dateGridsMap;
    this.dateGrids = [...dateGridsMap.values()];
    _this.triggerEvent('dateChange', {
      date
    });
  }
  // 清空上一个lastDate对应的current
  clearLastDateCurrent() {
    const dateGridsMap = this.dateGridsMap;
    const lastValue = dateGridsMap.get(this.lastDate);
    if (lastValue) {
      lastValue.current = false;
      dateGridsMap.set(this.lastDate, lastValue);
    }
  }
}
module.exports = new Calendar();