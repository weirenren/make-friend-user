<template>
	<view class="container">

		<view v-if="refreshCompoment">
			<view v-if="styleType == 0">
				<love-userpost-info :post_title="currentShowTitle" :post_content="currentShowContent"></love-userpost-info>
			</view>
			<view v-else="styleType == 1">
				<love-user-preview></love-user-preview>
			</view>
		</view>

		<love-match-button :like="likeCallback" :normalLike="normallikeCallback" :unlike="unlikeCallback">
		</love-match-button>

		<view class="section">
			<u-button class="dec-item">将它推荐给好友</u-button>
			<u-button class="dec-item">举报</u-button>
		</view>

	</view>
</template>


<script>
	import loveUserPostInfo from '../../../components/love-userpost-info/love-userpost-info.vue'
	import loveUserPreview from '../../../components/love-user-preview/love-user-preview.vue'
	import loveUserMatchButton from '../../../components/love-match-button/love-match-button.vue'
	import loveJsonRequestor from '../../../utils/love-json-requestor.js'
	export default {
		data() {
			return {
				// TODO： 交友帖子 仅保留一种格式：formal
				styleType: 0, // 0: post; 1: foremal
				currentShowTitle: '',
				currentShowContent: '',
				currentPhotos: [],
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
			}
		},
		created() {
			this.loadLoveMatch()
		},
		methods: {
			doRefreshCompoment(){
				this.refreshCompoment = false
				setImmediate(()=> {
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
			},
			likeCallback() {
				console.log("likeCallback")
				if (!this.checkContinueMatch()) {
					return
				}
				
				this.submitLoveMatchResult(loveJsonRequestor.LikeType_LIKE, this.loveMatchList[this.nextMatchIndex - 1])
				this.nextLoveMatch()
				this.doRefreshCompoment()
			},
			normallikeCallback() {
				console.log("normallikeCallback: " + this.nextMatchIndex)
				if (!this.checkContinueMatch()) {
					return
				}
				
				this.submitLoveMatchResult(loveJsonRequestor.LikeType_NORMAL, this.loveMatchList[this.nextMatchIndex - 1])
				this.nextLoveMatch()
				this.doRefreshCompoment()
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
					
						if (res.result && res.result.length > 0) {
							this.loveMatchList = res.result
							
							this.nextLoveMatch()
						}
				
					});
			},
			checkContinueMatch() {
				return (this.nextMatchIndex <= this.loveMatchList.length) && this.loveMatchList.length > 0
			},
			loadLoveMatch() {
				this.$H
					.post('love/findMatch', {
						fromUid: -1
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
					
						if (res.result && res.result.length > 0) {
							this.loveMatchList = res.result
		
							this.nextLoveMatch()
						}

					});
			},
			
			nextLoveMatch() {
				if (this.nextMatchIndex < this.loveMatchList.length) {
			
					this.currentShowContent = loveJsonRequestor.getExactContentFromPost(this.loveMatchList[this.nextMatchIndex].content)
					this.currentShowTitle = this.loveMatchList[this.nextMatchIndex].title
					
				} 
				
				this.nextMatchIndex++
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: gainsboro;

		.section {
			background-color: white;
			border-radius: 20rpx;
			margin: 15rpx;
			padding: 15rpx;
		}
	}
</style>
