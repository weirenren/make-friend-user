<template>
	<view >
		<u-tabs :list="recommendTabs" :offset="[5,100]" :is-scroll="false" :current="current" @change="change"></u-tabs>
		
		<view v-if="current == 0">
		
			<love-match-mainview :like="likeCB" :unlike="unlikeCB" :normalLike="normalLikeCB" v-if="showMatchMainView" :loadLoveMatchList="loveMatchList"></love-match-mainview>
		    <view v-if="!showMatchMainView"> 
				<u-empty text="今天暂无对象推荐" mode="list"></u-empty>
			</view>
			<u-popup  border-radius="14" width="50%" height="10%" v-model="showMatchPopWindow" mode="center">
				
				<u-button style="height: 100%;" @click="jumpEditLovePostPage">请先发交友贴，再推荐</u-button>
			</u-popup>
		</view>
		
		<view v-if="current == 1">
			<block v-for="(item, index) in loveJingxuanList" :key="item.id">
				<view @tap="jumpTopic(item.id)">
					<love-userpost-info :media="JSON.parse(item.media)" :post_title="getTitle(item)" :post_content="getPostContent(item.content)">
					</love-userpost-info>
				</view>
			</block>
			
			<u-loadmore :status="status" />
		</view>
		<!-- tabbar -->
		<q-tabbar :active="0" :count="msgCount()"></q-tabbar>
	</view>
</template>

<script>
	import loveJsonRequestor from '../../../utils/love-json-requestor.js'
	import LoveMatchMainView from '../../../components/love-match-mainview/love-match-mainview.vue'
	export default {
		data() {
			return {
				recommendTabs: [{
					name: '推荐',
					count: 0,
				}, {
					name: '精选',
					count: 0
				}],
				recommendCount: 0,
				showMatchPopWindow: false,
				current: 0,
				loveMatchList: [],// 推荐的列表数据
				loveJingxuanList: [], // 精选列表
				hasLoadJingxuanView: false,
				showMatchMainView: false,
				status: 'nomore',
				hasLovePost: false,
				postApi: 'love/list',
				postApi2: 'love/list2',
			};
		},
		onLoad() {
			this.checkLovePostExist()
		},
		onShow() {
			// if(this.hasLovePost == false) {
			// 	this.showMatchPopWindow = true
			// }
		            // console.log('页面显示')
		},
		//         onReady(){
		//             console.log('页面初次显示')
		//         },
		//         onHide() {
		//             console.log('页面隐藏')
		//         },

		onReachBottom() {
			console.log('bottom')
			this.status = 'nomore';
		},
		methods: {
			jumpEditLovePostPage() {
				this.showMatchPopWindow = false
				uni.navigateTo({
					url: '/pages/post/love-add'
				});
			},
			normalLikeCB(){
				// console.log('normalLikeCB')
				this.decreaseRecommendView()
			},
			likeCB(){
				// console.log('likeCB')
				this.decreaseRecommendView()
			},
			unlikeCB(){
				// console.log('unlikeCB')
				this.decreaseRecommendView()
			},
			msgCount() {
				return this.$store.state.messegeNum;
			},
			decreaseRecommendView() {
				if (this.recommendTabs[0].count >  0) {
					this.recommendTabs[0].count = this.recommendTabs[0].count - 1
				}
				if (this.recommendTabs[0].count == 0) {
					this.showMatchMainView = false
				}
			},
			jumpTopic(id) {
				uni.navigateTo({
					url: '/pages/post/detail?id=' + id
				});
			},
			getPostContent(postContent) {
				return loveJsonRequestor.getExactContentFromPost(postContent)
			},
			getTitle(post) {
				return loveJsonRequestor.getExactGenderFromPost(post.content) +'-'+ post.title 				
			},
			change(index) {
				this.current = index;
				if (index == 1) {
					if (!this.hasLoadJingxuanView) {
						this.hasLoadJingxuanView = true
						this.loadLoveJingxuan(this.postApi)
					}
				}
			},
			checkLovePostExist() {
				const login = uni.getStorageSync('hasLogin')
				if (login == true) {
					this.$H
						.post('love/checkLovePost', {
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
						
							if (res) {
								var exist = res.result
								if (exist == true) {
									this.loadLoveMatch()
									this.hasLovePost = true
								} else {
									this.showMatchPopWindow = true
								}
							
							} 
						});
						
				} else {
				
					this.postApi = this.postApi2
					this.change(1)
				}
				
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
							this.recommendTabs[0].count = res.result.length
							this.showMatchMainView = true
							// console.log("json:" + JSON.stringify(res.result))
						}
			
					});
			},
			loadLoveJingxuan(postApi) {
				this.$H
					.post(postApi, {
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
							this.loveJingxuanList = res.result
						}
			
					});
			},
			
		}
	}
</script>
<style>
	page {
		background-color: #f5f5f5;
		height: 100%;
	}
</style>
<style lang="scss">
	.container {
		background-color: #F4F9FB;
	}
</style>
