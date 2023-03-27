<template>
	<view class="page">
		<view class="card-head">
			<view class="title">
				<text>{{act_object.act_title}}</text>
			</view>

			<view class="description">
				<text>
					晋太元中，武陵人捕鱼为业。缘溪行，忘路之远近。忽逢桃花林，夹岸数百步，中无杂树，芳草鲜美，落英缤纷。
				</text>
			</view>

			<view class="progress">
				<view class="act-user-nums">
					<view>已参加：</view>
					<view>{{ applyUserList.length }}</view>
				</view>

				<view class="act-status">进行中</view>
			</view>

			<block v-if="canApplyActivity">
				<q-button @click="clickApplyActivity()" class="act-submit">我要报名</q-button>
			</block>
			<block v-else>
				<q-button @click="cancelActivity()" class="act-submit">取消报名</q-button>
			</block>
			<q-button @click="openMatch()" class="act-submit">匹配</q-button>
		</view>
		<view class="card-body">
			<view class="card-item">
				<view class="step-bar">
					<view class="label"></view>
					<view class="text">活动时间及地点</view>
				</view>
				<view class="content">
					<view class="address">
						线上
					</view>
					<view class="date">
						{{act_object.act_datetime}}
					</view>
				</view>
			</view>


			<view class="card-item">
				<view class="step-bar">
					<view class="label"></view>
					<view class="text">活动形式与流程</view>
				</view>

				<view class="content">
					<text>
						{{act_object.act_content}}
					</text>
				</view>
			</view>

			<view class="card-item">
				<view class="step-bar">
					<view class="label"></view>
					<view class="text">已报名嘉宾</view>
				</view>

				<view class="content-userlist">

					<u-cell-group v-for="user in applyUserList" :key="user.id">
						<u-cell-item @click="openUserLovePost(user)" icon="setting-fill" :title="user.id"></u-cell-item>
						<text>{{ user.gender }}</text>
					</u-cell-group>
				</view>

			</view>
			<view>
				<u-toast ref="uToast" />
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				act_object: {},
				postId: -1,
				applyUserList: [],
				currentUid: '',
				currentGender: 0,
				canApplyActivity: true,
				hasLovePost: false
			}
		},
		onLoad(options) {

			this.currentUid = uni.getStorageSync("userInfo").uid
			this.currentGender = uni.getStorageSync("userInfo").gender

			console.log("userInfo:" + JSON.stringify(uni.getStorageSync("userInfo")))
			console.log("postId:" + options.id)
			this.postId = options.id
			this.requestActivityData(options.id)
			this.queryActivityUsers()

			this.checkIfCreatLovePost((exist) => {
				if (exist == true) {
					uni.setStorageSync("hasLovePost", true)
					this.hasLovePost = true
				} else {
					uni.setStorageSync("hasLovePost", false)
					this.hasLovePost = false
				}
			})
		},
		methods: {
			showLovePostRequestToast() {
				this.$refs.uToast.show({
					title: '请先发一个交友帖子',
					type: 'warning',
					duration: 2000,
					url: '/pages/post/love-add'
				})
			},
			jumpEditLovePostPage() {
				uni.navigateTo({
					url: '/pages/post/love-add'
				});
			},
			openMatch() {
				const matchUserList = this.getMatchUsers()
				// console.log('match:' + JSON.stringify(matchUserList))
				if (matchUserList.length > 0) {
					//
					uni.navigateTo({
						url: '/pages/user/love/love-activity-match?match_users=' + encodeURIComponent(JSON
							.stringify(matchUserList))
					});
				}
			},
			getMatchUsers() {
				var matchUsers = []
				this.applyUserList.forEach((item) => {

					// if (item.gender != this.currentGender) {
					matchUsers.push(item)
					// }
				})

				return matchUsers
			},
			openUserLovePost(user) {
				if (this.hasLovePost == true) {
					uni.navigateTo({
						url: '/pages/post/detail?id=' + user.lovePostId
					});
				} else {
					
					this.showLovePostRequestToast()
					// this.jumpEditLovePostPage()
				}

			},
			requestActivityData(postId) {
				this.$H
					.get('post/detail', {
						id: postId
					})
					.then(res => {
						if (res.code == 500) {
							this.$u.toast(res.msg);
							setTimeout(function() {
								uni.switchTab({
									url: '/pages/index/index'
								});
							}, 1500);
						}

						if (res) {

							console.log("detal:" + JSON.stringify(res.result.content))

							this.act_object = JSON.parse(res.result.content)
							// var exist = res.result
							// if (exist == true) {
							// 	this.loadLoveMatch()
							// 	this.hasLovePost = true
							// } else {
							// 	this.showMatchPopWindow = true
							// }

						}
					});

			},
			refreshApplyStatus() {
				var canApply = true
				if (this.applyUserList.length > 0) {
					this.applyUserList.forEach(value => {
						if (this.currentUid == value.uid) {

							canApply = false
						}
					})
				}

				this.canApplyActivity = canApply
			},
			queryActivityUsers() {
				if (this.postId < 0) return
				console.log("postId:" + this.postId)

				this.$H
					.post('love/activity/users', {
						postId: this.postId
					})
					.then(res => {
						if (res.code == 500) {
							this.$u.toast(res.msg);
							setTimeout(function() {
								uni.switchTab({
									url: '/pages/index/index'
								});
							}, 1500);
						}

						if (res && res.result.length > 0) {

							console.log("users:" + JSON.stringify(res.result))
							this.applyUserList = res.result

							this.refreshApplyStatus()
							// this.act_object = JSON.parse(res.result.content)
							// var exist = res.result
							// if (exist == true) {
							// 	this.loadLoveMatch()
							// 	this.hasLovePost = true
							// } else {
							// 	this.showMatchPopWindow = true
							// }

						}
					});

			},
			cancelActivity() {
				if (this.postId < 0) return
				console.log("postId:" + this.postId)

				this.$H
					.post('love/activity/cancel', {
						postId: this.postId
					})
					.then(res => {
						if (res.code == 500) {
							this.$u.toast(res.msg);
							setTimeout(function() {
								uni.switchTab({
									url: '/pages/index/index'
								});
							}, 1500);
						}

						if (res) {
							this.applyUserList = res.result
							this.refreshApplyStatus()
							// var exist = res.result
							// if (exist == true) {
							// 	this.loadLoveMatch()
							// 	this.hasLovePost = true
							// } else {
							// 	this.showMatchPopWindow = true
							// }

						}
					});

			},
			checkIfCreatLovePost(callback) {
				this.$H
					.post('love/checkLovePost', {

					})
					.then(res => {
						if (res.code == 500) {
							this.$u.toast(res.msg);
							setTimeout(function() {
								uni.switchTab({
									url: '/pages/index/index'
								});
							}, 1500);
						}

						if (res) {
							callback(res.result)
						}
					})
			},
			clickApplyActivity() {
				if (this.hasLovePost == true) {
					this.applyActivity()
				} else {
					// this.jumpEditLovePostPage()
					this.showLovePostRequestToast()
				}
			},
			applyActivity() {
				if (this.postId < 0) return
				console.log("postId:" + this.postId)

				this.$H
					.post('love/activity/apply', {
						postId: this.postId
					})
					.then(res => {
						if (res.code == 500) {
							this.$u.toast(res.msg);
							setTimeout(function() {
								uni.switchTab({
									url: '/pages/index/index'
								});
							}, 1500);
						}

						if (res) {

							this.applyUserList = res.result
							this.refreshApplyStatus()
							// this.act_object = JSON.parse(res.result.content)
							// var exist = res.result
							// if (exist == true) {
							// 	this.loadLoveMatch()
							// 	this.hasLovePost = true
							// } else {
							// 	this.showMatchPopWindow = true
							// }

						}
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
<style lang="scss">
	.page {
		background-color: #F6F8FC;
		height: 100%;
	}

	.card-head {
		background-color: #e5e8ef;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;

		.title {
			color: #313131;
			font-size: 36rpx;
			font-weight: 400;
			text-align: center;
			padding: 10rpx;
		}

		.description {
			padding: 20rpx;
		}

		.progress {
			display: flex;
			padding: 20rpx;
			justify-content: space-between;

			.act-user-nums {
				display: flex;
			}
		}

		.act-submit {
			display: flex;
			padding: 20rpx;
			justify-content: flex-end;
		}


	}

	.card-body {
		padding: 20rpx;

		.card-item {
			margin: 10rpx;

			.step-bar {
				display: flex;
				margin: 5rpx 0;

				.label {
					border-radius: 10rpx;
					width: 13rpx;

					background-color: #A6AEF5;
					margin-right: 20rpx;

				}

				.text {
					font-size: 32rpx;
					font-weight: 600;
				}
			}

			.content {
				margin: 20rpx 30rpx 20rpx;
			}

			.content-userlist {

				.user-item {
					display: flex;
					padding: 10rpx;

					.avator {}

					.gender {
						margin: 0 15rpx;
					}

					.user-info {
						margin-left: 20rpx;
					}

				}

				// flex-wrap: wrap;
			}
		}


	}
</style>
