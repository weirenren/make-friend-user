<template>
	<view>
		<view class="head">
			<block v-if="hasLogin">
				<view class="userinfo" @click="toUcenter">
					<u-avatar :src="userInfo.avatar"></u-avatar>
					<view class="username">
						<text>{{ userInfo.username }}</text>
						<text class="sub-txt">{{ userInfo.intro }}</text>
					</view>
					<q-icon class="arrow-right" name="q-arrow-right"></q-icon>
				</view>
			</block>
			<block v-else>
				<view class="btn-login">
					<!-- #ifdef MP-WEIXIN -->
					<u-button type="default" shape="circle" @click="toLogin" plain>登录</u-button>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<u-button type="default" shape="circle" @click="jumpPhoneLogin" plain>登录</u-button>
					<!-- #endif -->
				</view>
			</block>
			<u-grid :col="4" :border="false" style="margin: 20rpx 0;" @click="toNav">
				<u-grid-item index="/pages/my/fans">
					<text>{{ userInfo.fans || 0}}</text>
					<view class="grid-text">粉丝</view>
				</u-grid-item>
				<u-grid-item index="/pages/my/follow">
					<text>{{ userInfo.follow || 0}}</text>
					<view class="grid-text">关注</view>
				</u-grid-item>
				<u-grid-item index="/pages/my/post">
					<text>{{ userInfo.postNum || 0}}</text>
					<view class="grid-text">帖子</view>
				</u-grid-item>
				<u-grid-item index="/pages/sign/integral">
					<text>{{ userInfo.integral || 0}}</text>
					<view class="grid-text">积分</view>
				</u-grid-item>
			</u-grid>
		</view>
		<!-- 我的服务 -->
		<view class="block-wrap">
			<view class="block-title">我的服务</view>
			<u-grid :col="4" :border="false" style="margin: 20rpx 0;" @click="toNav">
				<u-grid-item v-for="(menu,menuListIndex) in menuList" :key="menuListIndex" :index="menu.url">
				    <image class="gn-icon" :src="menu.img"></image>
				    <view class="grid-text">{{menu.name}}</view>
				</u-grid-item>
			</u-grid>
		</view>
		<view class="by">
		  <view>
		    <text class="by-text">林风社交论坛V1.4.1-演示站点</text>
		  </view>
		</view>
		<!-- tabbar -->
		<q-tabbar :active="4" :count="msgCount"></q-tabbar>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isOpen: getApp().globalData.isOpen,
			mAd: this.$c.mAd,
			userInfo: '',
			hasLogin: false,
			menuList:[]
		};
	},
	computed:{
		msgCount(){
			return this.$store.state.messegeNum
		}
	},
	onLoad() {
		this.getUserMenu();
		//#ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		//#endif
	},
	onShow() {
		if (uni.getStorageSync('hasLogin')) {
			this.getUserInfo();
			this.hasLogin = true;
		} else {
			this.hasLogin = false;
		}
		this.getMsgNum();
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内分享按钮
			console.log(res.target);
		}
		let imgURL = 'http://pic.linfeng.tech/logo.png';
		return {
			title: this.$c.miniappName,
			path: '/pages/index/index',
			imageUrl: imgURL
		};
	},
	methods: {
		getUserMenu(){
			this.$H.get('userMenu/list').then(res => {
				if(res.code==0){
					this.menuList=res.result;
				}
				
			});
		},
		getMsgNum() {
			this.$H.post('message/num').then(res => {
				this.$store.state.messegeNum = [0,0,0,res.result.allCount,0];
			});
		},
		jumpPhoneLogin() {
			uni.navigateTo({
				url: '/pages/user/go-login'
			});
		},
		toLogin() {
			uni.navigateTo({
				url: '/pages/user/login'
			});
		},
		getUserInfo() {
			this.$H.get('user/userInfo').then(res => {
				this.userInfo = res.result;
			});
		},
		toUcenter() {
			uni.navigateTo({
				url: '/pages/user/edit-info/edit'
			});
		},
		toNav(url) {
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style>
page {
	background-color: #f5f5f5;
}
</style>
<style lang="scss" scoped>
.head {
	padding: 20rpx;
	background-color: #fff;
	.sub-txt {
		font-size: 24rpx;
		color: #616161;
		display: block;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}
	margin-bottom: 20rpx;
}

.userinfo {
	display: flex;
	align-items: center;
	padding: 20rpx;
}

.userinfo .username {
	display: flex;
	flex-direction: column;
	margin-left: 25rpx;
}

.grid-text {
	color: #999;
	font-size: 12px;
	margin-bottom: 20rpx;
}

.userinfo u-avatar {
	margin-right: 20rpx;
}

.userinfo .arrow-right {
	margin-left: auto;
}

.btn-login {
	margin: 40rpx 0;
}

.gn-icon {
	width: 60rpx;
	height: 60rpx;
	margin-bottom: 20rpx;
}

/*服务按钮*/
.btn-wrap {
	display: flex;
	margin-top: 30rpx;
}

.btn-wrap .btn-contact {
	background-color: #fff;
	margin-left: 15rpx;
	margin-right: 15rpx;
	padding: 20rpx;
	line-height: unset;
	font-size: 12px;
	color: #999;
}

.btn-wrap .btn-contact:active {
	background-color: #f5f5f5;
}

.btn-wrap .btn-contact .txt {
	margin-top: 20rpx;
}

.btn-wrap .btn-contact::after {
	border: unset;
	position: unset;
}

.icon-size {
	font-size: 50rpx;
}

.block-wrap {
	background-color: #fff;
	border-radius: 20rpx;
	margin: 20rpx;
	overflow: hidden;
	.block-title {
		background-color: #fff;
		padding: 20rpx;
	}
}
.by {
  text-align: center;
  padding: 2rpx 0;
}

.by-text {
  text-align: center;
  font-size: 24rpx;
  color: #8d8d8d;
}
</style>
