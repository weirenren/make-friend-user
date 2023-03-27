<template>
	<view>
		<view class="read-tips">
			<text @click="readStatus">一键已读</text>
		</view>
		<block v-for="(item,index) in msgList" :key="index">
			<view class="comment-msg-item">
				<navigator :url="'/pages/user/home?uid='+ item.fromUid" hover-class="none">
					<u-avatar class="avatar" :src="item.userInfo.avatar"></u-avatar>
				</navigator>
				<view class="msg-c">
					<view class="msg-c-t">
						<text class="username">{{item.userInfo.username}}</text>
						<text class="time">{{item.createTime}}</text>
					</view>
					<view class="msg-c-txt">
						<text>{{item.content}}</text>
						<text v-if="item.status === 0" class="dot"></text>
					</view>
					<navigator v-if="msgType != 2" :url="'/pages/post/detail?id='+item.postId+'&mid='+item.mid" hover-class="none">
						<view class="post-c">
							<view class="post-c-txt">{{item.content}}</view>
						</view>
					</navigator>
				</view>
			</view>
		</block>
		<!-- 加载状态 -->
		<block v-if="msgList.length === 0 && loadStatus == 'nomore'">
			<u-empty margin-top="100" text="暂无内容" mode="favor"></u-empty>
		</block>
		<block v-else>
			<view style="margin: 30rpx 0;">
				<u-loadmore :status="loadStatus" />
			</view>
		</block>
	</view>
</template>

<script>
	import timeFrom from '../../uview-ui/libs/function/timeFrom.js'
	export default {
		data() {
			return {
				page: 1,
				current: 0,
				msgType: 0,
				msgList: [],
				loadStatus: 'loadmore',
			};
		},
		onLoad(options) {
			this.msgType = options.type;
			this.getMsgList();
			if(options.type==2){
				this.readAllWatchInfo();
			}
		},
		onReachBottom() {
			this.page++;
			this.getMsgList();
		},
		methods: {
			readAllWatchInfo(){
				var that=this;
				this.$H.get("message/readAllWatchInfo", {}).then(res => {
					// that.getMsgList();
				})
			},
			getMsgList() {
				var that=this;
				this.$H.get("message/list", {
					type: this.msgType,
					page: this.page,
				}).then(res => {
					// this.msgList = res.result;
					that.msgList = that.msgList.concat(res.result.data);
					
					if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}
				})
			},
			readStatus() {
				let that = this;
				this.$H.get("message/status", {
					type: this.msgType
				}).then(res => {
					this.msgList.forEach(function(item, index) {
						that.msgList[index].status = 1;
					});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.comment-msg-item {
		display: flex;
		background-color: #fff;
		border-bottom: 1px solid #f5f5f5;
		padding: 20rpx;
	}
	.comment-msg-item .msg-c{
		width: 100%;
	}
	.comment-msg-item .avatar {
		margin-right: 10rpx;
	}
	
	.comment-msg-item .post-c {
		background-color: #eee;
		margin-top: 20rpx;
		padding: 20rpx;
		font-size: 16px;
		line-height: 1.8;
		border-radius: 10rpx;
	}
	
	.comment-msg-item .post-c .post-c-txt {
		text-overflow: ellipsis;
		display: -webkit-box;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		overflow: hidden;
	}
	
	.comment-msg-item .msg-c {
		display: flex;
		flex-direction: column;
	}
	.comment-msg-item .msg-c .msg-c-t{
		display: flex;
	}
	
	.comment-msg-item .msg-c .msg-c-t .time{
		font-size: 18px;
		color: #999;
		margin-left: auto;
	}
	.comment-msg-item .msg-c .username {
		margin-bottom: 10rpx;
		font-size: 18px;
		color: #2B85E4;
	}
	.comment-msg-item .msg-c .msg-c-txt{
		display: flex;
		align-items: center;
		font-size: 18px;
	}
	.comment-msg-item .msg-c .msg-c-txt .dot{
		width: 20rpx;
		height: 20rpx;
		background-color: #FA3534;
		border-radius: 50%;
		display: block;
		margin-left: 10rpx;
	}
	
	/*标记已读*/
	.read-tips{
		padding: 15rpx;
		background-color: #f5f5f5;
		display: flex;
		font-size: 15px;
	}
	
	.read-tips text{
		margin-left: auto;
	}
</style>
