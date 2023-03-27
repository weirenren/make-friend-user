// 转换时间方法
function changeTime(data) { //data是接受的item.time
	if (typeof data === 'string') {
		data = new Date(data.replace(/-/g, '/')).getTime()
	} else {
		if (time.toString().length === 10) {
			data = new Date(time * 1000).getTime()
		} else {
			data = new Date(time).getTime()
		}
	}
	//将字符串转换成时间格式
	let result;
	let timePublish = new Date(data);
	let timeNow = new Date();
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
		// let d = new Date(data).setHours(0, 0, 0, 0);
		// let today = new Date().setHours(0, 0, 0, 0);
		// let obj = {
		// 	'-86400000': '1天前',
		// 	0: '今天',
		// };
		// result = obj[d - today];
	} else if (diffMinute > 1) {
		result = parseInt(diffMinute) + "分钟前";
	} else {
		result = "刚刚";
	}
	return result;
}

/* * 
 用途：js中字符串超长作固定长度加省略号（...）处理
 参数说明：
    str:需要进行处理的字符串，可含汉字
    len:需要显示多少个汉字，两个英文字母相当于一个汉字
 */
function stringSub(str, len) {
    var reg = /[\u4e00-\u9fa5]/g,slice = str.substring(0, len),
        cCharNum = (~~(slice.match(reg) && slice.match(reg).length)),
        realen = slice.length*2 - cCharNum-1;
    return str.substr(0, realen) + (realen < str.length ? "..." : "");
}

module.exports = {
	changeTime: changeTime,
	stringSub: stringSub,
}
