import Vue from 'vue'

//导入PC适配JS(H5)
// #ifdef H5
// import "./pc";
// #endif

import App from './App'

import request from './utils/request.js'
Vue.prototype.$H = request;
// request.hookImg();

// 挂载Vuex
import store from './store';  
Vue.prototype.$store = store;

// config配置文件
import config from './utils/config.js';  
Vue.prototype.$c = config;

// 公共方法
import fun from './utils/function.js';  
Vue.prototype.$f = fun;

// Qui公共JS
import Qui from './uni_modules/q-view/js_sdk/index.js';  
Vue.prototype.$q = Qui;

import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false

App.mpType = 'app'

//时间格式化

Vue.filter('timeFormat',function(data) { //data是接受的item.time

					// console.log('data1:',data)
					if (typeof data === 'string') {
						data = new Date(data.replace(/-/g, '/')).getTime()
					} else {
						if (time.toString().length === 10) {
							data = new Date(time * 1000).getTime()
						}else{
							data = new Date(time).getTime()
						}
					}
					// console.log('data2:',data)
					//将字符串转换成时间格式
					let result;
					let timePublish = new Date(data);
					// console.log('data3:',data)
					// console.log('timePublish:',timePublish)
					let timeNow = new Date();
					// console.log('timeNow:',timeNow)
					let minute = 1000 * 60;
					let hour = minute * 60;
					let day = hour * 24;
					let month = day * 30;
					let year = month * 12;
					let diffValue = timeNow - timePublish;
					// console.log('diffValue:',diffValue)
					let diffMonth = diffValue / month;
					let diffWeek = diffValue / (7 * day);
					let diffDay = diffValue / day;
					let diffHour = diffValue / hour;
					let diffMinute = diffValue / minute;
					let diffYear = diffValue / year;
					if (diffValue < minute) {
						result = "刚刚";
					} else if (diffYear > 1) {
						result = parseInt(diffYear) + "年前";
					} else if (diffMonth > 1) {
						result = parseInt(diffMonth) + "月前";
					} else if (diffWeek > 1) {
						result = parseInt(diffWeek) + "周前";
					} else if (diffDay > 1) {
						result = parseInt(diffDay) + "天前";
					} else if (diffHour > 1) {
						result = parseInt(diffHour) + "小时前";
					} else if (diffMinute > 1) {
						result = parseInt(diffMinute) + "分钟前";
					} else {
						result = "刚刚";
					}
					return result;
				})

const app = new Vue({
	store,
	...App
})
app.$mount()