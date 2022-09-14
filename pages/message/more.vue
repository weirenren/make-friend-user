<template>
	<view>
		
		<view class="msg-wrap">
			<view class="title"><view class="left">私信</view></view>
			<!-- 私聊消息 -->
			<block v-if="msgNum.chatMsgList.length > 0">
				<navigator
					
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
							<text class="time">{{ item.msg.createTime | timeFormat }}</text>
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
		<q-tabbar :active="3" :count="msgCount"></q-tabbar>
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
		// 更新阅读状态
		articleMsgState(id) {
			console.log('=======>',id)
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
			this.$H.post('message/chatAll').then(res => {
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
