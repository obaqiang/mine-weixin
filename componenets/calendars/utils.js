export function tips(msg) {
  // console.log(
  //   '%cTips: %c' + msg,
  //   'color:#00B200;font-weight:bold',
  //   'color: #00CC33'
  // );
}

// 日期转换函数
export function formatDate(date) {
  // console.log('curDate', date)
  date = date ? new Date(date) : new Date();
  // console.log('date', date)
  var currentYear = date.getFullYear();
  var currentMonth = date.getMonth() + 1;
  var currentDate = date.getDate();
  if (currentMonth < 10) {
    currentMonth = '0' + currentMonth;
  }
  if (currentDate < 10) {
    currentDate = '0' + currentDate;
  }
  return currentYear + '-' + currentMonth + '-' + currentDate;
}