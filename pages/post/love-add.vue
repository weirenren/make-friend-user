<template>
	<view class="container">
		<u-radio-group v-model="general_info_gender" placement="row" @change="generalInfoGenderChange">
			<u-radio activeColor="#A6AEF5" label="男" name="0">男</u-radio>
			<u-radio activeColor="#A6AEF5" label="女" name="1">女</u-radio>
		</u-radio-group>
		<divider></divider>
		<input v-model="form.title" class="title-input" placeholder="标题 (一句话介绍自己)" />
		<divider></divider>
		<textarea placeholder="填写单身交友帖子 (个人基本信息, 喜好/闪光点; 择偶要求,最在意的两三点等待)" :auto-height="true" maxlength="-1" v-model="form.content"
			class="post-txt"></textarea>
		<divider></divider>
		<!-- 帖子格式的交友信息 -->
		<input v-model="wechatId" class="title-input" placeholder="个人微信 (默认隐藏, 群主会联系)" />
		<divider></divider>
		<block >
			<!--
			<u-upload
				ref="uUpload"
				:size-type="['original']"
				name="Image"
				:max-size="1 * 1024 * 1024"
				:max-count="5"
				:header="header"
				:action="uploadImgUrl"
				@on-uploaded="submit"
				:auto-upload="false"
			></u-upload> 
			-->
			<cl-upload class="upload" ref="uUpload" @input="onFileChange" @onFileChange="onFileChange" :imageFormData="imageFormData"
				:isPreviewImage="true" fileType="image" :action="uploadImgUrl" :autoUpload="false">

			</cl-upload>
		</block>
		<!-- 严格格式的交友信息 -->
		<block v-if="form.type == 12">
			<u-upload ref="uUpload" :size-type="['original']" :max-size="1 * 1024 * 1024" name="Image" :max-count="5"
				:header="header" :action="uploadImgUrl" @on-uploaded="submit" :auto-upload="false"></u-upload>
		</block>

		<!-- 选择圈子 -->
		<navigator v-if="isTopic" url="/pages/choose-topic/choose-topic" class="choose-item">
			<image class="icon" src="/static/p_1.png"></image>
			<text class="txt">{{ topicName }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</navigator>
		<!-- 选择话题 -->
		<navigator v-if="showView&&form.topicId" :url="'/pages/choose-discuss/choose-discuss?topicId=' + form.topicId"
			class="choose-item">
			<image class="icon" src="/static/m_1.png"></image>
			<text class="txt">{{ disName }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</navigator>
		<!-- 帖子类型 -->
		<view v-if="showView" class="choose-item">
			<image class="icon" src="/static/m_3.png"></image>
			<text class="txt">类型|{{typeName}}</text>
			<!-- <u-switch class="sw" v-model="switch2" activeColor="#5ac725" inactive-color="#eee" @change="change"></u-switch> -->
			<u-radio-group class="radio" v-model="radiovalue1" placement="row" @change="groupChange">
				<u-radio v-for="(item, index) in radiolist1" :key="index" :label="item.name" :name="item.name"
					@change="radioChange">
				</u-radio>
			</u-radio-group>
		</view>
		<!-- 付费贴价格 -->
		<view class="choose-item" v-if="showView&&form.cut==1">
			<image class="icon" src="/static/price.png"></image>
			<text class="txt">付费贴单价</text>
			<u-input class="inputStyle" placeholder="付费金额(小数点两位以内)" :border="true" type="digit" clearable
				v-model="form.pay" @change="inputChange"></u-input>
		</view>
		<!-- 所在位置 -->
		<view v-if="showView" @click="chooseLocation" class="choose-item">
			<u-icon class="icon add-icon" name="map" color="#999" size="40"></u-icon>
			<text class="txt">{{ form.address || '所在位置' }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</view>
		<view class="submit-btn">
			<q-button @click="uploadImg" shape="circle">发布</q-button>
			<!-- <q-button v-if="form.type == 2" @click="videoSubmit" shape="circle">发布</q-button> -->
		</view>
	</view>
</template>

<script>
	import loveJsonRequestor from '../../utils/love-json-requestor.js'
	import divider from '../../components/divider/divider.vue'
	export default {
		data() {
			return {
				showView: false,
				uploadImgUrl: this.$c.domain + 'common/uploadImg',
				topicName: '选择圈子',
				disName: '选择话题',
				typeName: '普通贴',
				uploadFiles: [],
				wechatId: '',
				form: {
					title: '',
					type: 11,
					topicId: '',
					discussId: '',
					content: '',
					media: [],
					longitude: 0,
					latitude: 0,
					address: '',
					cut: 0,
					pay: '',
				},
				header: {
					token: uni.getStorageSync('token')
				},
				general_info_gender: 0,
				imageFormData: {
					count: 3,
					// sizeType: ['compressed'],
					compress: true,
					quality: 50,
					sourceType: ['album']
				},
				isTopic: true,
				switch2: 0,
				// 基本案列数据
				radiolist1: [{
						name: '普通贴',
						disabled: false
					},
					{
						name: '付费贴',
						disabled: false
					}
				],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				radiovalue1: '普通贴',
			};
		},
		onLoad(options) {
			this.form.type = 11;

			if (options.isTopic) {
				this.isTopic = options.isTopic;
			}

			if (options.topicId) {
				this.form.topicId = options.topicId;
				this.isTopic = false;
			}
			if (options.discussId) {
				this.form.discussId = options.discussId;
			}

			let location = uni.getStorageSync('location_info');
			this.form.longitude = location.longitude;
			this.form.latitude = location.latitude;
		},
		methods: {
			onFileChange(files) {
				this.uploadFiles = files
			},
			inputChange(n) {},
			groupChange(n) {},
			radioChange(n) {

				if (n == '普通贴') {
					this.form.cut = 0;
					this.typeName = '普通贴';
				} else if (n == '付费贴') {
					this.form.cut = 1;
					this.typeName = '付费贴';
				}
			},
			change(e) {
				if (e) {
					// console.log('111');
					this.form.topicId = 3;
				} else {
					this.form.topicId = 2;
					// console.log('222');
				}
			},
			generalInfoGenderChange(gender) {
				this.general_info_gender = parseInt(gender)
			},
			uploadImg() {
				if (!this.form.topicId) {
					this.$u.toast('请选择圈子');
					return;
				}

				if (!this.form.content) {
					this.$u.toast('内容不能为空');
					return;
				}
				if (!this.form.title) {
					this.$u.toast('标题不能为空');
					return;
				}
				if (!this.wechatId) {
					this.$u.toast('微信不能为空');
					return;
				}
				if (this.form.cut == 1) {
					// var ret=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
					// if(!ret.test(this.form.pay)){
					// 	this.$u.toast('输入金额不合法');
					// 	return;
					// }
					// if(this.form.pay<=0){
					// 	this.$u.toast('输入金额必须大于0');
					// 	return;
					// }
					// if(this.form.pay>100){
					// 	this.$u.toast('输入金额必须小于100');
					// 	return;
					// }
				}
				uni.showLoading({
					mask: true,
					title: '发布中'
				});
				// this.$refs.uUpload.upload();


				if (this.uploadFiles.length > 0) {
					this.$refs.uUpload.submit().then(result => {
						// console.log("upload:" + JSON.stringify(result))
						const imagesUrls = []
						result.forEach((item, index) => {
							imagesUrls.push(item.result)
						})
						this.submitPost(imagesUrls)
					})
				} else {
					this.submitPost([])
				}
			},
			chooseLocation() {
				let that = this;
				uni.chooseLocation({
					success: function(res) {
						that.form.address = res.name;
						that.form.latitude = res.latitude;
						that.form.longitude = res.longitude;
					}
				});
			},
			submitPost(medias) {
				uni.showLoading({
					mask: true,
					title: '发布中'
				});

				let mediaList = [];
				medias.forEach(function(item, index) {
					mediaList.push(item);
				});

				this.form.media = mediaList;
				// 使用原来content 存放json格式的交友帖子信息；
				this.form.content = JSON.stringify(loveJsonRequestor.createCommonPost('beijing', this.general_info_gender,
					this.form.title, this.form.content, this.wechatId))


				// console.log("this.form:" + JSON.stringify(this.form))
				this.$H.post('post/addPost', this.form).then(res => {
					// console.log("upload:" + JSON.stringify(res))
					if (res.code == 0) {
						uni.redirectTo({
							url: '/pages/post/detail?id=' + res.result
						});
					}
					uni.hideLoading();
				});
			},
			submit(e) {
				uni.showLoading({
					mask: true,
					title: '发布中'
				});

				let mediaList = [];
				e.forEach(function(item, index) {
					mediaList.push(item.response.result);
				});

				this.form.media = mediaList;

				// 使用原来content 存放json格式的交友帖子信息；
				this.form.content = JSON.stringify(loveJsonRequestor.createCommonPost('beijing', this.general_info_gender,
					this.form.title, this.form.content))

				// console.log('json:' + this.form)
				this.$H.post('post/addPost', this.form).then(res => {
					if (res.code == 0) {
						uni.redirectTo({
							url: '/pages/post/detail?id=' + res.result
						});
					}
					uni.hideLoading();
				});
			}
		}
	};
</script>
<style>
	page {
		background-color: #fefcff;
		height: 100%;
	}
</style>
<style lang="scss" scoped>
	.container {
		background-color: #f5f5f5;
		height: 100%;
	}

	.title-input {
		border-bottom: 1px solid #F5F5F5;
		font-size: 26rpx;
		margin: 10rpx 0;
		padding: 10rpx 0;
	}
	
	.upload {
		margin-top: 20rpx;
	}

	.post-txt {
		width: 100%;
		padding: 20rpx 0;
		min-height: 300rpx;
		font-size: 26rpx;
	}

	.upload-wrap {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 180rpx;
		height: 180rpx;
		background-color: #F5F5F5;
		margin-top: 30rpx;
		border-radius: 10rpx;

		.icon {
			width: 50rpx;
			height: 50rpx;
		}

		text {
			font-size: 24rpx;
		}
	}

	.upload-video {
		width: 180rpx;
		height: 180rpx;
		margin-top: 30rpx;
	}

	.choose-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1px solid #F5F5F5;

		&:last-child {
			border: 0;
		}

		.txt {
			margin-left: 20rpx;
		}

		.sw {
			margin-left: 300rpx;
		}

		.inputStyle {
			margin-left: 60rpx;
			width: 400rpx;
		}

		.radio {
			margin-left: 320rpx;
		}

		.icon {
			width: 40rpx;
			height: 40rpx;
		}

		.u-icon {
			margin-left: auto;
			color: #999;
		}

		.add-icon {
			margin-left: 0;
		}
	}

	.submit-btn {
		margin-top: 50rpx;
		color: #F4F4F5;
	}
</style>