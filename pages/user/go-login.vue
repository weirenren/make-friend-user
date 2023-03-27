<template>
	<view class="container flex-items-plus flex-column">
		<view class="login-logoBox">
			<image class="login-logo" src="../../static/images/huakai_img_txt.png"></image>
		</view>
		<view class="loginTitle-text flex-column-plus flex-items font-color-666 fs26">
			<text>为了给您提供更好的服务</text>
			<text>我们需要您的授权哦~</text>
		</view>
		<view>

			<!-- #ifdef H5 -->
			<!-- <view class="loginBut"  @click="goMobileLogin">手机号登录</view> -->
			<view v-if="emailLogin=='1'" class="loginButton"  @click="goEmailLogin">邮箱登录</view>
			<!-- #endif -->
		</view>
		<view class="flex-row-plus mar-top-30">
			<text class="font-colors">还没有账号，</text>
			<view class="register-text" @click="goRegister">去注册</view>
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				logoUrl:"",
				emailLogin:"",
			}
		},
		onLoad(options) {
			this.getSysInfo();
		},
		onShow() {
			// 所有需要授权页面进登录页面取消loading
			uni.hideLoading()
		},
		
		methods: {
			getSysInfo() {
				this.$H.get('system/config').then(res => {
					this.logoUrl = res.logoUrl;
					this.emailLogin=res.emailLogin;
				});
			},
			goMobileLogin() {
				uni.navigateTo({
					url: './sms-login'
				})
			},
			goRegister() {
				uni.navigateTo({
					url: 'register'
				})
			},
			goEmailLogin(){
				uni.navigateTo({
					url: './email-login'
				})
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
		background-color: #FFFFFF;
		height: 100vh;

		.login-logoBox {
			margin-top: -200rpx;

			.login-logo {
				width: 200rpx;
				height: 200rpx;
			}
		}

		.loginTitle-text {
			margin-top: 100rpx;
		}

		.goToHome {
			background: none;
			border: none;
			width: auto;
			margin-top: 50rpx;
			color: #999999;
			text-decoration: underline;

			&:after {
				display: none;
			}
		}

		.loginWxBut {
			background: #333333;
			color: #efece8;
			height: 88rpx;
			width: 600rpx;
			text-align: center;
			line-height: 88rpx;
			margin-top: 49rpx;
		}

		.loginBut {
			background-color: #333333;
			color: #efece8;
			height: 88rpx;
			width: 600rpx;
			text-align: center;
			line-height: 88rpx;
			margin-top: 30rpx;
			border-radius: 10rpx;
		}
		.loginButton{
			background-color: #959292;
			color: #efece8;
			height: 88rpx;
			width: 600rpx;
			text-align: center;
			line-height: 88rpx;
			margin-top: 30rpx;
			border-radius: 10rpx;
		}

		.register-text {
			color: #8b857d;
		}
	}
</style>
<style scoped>
	.loginWxBut::after {
		border-radius: 0 !important;
	}
	.flex-column-plus {
	  display: flex;
	  flex-direction: column
	}
	.flex-items-plus{display: flex;justify-content: center;align-items:center;}
	.flex-column{flex-direction: column}
	.flex-items{display: flex;align-items:center;}
	.flex-row-plus{display: flex;flex-direction: row}
	.mar-top-20{margin-top: 20upx;}
	.mar-top-60{margin-top: 60upx;}
	.mar-top-100{margin-top: 100upx;}
	.fs28 {
	  font-size: 28upx;
	}
	.fs26 {
	  font-size: 26upx;
	}
	.mar-top-30 {
	  margin-top: 30upx;
	}
	.font-colors {
	  color: #adaca9;
	}
	.font-color-666 {
	  color: #6887a9;
	}
</style>
