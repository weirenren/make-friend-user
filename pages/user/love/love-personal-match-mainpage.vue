<template>
	<view class="container">
		<view class="head">
			<!-- <view>💗</view> -->
			<view class="personal-code-label">我的交友名片码</view>
			<view class="personal-code-value">{{personLoveId}}</view>
			<!-- <view v-if="show_wechat">TA的微信是：{{wechat}}，可以加微信交流啦</view> -->
		</view>


		<view class="body">
			<view class="input-background">
				<!-- <text>输入对方的交友名片码：</text> -->
				<input placeholder="输入对方的交友名片码" class="placeholder" v-model="taPersonCode"></input>
				<q-button class="mini"  shape="circle" @click="OK()">确认</q-button>
			</view>
			
			<view v-if="showQueryResultCompoment" class="query-result-backgrond">
				<text class="personal-code">名片码：{{taPersonCode}}</text>
				<!-- <q-button  @click="persionOpBtn()">{{persionOpBtnContent}}</q-button> -->
				<u-button :class="shouldWaitTa ? 'opt-btn-gray': 'opt-btn'" @click="persionOpBtn()">{{persionOpBtnContent}}</u-button>
			</view>
		</view>

				<u-popup v-model="showShouldCreatePostTipPop"  width="500rpx" height="100px" mode="center" border-radius="10">
					<view class="popup-content" >
						<view style="display: flex; justify-content: center; align-items: center;">您需要提交自己的交友帖子</view>
						<view style="display: flex; justify-content: center; align-items: center;">才能和对方一起发起个人匹配交友游戏</view>
						<u-button class="button-layout" @click="openCreatePostPage(item, index)">确定</u-button>
					</view>
					
				</u-popup>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				personLoveId: '',
				taPersonCode: '',
				taPersonPostId: '',
				taUserId: -1,
				personalActiveStatus: -1,
				triggerGender: 0,
				persionOpBtnContent: '',
				showQueryResultCompoment: false,
				shouldWaitTa: false,
				showShouldCreatePostTipPop: false,
				// optbtn: {
				// 	marginTop: '20px', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
				//     color: 'red',
				// 	marginLeft: auto!,
				// 	marginRight: auto!
				// }
			}
		},
		onLoad: function(opt) {
			this.checkIfHaveLovePost()
			this.loadPersonalCode()
			// this.loadWaitingMatch()
		},
		methods: {
			checkIfHaveLovePost() {
				this.$H.post('love/cp/personHasPost').then(res => {
					if (res.code != 0) {
						this.showShouldCreatePostTipPop = true
					}
				})
			},
			openCreatePostPage() {
				uni.navigateTo({
					url: '/pages/post/love-add'
				});
			},
			loadPersonalCode() {
				this.$H.post('love/cp/personCode').then(res => {
					
					if (res.result) {
						this.personLoveId = res.result
					}

					// this.loadStepStatus()
					console.log("personCode res:" + JSON.stringify(res))
				});
			},
			// loadWaitingMatch() {
			// 	this.$H.post('love/cp/findWaitingMatch').then(res => {

			// 		if (res.result) {
			// 			// this.personLoveId = res.result
			// 		}

			// 		// this.loadStepStatus()
			// 		console.log("findWaitingMatch res:" + JSON.stringify(res))
			// 	});
			// },
			jumpTopic(id) {
				uni.navigateTo({
					url: '/pages/post/detail?id=' + id
				});
			},
			refreshMatchOperateStatus() {
				if (this.personalActiveStatus == 0) {
					this.persionOpBtnContent = "向对方申请，查看对方交友帖子"
					this.shouldWaitTa = false

				} else if (this.personalActiveStatus == 1) {
					const userInfo = uni.getStorageSync("userInfo")
					if (userInfo.gender == this.triggerGender) {
						this.persionOpBtnContent = "等待对方同意中"
						this.shouldWaitTa = true
					} else {
						this.shouldWaitTa = false
						this.persionOpBtnContent = "来自对方交友申请，接受能查看对方交友帖子"
					}

				} else if (this.personalActiveStatus == 2) {
					this.shouldWaitTa = false
					this.persionOpBtnContent = "点击查看对方交友帖子"
				} else {
					console.log("refreshMatchOperateStatus else")
				}
			},
			persionOpBtn() {
				if (this.personalActiveStatus == 0) {
					this.$H.post('love/cp/addPersonalMatch', {
						personCode: this.taPersonCode
					}).then(res => {
						this.operateResponse(res)
					});

				} else if (this.personalActiveStatus == 1) {

					const userInfo = uni.getStorageSync("userInfo")
					if (userInfo.gender == this.triggerGender) {

						console.log("do nothing:" + userInfo.gender)
						// do nothing
					} else {

						this.$H.post('love/cp/updatePersonalMatch', {
							personCode: this.taPersonCode
						}).then(res => {
							this.operateResponse(res)
						});
					}

				} else if (this.personalActiveStatus == 2) {

					this.openMatch()
					// this.jumpTopic(this.taPersonPostId)
					// if (matchUserList.length > 0) {
					// 	//
					// 	uni.navigateTo({
					// 		url: '/pages/user/love/love-activity-match?match_users=' + encodeURIComponent(JSON
					// 			.stringify(matchUserList))
					// 	});
					// }
				}


			},
			operateResponse(res) {
				console.log("operateResponse findPersonalMatch res:" + JSON.stringify(res))
				if (res.code == 0) {
					// this.jumpTopic(res.result[0])
					// todo 申请状态：0：需向对方提交申请；1: 等待对方同意；2: 对方已经同意；
					// 添加一个字段 表示谁先发出申请

					if (res.result) {

						this.personalActiveStatus = res.result.activeStatus
						this.triggerGender = res.result.genderTrigger
						this.taPersonPostId = res.result.lovePostId

						const userInfo = uni.getStorageSync("userInfo")
						const maleId = res.result.maleId
						const femaleId = res.result.femaleId

						this.taUserId = userInfo.gender == 1 ? maleId : femaleId

					} else {

					}

					uni.showToast({
						title: "请求成功",
						icon: "none",
						duration: 3000
					});

					this.refreshMatchOperateStatus()
				} else {
					console.log("not found")
					this.showNotFoundView("not found")
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
				this.showQueryResultCompoment = false
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
					console.log("OK findPersonalMatch res:" + JSON.stringify(res))
					if (res.code == 0) {
						// this.jumpTopic(res.result[0])
						// todo 申请状态：0：需向对方提交申请；1: 等待对方同意；2: 对方已经同意；
						// 添加一个字段 表示谁先发出申请

						if (res.result) {

							if (res.result.type == 0) {
								this.personalActiveStatus = res.result.activeStatus
								this.triggerGender = res.result.genderTrigger
								this.taPersonPostId = res.result.lovePostId

								const userInfo = uni.getStorageSync("userInfo")
								const maleId = res.result.maleId
								const femaleId = res.result.femaleId

								
					
								this.taUserId = userInfo.gender == 1 ? maleId : femaleId
								if (this.taUserId == userInfo.uid) {
									console.error("uid same:" + this.taUserId + ", usr:" + JSON.stringify(userInfo))
								}
								this.showQueryResultCompoment = true
								
							} else if (res.result.type == 1) {

								this.showNotFoundView("对方还没有发交友帖子")
							} else if (res.result.type == 2) {
								this.showQueryResultCompoment = true
								
								this.personalActiveStatus = 0 // ToDo 后端传过来更好，暂时前端设置
								this.showNotFoundView("还没有发起个人匹配申请")
							} else {
								this.showNotFoundView("该用户不存在")
							}

						} else {

						}

						this.refreshMatchOperateStatus()
					} else {

						this.showNotFoundView(res.message)
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
			showNotFoundView(message) {

				uni.showToast({
					title: message,
					icon: "none",
					duration: 3000
				});
				// this.$refs.uNotify.show({
				// 		type: 'error',
				// 		icon: false,
				// 		message: "没找到该用户的交友帖子"
				//        })
			},
			openMatch() {
				const matchUserList = [{
					uid: this.taUserId,
					lovePostId: this.taPersonPostId
				}]

				// 构造 uid, lovePostId 数组即可。当然当前数量为1
				uni.navigateTo({
					url: '/pages/user/love/love-personal-match?match_users=' + encodeURIComponent(JSON
						.stringify(matchUserList))
				});
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
			margin-top: 80rpx;
			
			.personal-code-label {
				font-size: 30rpx;
			}
			
			.personal-code-value {
				font-size: 60rpx;
				font-weight: bold;
				margin: 10rpx 0;
			}
		}

		.body {
			display: flex;
			flex-direction: column;
			// justify-content: center;
			margin: 30rpx 0;
			
			.input-background {
				
				display: flex;
				background-color: white;
				justify-content: space-between;
				padding: 3rpx 6rpx 6rpx 30rpx;
				align-items: center;
				border-radius: 60rpx;
				
				.placeholder {
					font-size: 32rpx;
					width: 100%;
				}
				
				.mini {
					width: 250rpx;
					height: 110rpx;
					font-size: 25rpx;
				}
			}
		}

		.bottom {
			display: flex;
			justify-content: center;
		}

		.query-result-backgrond {
			display: flex;
			justify-content: space-between;
			background-color: white;
			align-items: center;
			padding: 25rpx;
			margin-top: 100rpx;
			border-radius: 30rpx;
			
			.personal-code {
				background-color: #9999FF;
				border-radius: 10rpx;
				padding: 20rpx;
			}
			
			.opt-btn {
	
				height: 70rpx;
				font-size: 25rpx;
				background-color: #CCCCFF;
				margin-left: 0 !important;
				margin-right: 0 !important; 
			}
			.opt-btn-gray {
				
				height: 70rpx;
				font-size: 25rpx;
				background-color: lightgray;
				margin-left: 0 !important;
				margin-right: 0 !important; 
			}
			
			.popup-content {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin: 20rpx;
				padding: 30rpx;
				
			}
		
		}
	}
	
	
</style>