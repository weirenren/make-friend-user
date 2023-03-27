<template>

	<view class="fix-bottom-step">
		<view class="next-step">
			<u-button @click="unlikeClick()" type="primary" shape="circle"
				style="margin: 50rpx 12rpx; width: 160rpx; background-color: #D9D9D9;">
				X
			</u-button>
			<u-button @click="likeClick()" type="primary" shape="circle"
				style="margin: 50rpx 12rpx; width: 200rpx; background-color:#A6AEF5">
				很喜欢
			</u-button>
			<u-button @click="normalLike()" type="primary" shape="circle"
				style="margin: 50rpx 12rpx; width: 200rpx; background-color:#CECDFF">
				可以了解
			</u-button>
		</view>
	</view>

</template>

<script>
	export default {
		name: "love-match-button",
		data() {
			return {

			};
		},
		props: {
			unlike: {
				type: Function
			},
			like: {
				type: Function
			},
			normalLike: {
				type: Function
			}
		},
		methods: {
			unlikeClick() {
				this.unlike()
			},
			likeClick() {
				this.like()
			},
			normalLikeClick() {
				this.normalLike()
			}
		}
	}
</script>

<style lang="scss">
	.fix-bottom-step {
		position: fixed;
		left: 0rpx;
		bottom: 80rpx;
		z-index: 1010;
		width: 100%;

		.next-step {
			display: flex;
			justify-content: space-between;
		}
	}
</style>
