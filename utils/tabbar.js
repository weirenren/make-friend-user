export default {
	list: [
		{
			"pagePath": "/pages/user/love/recommend",
			"iconPath": "/static/tabbar/recommend.png",
			"selectedIconPath": "/static/tabbar/recommend_selected.png",
			"text": "推荐"
		},
		{
			"pagePath": "/pages/index/index",
			"iconPath": "/static/tabbar/home-1.png",
			"selectedIconPath": "/static/tabbar/home.png",
			"text": "广场"
		},
		// {
		// 	"pagePath": "/pages/more/more",
		// 	"iconPath": "/static/tabbar/quanzi-1.png",
		// 	"selectedIconPath": "/static/tabbar/quanzi.png",
		// 	"text": "圈子"
		// },
		{
			iconPath: '/static/tabbar/add.png',
			selectedIconPath: '/static/tabbar/add.png',
			midButton: true,
			isCustom: true
		},
		{
			"pagePath": "/pages/message/message",
			"iconPath": "/static/tabbar/msg-1.png",
			"selectedIconPath": "/static/tabbar/msg.png",
			"text": "消息"
		},
		{
			"pagePath": "/pages/my/my",
			"iconPath": "/static/tabbar/my-1.png",
			"selectedIconPath": "/static/tabbar/my.png",
			"text": "我的"
		}
	],
	popup: [{
			icon: '/static/h_2.png',
			text: '动态',
			url: '/pages/post/add?type=1'
		},
		// {
		// 	icon: '/static/h_3.png',
		// 	text: '视频',
		// 	url: '/pages/post/add?type=2'
		// }
		// ,
		{
			icon: '/static/love.png',
			text: '交友',
			url: '/pages/post/love-add'
		},
		{
			icon: '/static/h_1.png',
			text: '投票',
			url: '/pages/vote/vote'
		},
		{
			icon: '/static/h_3.png',
			text: '活动',
			url: '/pages/user/love/love-activity-add'
		}
	]
}
