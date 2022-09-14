<template>
	<view class="love-container">

		<u-swiper :list="user_photos"></u-swiper>

		<view class="section">
			<view class="info-item">
				<text class="item-label">昵称:</text>
				<text class="item-value">john</text>
			</view>
			<view class="info-item">
				<text class="item-label">性别:</text>
				<text class="item-value">john</text>
			</view>
			<view class="info-item">
				<text class="item-label">年龄:</text>
				<text class="item-value"></text>
			</view>
			<view class="info-item">
				<text class="item-label">身高:</text>
				<text class="item-value">john</text>
			</view>
			<view class="info-item">
				<text class="item-label">出生年月:</text>
				<text class="item-value">john</text>
			</view>
			<view class="info-item">
				<text class="item-label">毕业院校:</text>
				<text class="item-value">john</text>
			</view>
			<view class="info-item">
				<text class="item-label">学历:</text>
				<text class="item-value">john</text>
			</view>
			<view class="info-item">
				<text class="item-label">工作职业:</text>
				<text class="item-value">john</text>
			</view>
			<view class="info-item">
				<text class="item-label">工作所在行业:</text>
				<text class="item-value">john</text>
			</view>
			<view class="info-item">
				<text class="item-label">婚姻状态:</text>
				<text class="item-value">john</text>
			</view>
			<view class="info-item">
				<text class="item-label">家乡:</text>
				<text class="item-value">john</text>
			</view>
		</view>


		<view class="section info-description">
			<view class="dec-title">
				关于我
			</view>
			<view class="dec-item">
				我是程序员，想找一个温柔的女生
			</view>
		</view>
		<view class="section info-description">
			<view class="dec-title">
				感情观
			</view>
			<view class="dec-item">
				我是程序员，想找一个温柔的女生
			</view>
		</view>
		<view class="section info-description">
			<view class="dec-title">
				心仪的TA
			</view>
			<view class="dec-item">
				我是程序员，想找一个温柔的女生
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: "love-user-preview",
		data() {
			return {
				user_photos: [
					'https://cdn.uviewui.com/uview/swiper/swiper1.png',
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
				]
			};
		}
	}
</script>

<style lang="scss">
	.love-container {
		background-color: gainsboro;
		
		.section {
			background-color: white;
			border-radius: 20rpx;
			margin: 15rpx;
			padding: 15rpx;
		}

		.info-item {
			display: flex;

			.item-label {
				padding: 3rpx 10rpx;
			}

			.item-value {
				padding: 3rpx 10rpx;
				font-weight: bold;
			}
		}

		.info-description {
			display: flex;
			flex-direction: column;
			padding: 5rpx;

			.dec-title {
				width: 100%;
				text-align: center;
				font-size: x-large;
			}

			.dec-item {
				width: 100%;
				text-align: center;

				.info-photo {
					display: flex;
					flex-direction: column;
					align-items: center;
				}
			}

		}


	}
</style>
