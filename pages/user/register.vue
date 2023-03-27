<template>
	<view class="container flex-items-plus flex-column">
		<view class="login-logoBox">
			<image class="login-logo" src="../../static/images/huakai_img_txt.png"></image>
		</view>
		<view class="iphoneNum-box flex-row-plus flex-items">
			<view style="margin-right: 30rpx">
				<image class="loginIcon" src="../../static/images/phone.png"></image>
			</view>
			<view>
				<input v-model="form.mobile" placeholder-class="iphoneNum-input" type="text" maxlength='25'
					placeholder="请输入您的微信号/手机号" />
			</view>
		</view>
		<view class="flex-row-plus mar-top-20">
			<view class="code-box">
				<view style="margin-right: 30rpx">
					<image class="loginIcon" src="../../static/images/code.png"></image>
				</view>
				<view>
					<input v-model="form.code" placeholder-class="codeNum-input" placeholder="请输入验证码" />
				</view>
			</view>
			<view :class="disabled === true ? 'on' : ''" :disabled="disabled" class="getcode" @click="getCode">
				{{ text }}
			</view>
		</view>
		<view  class="email-box flex-row-plus flex-items">
			<view style="margin-right: 30rpx">
				<image class="loginIcon-email" src="../../static/images/email.png"></image>
			</view>
			<view>
				<input v-model="form.email" placeholder-class="iphoneNum-input" maxlength='80' placeholder="邮箱 [邮箱验证码登录]" />
			</view>
		</view>
		<view v-if="emailLogin=='1'" class="mar-top-60">
			<view class="registerBut mar-top-100" @click="phoneRegister">注册并登录
			</view>
		</view>
		<view v-else class="mar-top-30">
			<view class="registerBut mar-top-60" @click="phoneRegister">注册并登录
			</view>
		</view>
		<view class="flex-row-plus mar-top-30">
			<text class="font-colors">已有账号，</text>
			<view class="font-colors" @click="gologin">去登录</view>
		</view>
		<view class="agreement">
			<image v-if="!agreement" src="../../static/images/none.png" mode="" @click="agreement=true"></image>
			<image v-else src="../../static/images/solid.png" mode="" @click="agreement=false"></image>
			<text class="font-color-999">注册即代表同意</text>
			<text class="font-colors" @click="protocol('app_user_agreement')">《APP用户服务协议》</text>和
			<text class="font-colors" @click="protocol('app_privacy_agreement')">《APP个人隐私协议》</text>
		</view>
	</view>
</template>



<script>
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	export default {
		data() {
			return {
				form: {
					mobile: "",
					code: "",
					email: ""
				},
				logoUrl: "",
				agreement: false,
				emailLogin: "",
			};
		},
		mixins: [sendVerifyCode],
		onLoad(options) {
			if (options.mobile) {
				this.form.mobile = options.mobile;
			}
			this.getSysInfo();
		},
		methods: {
			// 跳转登录
			gologin() {
				// #ifdef H5
				// uni.navigateTo({
				// 	url: './sms-login'
				// })
				uni.navigateTo({
					url: './go-login'
				})
				// #endif
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: './login'
				})
				// #endif

			},
			getSysInfo() {
				this.$H.get('system/config').then(res => {
					this.logoUrl = res.logoUrl;
					this.emailLogin = res.emailLogin;
				});
			},
			phoneRegister() {

				if (this.form.mobile == '') {
					this.$u.toast('请输入微信号');
					return;
				} else if (this.form.code == '') {
					this.$u.toast('请输入验证码');
					return;
				} 
				else if (this.form.email.trim() == '') {
					this.$u.toast('请输入邮箱，今后可用邮箱验证码直接登录');
					return;
				}else if (!this.agreement) {
					uni.showToast({
						title: '请先阅读并同意《用户服务协议和个人隐私协议》',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				var emailRegExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
				if (this.form.email != '') {
					if (!emailRegExp.test(this.form.email)) {
						this.$u.toast('请输入规范的邮箱');
						return;
					}
				}
				uni.showLoading({
					mask: true,
					title: '登录中'
				});
				this.$H.post("user/register", this.form).then(res => {
					if (res.code == 0) {
						uni.setStorageSync("hasLogin", true);
						uni.setStorageSync("token", res.token);
						uni.switchTab({
							url: '/pages/index/index'
						});
						this.getUserInfo();
					}

					uni.hideLoading();
				})
			},
			getUserInfo() {
				this.$H.get("user/userInfo").then(res => {
					uni.setStorageSync("userInfo", res.result)
					uni.setStorageSync("email", res.result.email)
				})
			},
			getCode() {
				if (this.disabled) return;
				let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
				if (this.form.mobile.trim() == '') {
					this.$u.toast('请输入微信号');
				// } 
				// else if (!phoneCodeVerification.test(this.form.mobile)) {
				// 	this.$u.toast('请输入规范的手机号');
				} else {
					uni.showLoading({
						title: '正在获取验证码'
					})

					this.$H.post("user/sendSmsCode", {
						mobile: this.form.mobile
					}).then(res => {
						if (res.code == 0) {
							uni.hideLoading();
							this.sendCode();
							uni.showToast({
								title: res.msg,
								icon: 'none',
								duration: 3500,
							})
						}
					})

				}
			},
			protocol(type) {
				uni.navigateTo({
					url: './protocol?type=' + type
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f5f5f5;
		height: 100%;
	}
	.container {
		background-color: #FFFFFF;
		height: 100vh;

		.login-logoBox {
			margin-top: 40rpx;

			.login-logo {
				width: 200rpx;
				height: 200rpx;
			}
		}

		.iphoneNum-box {
			margin-top: 100rpx;
			border-bottom: 1rpx solid #DDDDDD;
			height: 100rpx;
			width: 600rpx;

			.loginIcon {
				width: 40rpx;
				height: 50rpx;
			}


			.iphoneNum-input {
				color: #999999;
				font-size: 26rpx;
				font-weight: 400;
			}
		}

		.email-box {
			margin-top: 10rpx;
			border-bottom: 1rpx solid #DDDDDD;
			height: 100rpx;
			width: 600rpx;

			.loginIcon-email {
				width: 50rpx;
				height: 50rpx;
			}

			.iphoneNum-input {
				color: #999999;
				font-size: 26rpx;
				font-weight: 400;
			}
		}

		.passwordNum-box {
			border-bottom: 1rpx solid #DDDDDD;
			height: 100rpx;
			width: 600rpx;

			.passwordNum-input {
				color: #999999;
				font-size: 26rpx;
				font-weight: 400;
				width: 346rpx;
			}
		}

		.code-box {
			border-bottom: 1rpx solid #DDDDDD;
			height: 80rpx;
			width: 360rpx;
			display: flex;
			flex-direction: row;
			// justify-content: space-between;
			align-items: center;

			.loginIcon {
				width: 44rpx;
				height: 50rpx;
			}

			.code-lab {
				width: 200rpx;
			}

			.codeNum-input {
				color: #999999;
				font-size: 26rpx;
				font-weight: 400;
			}
		}

		.getcode {
			background-color: #a4a6a8;
			height: 80rpx;
			width: 230rpx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			margin-left: 10rpx;
			color: #FFFFFF;
		}

		.registerBut {
			background: #333333;
			color: #efece8;
			height: 80rpx;
			width: 600rpx;
			text-align: center;
			line-height: 100rpx;
			margin-top: 30rpx;
		}

		.registerBut {
			background: #333333;
			color: #FFFFFF;
			height: 88rpx;
			width: 600rpx;
			text-align: center;
			line-height: 88rpx;
			margin-top: 40rpx;
		}

		.agreement {
			margin: 40rpx 50rpx;
			line-height: 50rpx;

			image {
				width: 34rpx;
				height: 34rpx;
				margin-right: 15upx;
			}
		}
	}

	.flex-items-plus {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.flex-column {
		flex-direction: column
	}

	.flex-items {
		display: flex;
		align-items: center;
	}

	.flex-row-plus {
		display: flex;
		flex-direction: row
	}

	.mar-top-20 {
		margin-top: 20upx;
	}

	.mar-top-60 {
		margin-top: 60upx;
	}

	.mar-top-100 {
		margin-top: 100upx;
	}

	.mar-top-30 {
		margin-top: 30upx;
	}

	.font-colors {
		color: #abbacc;
	}

	.font-color-999 {
		color: #999999;
	}
</style>
