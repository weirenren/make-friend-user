<template>
	<view class="container_step">
		<view>
			step {{step_index}}
		</view>
		<view>
			<view v-if="step_status == 1" class="step_green">{{step_description}}</view>
			<view v-else>{{step_description}}</view>
			
		</view>
		<view>剩余{{step_day}}天</view>
	</view>
</template>

<script>
	export default {
		props: {
			step_index: {
				type: Number
			},
			step_description: {
				type: String
			},
			step_day: {
				type: Number,
				default: 0
			},
			step_status: {
				type: Number,
				default: 0, // 0:未进行，1:已经完成
			}
		},
		name:"love-couple-step",
		data() {
			return {
				
			};
		}
	}
</script>

<style>
	page {
		background-color: #fefcff;
		height: 100%;
	}
</style>
<style lang="scss" scoped>

.container_step{
	display: flex;
	width: 100%;
	margin: 20rpx 0;
	// display: flex;
	// flex-direction: column;
	// justify-content: center;
	// flex-direction: row;
	justify-content: space-around;
	
	.step_green {
		background-color: aquamarine;
	}
	.step_gray {
		background-color: gray;
	}
}
</style>