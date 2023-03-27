
export default {
	
	createActivity(act_title, act_datetime, act_time_duration, act_location, act_content) {
		return {
			act_title,
			act_datetime,
			act_time_duration,
			act_location,
			act_content,
		}
	},
	
	// 交友业务下的普通帖子数据结构
	createCommonPost(city = 'beijing', gender = 0, title, content) { 
		return {
			post_type: 11, // 自定义
			city, // 最初是北京： beijing
			gender,
			title,
			content,
		}
	},
	
	getExactContentFromPost(postContent) {
		// console.log('exact:' + postContent)
		try{
			return JSON.parse(postContent).content
		}catch(e) {
			return postContent
		}
	},
	getExactGenderTypeFromPost(postContent) {
		// console.log('exact:' + postContent)
		try{
			return JSON.parse(postContent).gender
		}catch(e) {
			return postContent
		}
	},
	
	getExactGenderFromPost(postContent) {
		// console.log('exact:' + postContent)
		try{
			return JSON.parse(postContent).gender == 0 ? "男" : "女"
		}catch(e) {
			return ""
		}
	},
	
	LikeType_DISLIKE: 1,
	LikeType_NORMAL: 2,
	LikeType_LIKE: 3,
}
