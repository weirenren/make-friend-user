<template>
	<view>
		<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
		<view class="base_line_light"></view>
		<view v-if="current == 0">
			<block v-if="showMatchMainView" v-for="(item, index) in likeResult" :key="item.id">
				<view @tap="jumpTopic(item.id)">
					<love-userpost-info :is_show_detail="false" :media="JSON.parse(item.media)" :post_title="item.title"
						:post_content="getPostContent(item.content)">
					</love-userpost-info>
				</view>
				<u-button @click="showCancelActionPop = true;">取消喜欢</u-button>
				<u-popup  class="popup-content" v-model="showCancelActionPop" mode="center" border-radius="10"  :closeable="true">
					<u-button class="button-layout" @click="submitCancelMatchResult(item, index)">确定?</u-button>
				</u-popup>
				<view class="base_line_light"></view>
			</block>
			<view v-if="likeResult.length == 0">
				<u-empty text="无" mode="list"></u-empty>
			</view>
		</view>

		<view v-if="current == 1">
			<block v-for="(item, index) in beLikeResult" :key="item.id">
				<view @tap="jumpTopic(item.id)">
					<love-userpost-info :is_show_detail="false" :media="JSON.parse(item.media)" :post_title="item.title"
						:post_content="getPostContent(item.content)">
					</love-userpost-info>
				</view>
			</block>
			<view v-if="beLikeResult.length == 0">
				<u-empty text="无" mode="list"></u-empty>
			</view>
			<!-- <u-loadmore :status="status" /> -->
		</view>
	</view>
</template>

<script>
	import loveJsonRequestor from '../../../utils/love-json-requestor.js'

	export default {
		data() {
			return {
				list: [{
					name: '我喜欢的'
				}, {
					name: '喜欢我的',
				}],
				current: 0,
				likeResult: [], // 我喜欢的对象
				beLikeResult: [], // 喜欢我的对象
				loveJingxuanList: [], // 精选列表
				hasLoadLikeView: false,
				hasLoadBeLikeView: false,
				showMatchMainView: false,
				status: 'loadmore',
				showCancelActionPop: false
			}
		},
		created() {
			this.loadLikeResult()
		},
		methods: {
			msgCount() {
				return this.$store.state.messegeNum;
			},
			jumpTopic(id) {
				uni.navigateTo({
					url: '/pages/post/detail?id=' + id
				});
			},
			clickReadLoveDetail() {
				// console.log("post detail")
			},
			getPostContent(postContent) {
				return loveJsonRequestor.getExactContentFromPost(postContent)
			},
			change(index) {
				this.current = index;
				if (index == 0) {
					this.loadLikeResult()
				} else if (index == 1) {
					this.loadBeLikeResult()
				}
			},
			submitCancelMatchResult(post, index) {
				this.showCancelActionPop = false
				const likeType = loveJsonRequestor.LikeType_DISLIKE
			
				this.$H
					.post('love/cancelMatch', {
						fromUid: -1,
						postType: 1,
						likeType: likeType,
						toUid: post.uid,
						comments: '',
						postId: post.id
					})
					.then(res => {
					
						if (res.code == 0) {
							this.likeResult.splice(index, 1)
						}

					});



			},
			loadLikeResult() {
				if (this.hasLoadLikeView) return
				this.hasLoadLikeView = true

				this.$H
					.post('love/like', {
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

						if (res.result && res.result.length >= 0) {
							this.likeResult = res.result
							// console.log("like:" + JSON.stringify(res.result))
							this.showMatchMainView = true
						}

					});
			},
			loadBeLikeResult() {
				if (this.hasLoadBeLikeView) return
				this.hasLoadBeLikeView = true

				this.$H
					.post('love/belike', {
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

						if (res.result && res.result.length >= 0) {
							this.beLikeResult = res.result
							// console.log("belike:" + JSON.stringify(res.result))
							this.showMatchMainView = true
						}

					});
			},
		}
	}
</script>

<style lang="scss">
	.base_line_light {
		background-color: #f7f7f7;
		height: 2rpx;
		margin-left: 20rpx;
	}
	
	.popup-content {
		display: flex;
		justify-content: center;
		align-items: center;

		
		.button-layout {
			width: 400rpx;
			height: 200rpx;
			// margin-top: 50%;
		}
	}
</style>
