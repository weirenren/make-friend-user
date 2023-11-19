<template>
	<view>
		<u-grid :col="3" :border="false" @click="toNav">
			<u-grid-item index="1">
				<u-badge :count="msgNum.thumbCount" :offset="[10, 50]"></u-badge>
				<image class="nav-icon" src="/static/images/icon/like.png"></image>
				<view class="grid-text">点赞</view>
			</u-grid-item>
			<u-grid-item index="2">
				<u-badge :count="msgNum.follow" :offset="[10, 50]"></u-badge>
				<image class="nav-icon" src="/static/images/icon/focus.png"></image>
				<view class="grid-text">关注</view>
			</u-grid-item>
			<u-grid-item index="3">
				<u-badge :count="msgNum.comment" :offset="[10, 50]"></u-badge>
				<image class="nav-icon" src="/static/images/icon/comment.png"></image>
				<view class="grid-text">评论</view>
			</u-grid-item>
		</u-grid>
		<view class="msg-wrap">
			<view class="title"><view class="left">私信</view><view class="right" @click="gotoMore">更多</view></view>
			<!-- 系统通知消息 -->
			<block v-if="msgNum.articleMsgList.length > 0">
				<navigator
					@longpress="onPressArticle(item.mid, index)"
					:url="'/pages/system/system?user=' + $f.tostring(item.userInfo)"
					class="msg-item"
					v-for="(item, index) in msgNum.articleMsgList"
					:key="index"
				>
					<view class="avatar-box">
						<u-badge v-if="item.status == 0" :is-dot="true" :offset="[5, 10]" type="error"></u-badge>
						<u-avatar class="avatar" trsrc="/static/weigui.png"></u-avatar>
					</view>
					<view class="right">
						<view>
							<text style="margin-right: 10rpx;">{{ item.userInfo.username }}</text>
							<u-tag bg-color="#8687fd" text="官方" type="error" size="mini" mode="dark" />
						</view>
						<view class="desc">
							<text>{{ item.title }}</text>
							<text class="time">{{ item.createTime }}</text>
						</view>
					</view>
				</navigator>
			</block>
			<block v-if="msgNum.chatMsgList.length > 0">
				<navigator
					@longpress="onPressChat(item.userInfo.uid, index)"
					:url="'/pages/chat/chat?user=' + $f.tostring(item.userInfo)"
					class="msg-item"
					v-for="(item, index) in msgNum.chatMsgList"
					:key="index"
				>
					<view class="avatar-box">
						<u-badge :count="item.count" :offset="[5, 10]" type="error"></u-badge>
						<u-avatar class="avatar" :src="item.userInfo.avatar"></u-avatar>
					</view>
					<view class="right">
						<view>
							<text style="margin-right: 10rpx;">{{ item.userInfo.username }}</text>
						</view>
						<view class="desc">
							<text class="wenzi">{{ item.msg.content }}</text>
							<text class="time">{{ item.msg.createTime }}</text>
						</view>
					</view>
				</navigator>
			</block>
			<block v-if="msgNum.chatMsgList.length == 0 && msgNum.articleMsgList.length == 0">
				<view class="msg-empty">
					<image class="img" mode="widthFix" src="/static/empty.png"></image>
					<text class="txt">暂无新消息</text>
				</view>
			</block>
		</view>
		<!-- 删除图文消息弹窗 -->
		<u-action-sheet :list="sheetList" v-model="showSheet" @click="onSheetItem"></u-action-sheet>
		<!-- 删除私信消息弹窗 -->
		<u-action-sheet :list="sheetList" v-model="showChatSheet" @click="onSheeChat"></u-action-sheet>
		<!-- tabbar -->
		<q-tabbar :active="2" :count="msgCount"></q-tabbar>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showSheet: false,
			showChatSheet: false,
			sheetList: [
				{
					text: '删除',
					color: 'red'
				}
			],
			msgNum: {
				thumbCount: 0,
				follow: 0,
				comment: 0,
				articleMsgList: [],
				chatMsgList: []
			},
			checkedMsgId: '',
			checkedIndex: '',
			checkedMsgUid: ''
		};
	},
	computed: {
		msgCount() {
			return this.$store.state.messegeNum;
		}
	},
	onShow() {
		if (uni.getStorageSync('userInfo').uid) {
			this.getMsgNum();
		}
	},
	onPullDownRefresh() {
		this.getMsgNum();
		uni.stopPullDownRefresh();
	},
	methods: {
		gotoMore(){
			uni.navigateTo({
				url:'/pages/message/more'
			})
		},
		// 更新阅读状态
		articleMsgState(id) {
			this.$H.post('message/articleMsgState', {
				id: id
			});
		},
		// 长按图文消息
		onPressArticle(id, index) {
			this.showSheet = true;
			this.checkedMsgId = id;
			this.checkedIndex = index;
		},
		// 长按私信
		onPressChat(uid, index) {
			this.showChatSheet = true;
			this.checkedIndex = index;
			this.checkedMsgUid = uid;
		},
		// 删除图文消息
		onSheetItem(index) {
			if (index == 0) {
				this.$H
					.post('message/delMsg', {
						id: this.checkedMsgId
					})
					.then(res => {
						if (res.code == 0) {
							this.msgNum.articleMsgList.splice(this.checkedIndex, 1);
						}
					});
			}
		},
		// 删除私信消息
		onSheeChat(index) {
			if (index == 0) {
				this.$H
					.post('message/delChat', {
						uid: this.checkedMsgUid
					})
					.then(res => {
						if (res.code == 0) {
							this.msgNum.chatMsgList.splice(this.checkedIndex, 1);
						}
					});
			}
		},
		getMsgNum() {
			this.$H.post('message/num').then(res => {
				this.msgNum = res.result;
				this.$store.state.messegeNum = [0, 0, 0, res.result.allCount, 0];
			});
		},
		toNav(e) {
			uni.navigateTo({
				url: '/pages/message/list?type=' + e
			});
		}
	}
};
</script>
<style>
	page {
		background-color: #f5f5f5;
		height: 100%;
	}
</style>
<style lang="scss" scoped>

.nav-icon {
	width: 90rpx;
	height: 90rpx;
	margin-bottom: 10rpx;
}

.msg-wrap{
	background-color: #FFFFFF;
	margin-top: 20rpx;
	.title{
		margin: 30rpx;
		display: flex;
		.right{
			margin-left: auto;
		}
	}
	.msg-item{
		padding: 20rpx;
		display: flex;
		.avatar-box{
			position: relative;
			.avatar{
				margin-right: 20rpx;
				
			}
		}
	
		.right{
			display: flex;
			flex-direction: column;
			flex: 1;
			.desc{
				font-size: 24rpx;
				color: #999;
				display: flex;
				.wenzi{
					width: 350rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.time{
					white-space: nowrap;
					margin-left: auto;
				}
			}
		}
	}
}

  // 
  .msg-empty{
	  display: flex;
	  flex-direction: column;
	  align-items:center ;
	  min-height: 800rpx;
	  .img{
		 width: 200rpx;
		 margin-top: 100rpx;
	  }
	  .txt{
		  color: #999;
		  font-size: 20rpx;
		  margin-top: 20rpx;
	  }
  }
</style>
