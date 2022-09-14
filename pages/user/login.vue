<template>
	<view class="login">
		<image class="logo" :src="shareCover"></image>
		<!-- <open-data class="user-avatar" type="userAvatarUrl"></open-data>
		<open-data class="user-name" type="userNickName"></open-data> -->
		<text class="txt1">申请获取以下权限</text>
		<text class="txt2">获取你的公开信息（昵称、头像等）</text>
		<q-button @click="login">授权登录</q-button>
		<text class="txt3" @click="goBack">暂不登录</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				domain: this.$H.domain,
				shareCover: ""
			};
		},
		onLoad() {
			this.getSysInfo();
		},
		methods: {
			goBack(){
				uni.reLaunch({
					url: '/pages/index/index'
				});
			},
			getSysInfo() {
				this.$H.get("system/miniConfig").then(res => {
					this.shareCover = res.result.intro;
				})
			},
			async login() {

				uni.showLoading({
					mask: true,
					title: '登录中'
				});

				let that = this;

				let userInfo = await this.getUserProfile();
				let loginCode = await this.getLoginCode();
				// console.log('========>', JSON.stringify(userInfo))
				that.$H.post('user/miniWxLogin', {
					code: loginCode,
					username: userInfo.nickName,
					avatar: userInfo.avatarUrl,
					province: userInfo.province,
					city: userInfo.city,
					gender: userInfo.gender
				}).then(res2 => {
					if (res2.code === 0) {
						uni.setStorageSync("hasLogin", true);
						uni.setStorageSync("token", res2.token);
						
						// uni.switchTab({
						// 	url: '/pages/index/index'
						// });
						uni.navigateBack({
							
						});
						that.getUserInfo();

						uni.hideLoading();

					}
				})
			},
			getUserInfo() {
				this.$H.get("user/userInfo").then(res => {
					uni.setStorageSync("userInfo", res.result)
				})
			},
			getLoginCode() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						success: function(loginRes) {
							resolve(loginRes.code);
						}
					});
				});
			},
			getUserProfile() {
				return new Promise((resolve, reject) => {
					wx.getUserProfile({
						lang: 'zh_CN',
						desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
						success: res => {
							resolve(res.userInfo);
						}
					});
				});
			}

		}
	}
</script>

<style lang="scss">
	.login {
		display: flex;
		flex-direction: column;
		padding: 100rpx;
	}

	.login .logo {
		width: 230rpx;
		height: 230rpx;
		margin: 50rpx auto;
	}

	.login .txt1 {
		margin-bottom: 10rpx;
	}

	.login .txt2 {
		color: #ffffff;
		margin-bottom: 50rpx;
	}
	.login .txt3 {
		color: #8c8c8c;
		margin-bottom: 90rpx;
		text-align: center;
	}
	
	.user-avatar {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		overflow: hidden;
		margin: 50rpx auto;
	}

	.user-name {
		font-size: 35rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000;
		margin: 50rpx auto;
	}
</style>
