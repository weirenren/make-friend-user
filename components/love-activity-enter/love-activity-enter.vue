<template>
	<view class="act-background">
		<view class="act-padding">
			<view class="act-datetime">
				{{act_date_time}}
			</view>
			<view class="act-content">
				<text>{{act_title}}</text>
				<q-button @click="jumpActivityDetail()">预约参加</q-button>
			</view>
		</view>
		
	</view>
</template>

<script>
	import LoveJsonRequestor from '../../utils/love-json-requestor.js'
	export default {
		name:"love-activity-enter",
		data() {
			return {
				actvity_state: 0,
				act_date_time: '',
				act_title: '',
				postId: -1,
			};
		},
		props: {
			act_object:Object
		},
		created() {
			// console.log("created")
			this.processData()
		},
		methods: {
			processData() {
				// const content = LoveJsonRequestor.getExactContentFromPost(this.act_object.content)
				const object = JSON.parse(this.act_object.content)
				this.act_date_time  = object.act_datetime
				this.act_title = object.act_title
				this.postId = this.act_object.id
				
			},
			
			jumpActivityDetail() {
				if (this.postId > 0) {
					uni.navigateTo({
						url:'/pages/user/love/love-activity-detail?id=' + this.postId
					})
				}
				
			},
		}
	}
</script>

<style lang="scss">

.act-background{
	background-color: #EAECFF ;
	border-radius: 20rpx;
	padding: 24rpx 16rpx;
	height: 220rpx;
	
	.act-padding {
		display: flex;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		height: 100%;
		justify-content: space-between;
		
		.act-datetime {
			background-color: #A6AEF5;
			border-radius: 20rpx;
			height: 100%;
			width: 200rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		
		.act-content {
			display: flex;
			flex-direction: column;
			padding: 10rpx;
			margin-right: 50rpx;
			align-items: flex-end;
		}
	}
}

</style>