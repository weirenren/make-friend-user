<template>
	<view class="container">
		<view v-if="is_recommend && media.length > 0" class="user-photo">
			<u-swiper :list="media"></u-swiper>
		</view>
		<view class="user-info">
			<view class="title">
				<text>{{post_title}}</text>
			</view>
			<view class="content">
				<text>{{post_content}}</text>
			</view>
			
			<u-tag v-if="checkShowMedia()" text="有照片" type="primary" size="mini"/>
		</view>
		
	</view>
</template>

<script>
	import loveJsonRequestor from '../../utils/love-json-requestor.js'
	export default {
		props: {
			post_title: {
				type: String
			},
			post_content: {
				type: String
			},
			media: {
				type: Array,
				default: ()=>[]
			},
			is_show_detail: {
				type: Boolean,
				default: true,
			},
			is_recommend: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				list: [
				],
			};
		},
		created() {
				// console.log("created:")
				// this.getPostDetail()
		},
		// onLoad(options) {
		// 	console.log("onload:")
		// 	this.getPostDetail()
		// },
		methods: {
			checkShowMedia() {
				return this.media.length > 0
			},
			// getPostDetail() {
			// 	this.$H
			// 		.get('post/detail', {
			// 			id: this.post_id
			// 		})
			// 		.then(res => {
			// 			if(res.code==500){
			// 				this.$u.toast(res.msg);
			// 				setTimeout(function() {
			// 					uni.switchTab({
			// 						url: '/pages/index/index'
			// 					});
			// 				}, 1500);
			// 			}
			// 			this.postDetail = res.result;
						
			// 			// console.log('====>',this.postDetail)
								
			// 			if (this.postDetail.type == 11) {
			// 				this.post_title =loveJsonRequestor.getExactGenderFromPost(this.postDetail.content) +' '+ this.postDetail.title
			// 				this.post_content = loveJsonRequestor.getExactContentFromPost(this.postDetail.content)
			// 			}
			
						
			// 		});
			// },
		}
	}
</script>

<style lang="scss">
	.container{
		background-color: white;
		margin: 10rpx;
		border-radius: 2%;
		display: flex;
		flex-direction: column;
		 
		
		.section {
			background-color: white;
			border-radius: 20rpx;
			padding: 15rpx;
		}
	}
	.user-photo {
		width: auto;
	    height: auto;
	  
	    vertical-align: middle;
	}
	
	.user-info {
		.title {
			color: #000;
			font-weight: bold;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		
		.content {
			color: #565656;
			font-size: 28rpx;
			overflow : hidden;
			text-overflow: ellipsis;
			word-break: break-all;
			display: -webkit-box;
			-webkit-line-clamp: 8; /* 行数*/
			-webkit-box-orient: vertical;
		}
	}

</style>