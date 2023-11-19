<template>
	<view>
		<!-- navbar -->
	<!-- 	<u-navbar :is-back="false" z-index="99999">
	
			<u-tabs :list="tabList" font-size="35" name="cateName" bg-color="#fff" :current="current"
				@change="tabChange"></u-tabs>
		</u-navbar> -->
		<!-- 最新 -->
		<view>
			<view class="topic-wrap">
			<!-- 	<view v-if="joinTopicList && joinTopicList.length > 0" class="block-title">
					<view>我加入的圈子</view>
					<view style="display: flex;">
						<text @click="jumpMoreQuanzi">
							更多圈子
						</text>
						<u-image style="margin-top: 4rpx;" width="25rpx" height="25rpx" src="/static/images/icon/right.png"></u-image>
					</view>
					
				</view> -->
				<u-grid @click="jump" :col="5" :border="false">
					<!-- 我的圈子 -->
					<u-grid-item :index="'/pages/topic/detail?id='+item.id"
						v-for="(item, index) in joinTopicList" :key="index">
						<view class="grid-topic">
							<u-image width="120rpx" :border-radius="10" height="120rpx" :src="item.coverImage">
							</u-image>
							<view class="name">{{ item.topicName.substring(0, 5) }}</view>
							<text v-if="sessionUid == item.uid" class="user">圈主</text>
						</view>
					</u-grid-item>
					<!-- 创建圈子 -->	
					<u-grid-item index="/pages/topic/add/add">
						<navigator class="grid-topic">
							<u-image width="120rpx" :border-radius="10" height="120rpx" src="/static/add-1.png">
							</u-image>
							<view class="name">创建圈子</view>
						</navigator>
					</u-grid-item>
				</u-grid>
			</view>
			
			<!-- <love-activity-enter v-if="renderActivityView" :act_object="getActivityPost()"></love-activity-enter> -->
		
			<post-list :list="lastPost" :loadStatus="loadStatus4" :showTag="true"></post-list>
			<!-- <post-waterfall :list="lastPost" :loadStatus="loadStatus4"></post-waterfall> -->
		</view>
		<!-- 关注 -->
		<view v-if="current === 0">
			<!-- <post-list :list="followUserPost" :loadStatus="loadStatus1" :showTag="true"></post-list> -->
			<post-waterfall :list="followUserPost" :loadStatus="loadStatus1"></post-waterfall>
		</view>
		<view v-if="current === 1">
			<!-- 我的圈子 -->
			<view class="topic-wrap">
				<view class="block-title">
					<view>我加入的圈子</view>
				</view>
				<u-grid @click="jump" :col="5" :border="false">
					<!-- 我的圈子 -->
					<u-grid-item :index="'/pages/topic/detail?id='+item.id"
						v-for="(item, index) in joinTopicList" :key="index">
						<view class="grid-topic">
							<u-image width="120rpx" :border-radius="10" height="120rpx" :src="item.coverImage">
							</u-image>
							<view class="name">{{ item.topicName.substring(0, 5) }}</view>
							<text v-if="sessionUid == item.uid" class="user">圈主</text>
						</view>
					</u-grid-item>
					<!-- 创建圈子 -->
					<u-grid-item index="/pages/topic/add/add">
						<navigator class="grid-topic">
							<u-image width="120rpx" :border-radius="10" height="120rpx" src="/static/add-1.png">
							</u-image>
							<view class="name">创建圈子</view>
						</navigator>
					</u-grid-item>
				</u-grid>
			</view>
			<!-- <post-list :list="joinTopicPost" :loadStatus="loadStatus3" :showTag="true"></post-list> -->
			<post-waterfall :list="joinTopicPost" :loadStatus="loadStatus3"></post-waterfall>
		</view>
		<!-- tabbar -->
		<q-tabbar :active="1" :count="msgCount"></q-tabbar>
		<!-- 返回顶部 -->
		<q-back-top></q-back-top>
	</view>
</template>

<script>
	import loveActivityEnter from '../../components/love-activity-enter/love-activity-enter.vue'
	import postList from '../../components/post-list/post-list.vue';
	import postWaterfall from '../../components/post-waterfall/post-waterfall.vue';
	export default {
		components: {
			postList,
			postWaterfall
		},
		data() {
			return {
				sessionUid: uni.getStorageSync('userInfo').uid,
				userType: uni.getStorageSync('userInfo').type,
				loadStatus1: 'loadmore',
				loadStatus2: 'loadmore',
				loadStatus3: 'loadmore',
				loadStatus4: 'loadmore',
				page: 1,
				page2: 1,
				page3: 1,
				page4: 1,
				shareCover: '',
				topDisList: [],
				swiperList: [],
				followUserPost: [],
				joinTopicPost: [],
				activityList: [],
				renderActivityView: false,
				lastPost: [],
				tabList: [{
						name: '关注'
					},
					{
						name: '圈子'
					},
					{
						name: '最新'
					}
				],
				current: 2,
				joinTopicList:[],
				
			};
		},
		computed: {
			msgCount() {
				return this.$store.state.messegeNum
			}
		},
		onShareAppMessage(res) {
			// if (res.from === 'button') {
				// 来自页面内分享按钮
				// console.log('0000000000');
			// }
			return {
				title: this.$c.miniappName,
				path: '/pages/index/index',
				imageUrl: this.shareCover
			};
		},
		onLoad() {
			this.getSysInfo();
			this.getLastPost();
			this.getJoinTopicPost();
			this.getUserJoinTopic();
		},
		onShow() {
			this.getMsgNum();
		},
		onReachBottom() {
			if (this.current === 0) {
				this.page2++;
				this.getFollowUserPost();
			}

			if (this.current === 1) {
				this.page3++;
				this.getJoinTopicPost();
			}
			if (this.current === 2) {
				this.page4++;
				this.getLastPost();
			}
		},
		onPullDownRefresh() {
			if (this.current === 0) {
				this.page2 = 1;
				this.followUserPost = [];
				this.getFollowUserPost();
				this.getMsgNum();
			}

			if (this.current === 1) {
				this.page3 = 1;
				this.joinTopicPost = [];
				this.getJoinTopicPost();
				this.getUserJoinTopic();
				this.getMsgNum();
			}
			
			if (this.current === 2) {
				this.page4 = 1;
				this.lastPost = [];
				this.getLastPost();
			}
			uni.stopPullDownRefresh();
		},
		methods: {
			getMsgNum() {
				this.$H.post('message/num').then(res => {
					this.$store.state.messegeNum = [0, 0, 0, res.result.allCount, 0];
				});
			},
			tabChange(index) {
				this.current = index;
				this.followUserPost=[];
				this.joinTopicList=[];
				this.lastPost=[];
				this.joinTopicPost=[];
				if(index===1){
					this.page3 = 1;
					this.getJoinTopicPost();
					this.getUserJoinTopic();
					this.getMsgNum();
				}
				if(index===0){
					this.page2 = 1;
					this.getFollowUserPost();
					this.getMsgNum();
				}
				if(index===2){
					this.page4 = 1;
					this.getLastPost();
				}
			},
			// 用户加入的圈子
			getUserJoinTopic() {
				this.loadStatus = 'loading';
				this.$H
					.post('topic/userJoinTopic', {
						classId: this.topicClassId
					})
					.then(res => {
						this.joinTopicList = res.result.data;
						uni.stopPullDownRefresh();
					});
			},
			jump(url){
				uni.navigateTo({
					url:url
				})
			},
			jumpMoreQuanzi() {
				uni.navigateTo({
					url:'/pages/topic/class-list'
				})
			},
			getSysInfo() {
				this.$H.get('system/miniConfig').then(res => {
					this.shareCover = res.result.intro;
				});
			},
			parseActivity(page, postList) {
				console.log('parseActivity')
				if (page == 1 && this.activityList.length == 0) {
					for (var i = 0; i < postList.length; i++) {
						const post = postList[i]
						
						if (post.type == 10) { 
							this.activityList.push(post)
						}
					}
					
					if (this.activityList.length > 0) {
						this.renderActivityView = true
						
						// console.log('renderActivityView')
					}
					// console.log(this.activityList)
				}
			},
			getActivityPost() {
				return this.activityList[0];
			},
			// 获取加入的圈子动态
			getJoinTopicPost() {
				this.loadStatus3 = 'loading';
				this.$H
					.get('post/joinTopicPost', {
						page: this.page3
					})
					.then(res => {
						this.joinTopicPost = this.joinTopicPost.concat(res.result.data);
						if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
							this.loadStatus3 = 'nomore';
						} else {
							this.loadStatus3 = 'loadmore';
						}
						
						this.parseActivity(this.page3, this.joinTopicPost);
					});
			},
			// 获取关注用户帖子
			getFollowUserPost() {
				this.loadStatus1 = 'loading';
				this.$H
					.get('post/followUserPost', {
						page: this.page2
					})
					.then(res => {
						if(res.code==0&&res.result){
							this.followUserPost = this.followUserPost.concat(res.result.data);
							if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
								this.loadStatus1 = 'nomore';
							} else {
								this.loadStatus1 = 'loadmore';
							}
						}else{
							this.loadStatus1 = 'nomore';
						}
						
					});
			},
			//获取最新帖子
			getLastPost() {
				this.loadStatus4 = 'loading';
				this.$H
					.get('post/lastPost', {
						page: this.page4
					})
					.then(res => {
						this.lastPost = this.lastPost.concat(res.result.data);
						if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
							this.loadStatus4 = 'nomore';
						} else {
							this.loadStatus4 = 'loadmore';
						}
					});
			},
		}
	};
</script>

<style>
	page {
		background-color: #F5F5F5;
	}
</style>
<style lang="scss" scoped>
	.swiper-body{
		height: calc(100vh - var(--status-bar-height) - 43px);
	}
	
	.body-scroll-view{
		width: 100%;
		height: 100%;
	}
	
	.tab-box {
		width: 80%;
	}
	
	.block-title {
		font-weight: bold;
		padding: 20rpx;
		color: #616161;
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
		
		.right{
			margin-left: auto;
			color: #999;
			font-size: 24rpx;
		}
	}
	
	// 顶部圈子
	.topic-wrap{
		padding: 0 20rpx; 
		background-color: #fff;
		margin-bottom: 20rpx;
	}
	.grid-topic{
		position: relative;
		margin-bottom: 20rpx;
		.name{
			font-size: 24rpx;
			text-align: center;
		}
		.user{
			position: absolute;
			left: 0;
			top: 0;
			font-size: 20rpx;
			display: block;
			background-color: $themes-color;
			padding: 5rpx;
			border-radius: 0 0 10rpx 0;
		}
	}
</style>
