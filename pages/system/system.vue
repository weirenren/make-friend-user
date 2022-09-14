<template>
	<view>

		<!-- 页面主体 -->
		<view class="page-body">
			<block v-for="(item,index) in msgList" :key="index">
				<view class="time">{{item.createTime}}</view>
				<!-- 左边消息 -->
				<view  class="chat-item chat-item-left">
					<u-avatar :src="user.avatar" class="avatar"></u-avatar>
					<view class="conent1" v-if="item.type==4" @click="goWatch(item.fromUid)">{{item.content}}</view>
					<view class="conent1" v-else-if="item.type==5">{{item.content}}</view>
					<view class="conent1" v-else @click="goPost(item.postId)">{{item.content}}</view>
				</view>
			</block>
			<view style="height: 130rpx;"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mTxt: "",
				msgList: [],
				userInfo: uni.getStorageSync("userInfo"),
				user: {},
				page: 1,
				isTop: true,//上拉到顶后加锁处理
				timer: null,//定时器
			};
		},
		onLoad(options) {
			this.user = JSON.parse(options.user);
			this.getMessage(1);
			this.timer = setInterval(() => {
				this.getMessage(1);
			}, 30000);
		},
		onPullDownRefresh() {
			this.page++;
			if(this.isTop){
				this.getMessage(0);
			}
			// console.log(this.page)
			uni.stopPullDownRefresh();
			if(this.timer) {
				clearInterval(this.timer);  
				this.timer = null;  
			}
		},
		onReachBottom() {
			// console.log('触底了')
			if(this.timer) {
				clearInterval(this.timer);  
				this.timer = null;  
			}
			this.timer = setInterval(() => {
				this.getMessage(1);
			}, 30000);
		},
		onUnload() {
			if(this.timer) {  
				clearInterval(this.timer);  
				this.timer = null;  
			}
			// console.log('onUnload..')
		},
		methods: {
			
			//如果为1说明是初始加载或发送消息后的更新，如果参数为0说明是上拉加载
			getMessage(e) {
				if(e==1){
					this.page=1;
				}
				this.$H.post("user/systemInfoList", {
					page: this.page,
					uid: this.user.uid
				}).then(res => {
					
					if(e==1){
						this.msgList = res.result;
						this.page=1;
					}else{
						if(res.result.length==0){
							this.$u.toast('到顶啦！');
							this.isTop=false;
						}
						this.msgList = res.result.concat(this.msgList);
					}
					
					this.updateChatStatus();
				})
			},
			
			sendMessage() {
				if(!this.mTxt){
					this.$u.toast('内容不能为空');
					return;
				}
				this.isTop=true;
				this.$H.post("user/sendMessage", {
					uid: this.user.uid,
					content: this.mTxt
				}).then(res => {
					if (res.code == 0) {
						this.getMessage(1);
						this.mTxt = "";
					}
				})
			},
			// 更新阅读状态
			updateChatStatus() {
				this.$H.post("message/updateSystemStatus", {
					uid: this.user.uid
				}).then(res => {
					
				})
			},
			
			goWatch(uid){
				uni.navigateTo({
					url:'/pages/user/home?uid='+uid
				})
			},
			goPost(id){
				uni.navigateTo({
					url:'/pages/post/detail?id='+id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'system.scss';
</style>
