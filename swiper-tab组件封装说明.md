<!--
 * @Descripttion: 
 * @Author: shenqiang
 * @Date: 2020-09-03 19:29:33
 * @LastEditors: shenqiang
 * @LastEditTime: 2020-09-04 10:50:54
-->
# 记一次小程序的tab切换组件说明
## 前言
> 记一次在工作中封装的组件
> **原因**：面向百度编程失败

## 场景需求：

![](https://imgkr2.cn-bj.ufileos.com/b9f6142b-2703-4076-ac1e-1adf02a48f2b.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=hgrdDnRKPpHlX0GXyyTtwVMx5LA%253D&Expires=1599219202)
设计图如上
* 1 三个tab，可点击切换，可左右滑动切换
* 2 每个tab的list高度不同，切换时需计算每个list的高度并且赋值给swiper容器（左右滑动功能在这里用swiper容器实现）
* 3 吸顶，并且吸顶式tab颜色变为白色

### 开始
**wxml部分**
``` html
<view id="order">
	<view class="swiper-tab swiper-head" style="background:{{sticky_bg}};top:{{sticky_top}};position:{{position_status}};">
		<block wx:for="{{tab_head}}" wx:key="index">
			<view class="swiper-tab-item swiper-int-item {{currentTab==index?'active':''}} " data-current="{{index}}" bindtap="clickTab">
				{{item.text}}

			</view>
		</block>
	</view>
	<swiper style="height:{{swiper_height}}" class="swiper-body" current="{{currentTab}}" data-tab="{{currentTab}}" duration="300" bindchange="swiperTab">
		<block wx:for="{{tab_head}}" wx:key="index">
			<swiper-item>
				<view id="{{'tab_'+index}}">
					<slot name="{{'tab_'+index}}"></slot>
				</view>
			</swiper-item>
		</block>
	</swiper>
</view>
```
**wxss部分**
``` CSS
.swiper-tab {
  width: 100%;
  text-align: center;
  line-height: 90rpx;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  position: sticky;
  z-index: 99999;
  background: #ffffff;
}
.swiper-tab-item {
  width: 30%;
  color: #434343;
  font-size: 28rpx;
  position: relative;
  flex: 1;
}
.active {
  color: #333333;
  font-size: 34rpx;
  font-weight: bold;
}
.swiper_style {
  text-align: center;
  background-color: #fff;
}
.tab_bg_icon{
  position: absolute;
  top: 46rpx;
  left: 70rpx;
  width: 120rpx;
  height: 24rpx;
  z-index: -1;
  visibility: hidden;
}
```
> wxml和wxss 不再过多描述，大致效果图如下

![](https://imgkr2.cn-bj.ufileos.com/517b819b-d1bd-48b7-ae07-c02d0401fdca.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=pWEnZA%252BN2NMW3BQ4RsbPsQmOZCk%253D&Expires=1599223117)

### 问题及可能出现的纠结点：
* 1 何时获取swiper下的list高度及赋值给swiper容器的时机
* 2 吸顶时如何判断背景颜色的变化时机
* 3 tab切换时，如何让每块list内容回到顶部第一条数据

### 问题1解决方式：获取高度方法如下：
``` javascript
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
```
注意：
* 官网：SelectorQuery wx.createSelectorQuery()返回一个 SelectorQuery 对象实例。在自定义组件或包含自定义组件的页面中，应使用 this.createSelectorQuery() 来代替。（就是在组件中使用时加```.in(this);```）
* 这个api一定要在页面实例呈现后获取，并且速度较慢（真机调试效果快与微信开发者工具）（这里，如果list的数据时通过接口返回，就需要在接口返回之后再调用getHeight（）），如我在工作中的例子
![](https://imgkr2.cn-bj.ufileos.com/40868cd5-9887-4ccb-b721-331138eb1c77.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=1tl3ayN8UtPyNJUipaqTIgt5l08%253D&Expires=1599271748)
三个tab的list数据都是从接口中返回拿到，我会在每个接口数据返回后再去getHeight()
(根据实际业务不同，也可以考虑getHeight()的时机)
``` javascript
//当季热门
goodsCommonModel.getHotelList(hotel_param).then(res => {
  this.setData({
    hotelList: that.data.hotelList.concat(res.data.body)
  })
  // 判断上拉加载资源是否小于pageSize
  if (res.data.body.length < 10) {
    this.setData({
      refresh: false
    })
  }
  that.selectComponent('#swiper-list').getHeight(that.data.currentTab)
})
```
### 问题2解决方式：监听pageScroll事件，计算页面滚动的距离是否大于swiperTop（）每次tab切换后需要回滚的距离）大于时就显示吸顶背景色变为白色
![](https://imgkr2.cn-bj.ufileos.com/6ef3e428-2d6c-4678-97b5-d3fef7cb7828.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=aCdlYP7d657pl3uDyFVjXp%252FWL9o%253D&Expires=1599272795)
swiperTop：指tab回滚到吸顶位置的距离，如上图中绿色实线的距离
* 问题：swiperTop如何获得，方法如下：
``` javascript
getDefaultSwiperTop() {
  var query = wx.createSelectorQuery();
  query.select('#swiper-list').boundingClientRect(rect => {
    console.log(rect)
    if (rect) {
      let top = rect.top
      this.setData({
        swiperTop: top - 100 //100为估计距离，应为头部搜索和导航头的高度相加
      })
      // console.log('清楚定时')
      clearInterval(this.data.timer)
      this.setData({
        timer: null
      })
    }


  }).exec();
},
```
> 使用时机：在页面数据全部呈现后计算，也就是在接口数据返回渲染后
``` javascript
 // 每次开启定时器前都先判断是否已存在定时器，若存在就清楚
  this.clearTimer()
  // 这里加定时器是为了防止获取高度失败，因为小程序渲染页面速度过慢导致
  let timer = setInterval(() => {
    that.getDefaultSwiperTop()
  }, 2000)
  this.setData({
    timer: timer
  })
```
> 注意：页面渲染需要一定的时间，getDefaultSwiperTop必须在页面渲染完成后执行，所以可能会出现获取失败情况，我这里是通过定时器，不停的获取，一旦获取成功，就立即清除定时器，目前没有找到更好的解决办法
### 问题3解决方式
``` javascript
 wx.pageScrollTo({
  scrollTop: this.data.swiperTop + 1
});
```
组件项目地址：https://github.com/obaqiang/mine-weixin.git

