<template>
	<view class="container">
		<view class="head">
			<view>💗</view>
			<view>我的交友名片码：{{personLoveId}}</view>
			<!-- <view v-if="show_wechat">TA的微信是：{{wechat}}，可以加微信交流啦</view> -->
		</view>


		<view class="body">

			<text>输入对方的交友名片码：</text>
			<input placeholder="请输入6位数字" placeholder-class="placeholder" v-model="taPersonCode"></input>

		</view>
		<view class="bottom">
			<q-button @click="OK()">确认查询</q-button>
		</view>

		<view class="bottom">
			<text>对方名片码：{{taPersonCode}}</text>
			<q-button @click="OK()">确认查询</q-button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				personLoveId: '',
				taPersonCode: '',
				personalActiveStatus: 0,
				triggerGender: 0,
				persionOpBtnContent: ''
			}
		},
		onLoad: function(opt) {
			this.loadPersonalCode()
		},
		methods: {
			loadPersonalCode() {
				this.$H.post('love/cp/personCode').then(res => {

					if (res.result) {
						this.personLoveId = res.result
					}

					// this.loadStepStatus()
					console.log("res:" + JSON.stringify(res))
				});
			},
			jumpTopic(id) {
				uni.navigateTo({
					url: '/pages/post/detail?id=' + id
				});
			},
			refreshMatchOperateStatus(personalMatchStatus) {
				if (this.personalActiveStatus == 0) {
					this.persionOpBtnContent = "向对方申请，查看对方交友帖子"
				} else if (this.personalActiveStatus == 1) {
					
					const userInfo = uni.getStorageSync("userInfo")
					// console.log("user:" + JSON.stringify(userInfo))
					const male = userInfo.gender == 0
					if (userInfo.gender == this.triggerGender) {
						this.persionOpBtnContent = "对待对方同意中"
					} else {
						this.persionOpBtnContent = "对方已经向你发起查看交友帖子申请，接受才能查看对方交友帖子"
					}
					
				} else if (this.personalActiveStatus == 2) {
					this.persionOpBtnContent = "点击查看对方交友帖子"
				}
			},
			// todo 实现不同状态下 按钮功能
			OK() {
				const loveCode = this.taPersonCode.trim()
				if (loveCode.length != 6) {

					uni.showToast({
						title: "请输入正确的交友名片码，六位数字",
						icon: "none",
						duration: 3000
					});
					return
				}

				this.showNotFound = false
				console.log("OK click")
				this.$H.post('love/cp/findPersonalMatch', {
					personCode: this.taPersonCode
				}).then(res => {
				
					// if (callback) {
					// 	callback({
					// 		wechat: "306917331",
					// 		stepIndex: 0
					// 	})
					// }
				
					// this.loadStepStatus()
					console.log("res:" + JSON.stringify(res))
					if (res.code == 0) {
						// this.jumpTopic(res.result[0])
						// todo 申请状态：0：需向对方提交申请；1: 等待对方同意；2: 对方已经同意；
						// 添加一个字段 表示谁先发出申请
						
						if (res.result) {
							this.personalActiveStatus = res.result.activeStatus
							this.triggerGender = res.result.genderTrigger
						} else {
							
						}
					
						
					} else {
						console.log("not found")
						this.showNotFoundView()
					}
				});
				// this.$H.post('love/cp/pPostId', {
				// 	personCode: this.taPersonCode
				// }).then(res => {

				// 	// if (callback) {
				// 	// 	callback({
				// 	// 		wechat: "306917331",
				// 	// 		stepIndex: 0
				// 	// 	})
				// 	// }

				// 	// this.loadStepStatus()
				// 	console.log("res:" + JSON.stringify(res))
				// 	if (res.code == 0 && res.result && res.result.length > 0) {
				// 		// this.jumpTopic(res.result[0])
				// 		// todo 申请状态：0：需向对方提交申请；1: 等待对方同意；2: 对方已经同意；
				// 		// 添加一个字段 表示谁先发出申请
						
				// 	} else {
				// 		console.log("not found")
				// 		this.showNotFoundView()
				// 	}
				// });
			},
			showNotFoundView() {

				uni.showToast({
					title: "没找到该用户的交友帖子",
					icon: "none",
					duration: 3000
				});
				// this.$refs.uNotify.show({
				// 		type: 'error',
				// 		icon: false,
				// 		message: "没找到该用户的交友帖子"
				//        })
			}
		}
	}
</script>

<style>
	page {
		background-color: #fefcff;
		height: 100%;
	}
</style>
<style lang="scss" scoped>
	.container {
		background-color: #f5f5f5;
		height: 100%;
		display: flex;
		flex-direction: column;

		.head {
			margin: 10rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.body {
			display: flex;
			justify-content: center;
			margin: 30rpx 0;
			// flex-direction: column;
		}

		.bottom {
			display: flex;
			justify-content: center;
		}
	}
</style>
