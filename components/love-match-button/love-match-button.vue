<template>

	<view class="fix-bottom-step">
		<view class="next-step">
			<u-button type="primary" color="#BEBEBE" shape="circle"
				style="margin: 30px 10px; width: 100px; opacity: 0.8;">
				不喜欢
			</u-button>
			<u-button type="primary" color="#FF83FA" shape="circle"
				style="margin: 30px 10px; width: 100px; opacity: 0.8;">
				可以了解
			</u-button>
			<u-button type="primary" color="#FF3030" shape="circle"
				style="margin: 30px 10px; width: 100px; opacity: 0.8;">
				很喜欢
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
		}
	}
</script>

<style lang="scss">
	.fix-bottom-step {
		position: fixed;
		left: 0rpx;
		bottom: 0rpx;
		z-index: 1010;
		width: 100%;

		.next-step {
			display: flex;
			justify-content: space-between;
		}
	}
</style>
