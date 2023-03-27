<template>
	<view class="page content">
		
		<view class="act-title">
			<text class="label">活动主题</text>
			<u-input class="input" v-model="act_title"></u-input>
		</view>
		
		<view class="divtor"></view>
		
		<view class="act-title">
			<text class="label">时间</text>
			<u-input class="input" v-model="act_datetime"></u-input>
			
			<text class="label">时长</text>
			<u-input class="input" v-model="act_time_duration"></u-input>
		</view>
		<view class="divtor"></view>
		
		<view class="act-title">
			<text class="label">地点</text>
			<u-input class="input" v-model="act_location"></u-input>
		</view>
		<view class="divtor"></view>
		
		<view class="act-title">
			<text class="label">活动及流程</text>
			<!-- <u-input class="input"></u-input> -->
			<u-input type="textarea" placeholder="" v-model="act_content"></u-input>
			
		</view>
		<view class="divtor"></view>
		
		<q-button @click="submit()">发布</q-button>
	</view>
</template>

<script>

	import loveJsonRequestor from '../../../utils/love-json-requestor.js'
	export default {
		data() {
			return {
				act_title: '线上主题活动',
				act_datetime: '11月02, 12:00',
				act_time_duration: '1小时',
				act_location: '线上',
				act_content: '线上自我介绍，提问，匹配',
				form: {
					title: '',
					type: 10, // 活动组织type: 10
					content: '',
					longitude: 0,
					media: [],
					latitude: 0,
					topicId: 2, // 对应的活动组织的 type
					discussId: '',
					address: '',
					cut: 0,
					pay: ''
				},
			}
		},
		methods: {
			submit() {
				
				if (this.act_title.trim() == '' || 
					this.act_datetime.trim() == '' || 
					this.act_time_duration.trim() == '' || 
					this.act_location.trim() == '' ||
					this.act_content.trim() == '') {
					console.log('please fill all the info')
					return
				}
				
				this.form.title = this.act_title.trim()
				const content = loveJsonRequestor.createActivity(this.act_title, this.act_datetime, this.act_time_duration, this.act_location, this.act_content)
				
				const contentJsonString = JSON.stringify(content)
				
				this.form.content = contentJsonString
				
				
				console.log("this.form:" + JSON.stringify(this.form))
				this.$H.post('post/addPost', this.form).then(res => {
					console.log("upload:" + JSON.stringify(res))
					if (res.code == 0) {
						uni.redirectTo({
							url: '/pages/post/detail?id=' + res.result
						});
					}
					uni.hideLoading();
				});
			}
		}
	}
</script>
<style>
	page {
		background-color: #fefcff;
		height: 100%;
	}
</style>
<style lang="scss">
	
.page {
	background-color: #F6F8FC;
	height: 100%;
}

.content {
	padding: 20rpx;
	height: 100%;
	
	.act-title {
	
		.label {
			padding: 5rpx;
			color: #626163;
		}
		
		.input {
			padding: 5rpx;
			color: #191919;
		}
	}
	
	.divtor {
		background-color: #E3E3E3 ;
		height: 2rpx;
		margin: 20rpx 0;
	}
}
</style>
