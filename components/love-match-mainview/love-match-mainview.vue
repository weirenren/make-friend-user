<template>
	<view class="container">

		<view v-if="refreshCompoment">
			<view v-if="styleType == 0">
				<love-userpost-info :is_recommend="true" :media="media" :post_title="currentShowTitle"
					:post_content="currentShowContent"></love-userpost-info>
			</view>
			<view v-else="styleType == 1">
				<love-user-preview></love-user-preview>
			</view>
		</view>

		<love-match-button v-if="showMatchBtn" :like="likeCallback" :normalLike="normallikeCallback"
			:unlike="unlikeCallback">
		</love-match-button>

		<!-- 	<view class="section">
			<u-button class="dec-item">将它推荐给好友</u-button>
			<u-button class="dec-item">举报</u-button>
		</view> -->

	</view>
</template>


<script>
	import loveUserPostInfo from '../love-userpost-info/love-userpost-info.vue'
	import loveUserPreview from '../love-user-preview/love-user-preview.vue'
	import loveUserMatchButton from '../love-match-button/love-match-button.vue'
	import loveJsonRequestor from '../../utils/love-json-requestor.js'
	export default {
		name: "love-match-mainview",
		data() {
			return {
				// TODO： 交友帖子 仅保留一种格式：formal
				styleType: 0, // 0: post; 1: foremal
				currentShowTitle: '',
				currentShowContent: '',
				media: [],
				nextMatchIndex: 0,

				loveMatchList: [],
				refreshCompoment: true,
			}
		},
		props: {
			unlike: {
				type: Function
			},
			like: {
				type: Function
			},
			normalLike: {
				type: Function
			},
			loadLoveMatchList: {
				type: Array,
				required: true
			},
			showMatchBtn: {
				type: Boolean,
				default: true
			}
		},
		created() {
			// this.loadLoveMatch()
			this.loveMatchList = this.loadLoveMatchList

			// [{"id":17,"uid":114,"lovePostId":166,"gender":0,"postId":187,"createTime":"2023-01-01 22:32:03","applyStatus":1},
			// {"id":25,"uid":148,"lovePostId":191,"gender":1,"postId":187,"createTime":"2023-02-08 22:16:11","applyStatus":1}]
			console.log('loveMatchList match:' + JSON.stringify(this.loveMatchList))
			this.nextLoveMatch()
		},
		methods: {
			doRefreshCompoment() {
				this.refreshCompoment = false
				setImmediate(() => {
					this.refreshCompoment = true
				})
			},
			unlikeCallback() {
				console.log("unlikeCallback")
				if (!this.checkContinueMatch()) {
					return
				}

				this.submitLoveMatchResult(loveJsonRequestor.LikeType_DISLIKE, this.loveMatchList[this.nextMatchIndex - 1])
				this.nextLoveMatch()
				this.doRefreshCompoment()

				if (this.unlike) {
					this.unlike()
				}
			},
			likeCallback() {
				console.log("likeCallback")
				if (!this.checkContinueMatch()) {
					return
				}

				this.submitLoveMatchResult(loveJsonRequestor.LikeType_LIKE, this.loveMatchList[this.nextMatchIndex - 1])
				this.nextLoveMatch()
				this.doRefreshCompoment()

				if (this.like) {
					this.like()
				}
			},
			normallikeCallback() {
				console.log("normallikeCallback: " + this.nextMatchIndex)
				if (!this.checkContinueMatch()) {
					return
				}

				this.submitLoveMatchResult(loveJsonRequestor.LikeType_NORMAL, this.loveMatchList[this.nextMatchIndex - 1])
				this.nextLoveMatch()
				this.doRefreshCompoment()

				if (this.normalLike) {
					this.normalLike()
				}
			},
			submitLoveMatchResult(likeType, post) {
				const value = loveJsonRequestor.LikeType_DISLIKE
				// console.log('json:' + JSON.stringify(post))
				this.$H
					.post('love/addMatch', {
						fromUid: -1,
						postType: 1,
						likeType: likeType,
						toUid: post.uid,
						comments: '',
						postId: post.id
					})
					.then(res => {
						// 	if (res.code == 500) {
						// 		this.$u.toast(res.msg);
						// 		setTimeout(function() {
						// 			uni.switchTab({
						// 				url: '/pages/index/index'
						// 			});
						// 		}, 1500);
						// 	}

					});
			},
			checkContinueMatch() {
				return (this.nextMatchIndex <= this.loveMatchList.length) && this.loveMatchList.length > 0
			},
			// loadLoveMatch() {
			// 	this.$H
			// 		.post('love/findMatch', {
			// 			fromUid: -1
			// 		})
			// 		.then(res => {
			// 			if (res.code == 500) {
			// 				this.$u.toast(res.msg);
			// 				setTimeout(function() {
			// 					uni.switchTab({
			// 						url: '/pages/index/index'
			// 					});
			// 				}, 1500);
			// 			}

			// 			if (res.result && res.result.length > 0) {
			// 				this.loveMatchList = res.result

			// 				this.nextLoveMatch()
			// 			}

			// 		});
			// },

			nextLoveMatch() {
				if (this.nextMatchIndex < this.loveMatchList.length) {

					const current_user = this.loveMatchList[this.nextMatchIndex]
					
					console.log("cuser:" + JSON.stringify(current_user))
					const lovePostId = current_user.lovePostId


					this.$H
						.get('post/detail', {
							id: lovePostId
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

							if (res.result && res.code == 0) {
								// this.loveMatchList = res.result
								
								console.log("res:" + JSON.stringify(res))

								this.currentShowContent = loveJsonRequestor.getExactContentFromPost(res.result.content)
								this.currentShowTitle = res.result.title
								this.media = res.result.media
								// this.nextLoveMatch()
							}

						});

			
				}

				this.nextMatchIndex++
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: white;
		border-radius: 20rpx;

		.section {
			margin: 15rpx;
			padding: 15rpx;

			color: #606266;
			border-color: #c0c4cc;
			background-color: #ffffff;
		}
	}
</style>
