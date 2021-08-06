// components/debounce-view/index.js
import {
  deBounce
} from './debounce.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isCreated:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    deTap:deBounce(function(){
      this.triggerEvent('deTap')
    },1000,true),
    deCatchTap:deBounce(function(){
      this.triggerEvent('deCatchTap')
    },1000,true),
  },
  lifetimes: {
    attached() {
 
    }
  }
})