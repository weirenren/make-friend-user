<template>
	<view class="container">
		<love-user-preview></love-user-preview>
		<love-match-button></love-match-button>
		
		<view class="section">
			<u-button class="dec-item">将它推荐给好友</u-button>
			<u-button class="dec-item">举报</u-button>
		</view>
		
	</view>
</template>


<script>
	import loveUserPreview from '../../../components/love-user-preview/love-user-preview.vue'
	import loveUserMatchButton from '../../../components/love-match-button/love-match-button.vue'
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	
	.container {
		background-color: gainsboro;
		
		.section {
			background-color: white;
			border-radius: 20rpx;
			margin: 15rpx;
			padding: 15rpx;
		}
	}
		
</style>
