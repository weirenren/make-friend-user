<template>
	<view class="container">
		<input v-model="form.title" class="title-input" placeholder="标题" />
		<textarea placeholder="说些什么叭..." :auto-height="true" maxlength="-1" v-model="form.content" class="post-txt"></textarea>
		<!-- 上传图片 -->
		<block v-if="form.type == 1">
			<u-upload
				ref="uUpload"
				:size-type="['original']"
				name="Image"
				:max-count="9"
				:header="header"
				:action="uploadImgUrl"
				@on-uploaded="submit"
				:auto-upload="false"
			></u-upload>
		</block>
		<!-- 上传视频 -->
		<block v-if="form.type == 2">
			<view v-if="form.media.length == 0" class="upload-wrap" @click="chooseVideo">
				<image class="icon" src="/static/video.png"></image>
				<text>上传视频</text>
			</view>
			<video v-if="form.media.length > 0" @click="chooseVideo" :controls="false" :show-center-play-btn="false" class="upload-video" :src="form.media[0]"></video>
		</block>
		<!-- 选择圈子 -->
		<navigator v-if="isTopic" url="/pages/choose-topic/choose-topic" class="choose-item">
			<image class="icon" src="/static/p_1.png"></image>
			<text class="txt">{{ topicName }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</navigator>
		<!-- 选择话题 -->
		<navigator v-if="form.topicId" :url="'/pages/choose-discuss/choose-discuss?topicId=' + form.topicId" class="choose-item">
			<image class="icon" src="/static/m_1.png"></image>
			<text class="txt">{{ disName }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</navigator>
		<!-- 帖子类型 -->
		<view class="choose-item">
			<image class="icon" src="/static/m_3.png"></image>
			<text class="txt">类型|{{typeName}}</text>
			<!-- <u-switch class="sw" v-model="switch2" activeColor="#5ac725" inactive-color="#eee" @change="change"></u-switch> -->
			  <u-radio-group
				class="radio"
			    v-model="radiovalue1"
			    placement="row"
			    @change="groupChange"
			  >
			    <u-radio
			      v-for="(item, index) in radiolist1"
			      :key="index"
			      :label="item.name"
			      :name="item.name"
			      @change="radioChange"
			    >
			    </u-radio>
			  </u-radio-group>
		</view>
		<!-- 付费贴价格 -->
		<view class="choose-item" v-if="form.cut==1">
			<image class="icon" src="/static/price.png"></image>
			<text class="txt">付费贴单价</text>
			  <u-input
				class="inputStyle"
			    placeholder="付费金额(小数点两位以内)"
			    border="surround"
				type="digit"
				clearable
			    v-model="form.pay"
			    @change="inputChange"
			  ></u-input>
		</view>
		<!-- 所在位置 -->
		<view @click="chooseLocation" class="choose-item">
			<u-icon class="icon add-icon" name="map" color="#999" size="40"></u-icon>
			<text class="txt">{{ form.address || '所在位置' }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</view>
		<view class="submit-btn">
			<q-button v-if="form.type == 1" @click="uploadImg" shape="circle">发布</q-button>
			<q-button v-if="form.type == 2" @click="videoSubmit" shape="circle">发布</q-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			uploadImgUrl: this.$c.domain + 'common/upload',
			topicName: '选择圈子',
			disName: '选择话题',
			typeName: '普通贴',
			form: {
				title: '',
				type: 1,
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
			isTopic: true,
			switch2:0,
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
		this.form.type = options.type;

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
		inputChange(n){
		},
	    groupChange(n) {
	    },
	    radioChange(n) {
		  
		  if(n=='普通贴'){
			  this.form.cut=0;
			  this.typeName='普通贴';
		  }else if(n=='付费贴'){
			  this.form.cut=1;
			  this.typeName='付费贴';
		  }
	    },
		change(e) {
			if(e){
				// console.log('111');
				this.form.topicId=3;
			}else{
				this.form.topicId=2;
				// console.log('222');
			}
		},
		chooseVideo() {
			var self = this;
			uni.chooseVideo({
				count: 1,
				sourceType: ['camera', 'album'],
				success: function(res) {
					let viedoPath = res.tempFilePath;

					uni.showLoading({
						mask: true,
						title: '上传中'
					});

					uni.uploadFile({
						url: self.$c.domain + 'common/upload',
						filePath: viedoPath,
						name: 'Image',
						header: {
							token: uni.getStorageSync('token')
						},
						success: uploadFileRes => {
							let upData = JSON.parse(uploadFileRes.data);
							if (upData.code == 0) {
								self.form.media.push(upData.result);
							}
						},
						complete() {
							uni.hideLoading();
						}
					});
				}
			});
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
			if(this.form.cut==1){
				var ret=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
				if(!ret.test(this.form.pay)){
					this.$u.toast('输入金额不合法');
					return;
				}
				if(this.form.pay<=0){
					this.$u.toast('输入金额必须大于0');
					return;
				}
				if(this.form.pay>100){
					this.$u.toast('输入金额必须小于100');
					return;
				}
			}
			uni.showLoading({
				mask: true,
				title: '发布中'
			});
			this.$refs.uUpload.upload();
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
		videoSubmit() {
			if (this.form.media.length == 0) {
				this.$u.toast('请上传视频');
				return;
			}

			if (!this.form.topicId) {
				this.$u.toast('请选择圈子');
				return;
			}
			uni.showLoading({
				mask: true,
				title: '发布中'
			});
			this.$H.post('post/addPost', this.form).then(res => {
				if (res.code == 0) {
					uni.redirectTo({
						url: '/pages/post/video-detail?id=' + res.result
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

<style lang="scss" scoped>
.title-input{
	border-bottom: 1px solid #F5F5F5;
	margin: 20rpx 0;
	padding: 20rpx 0;
}
.post-txt {
	width: 100%;
	padding: 20rpx 0;
	min-height: 300rpx;
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
	.icon{
		width: 50rpx;
		height: 50rpx;
	}
	
	text{
		font-size: 24rpx;
	}
}

.upload-video{
	width: 180rpx;
	height: 180rpx;
	margin-top: 30rpx;
}

.choose-item{
	display: flex;
	align-items: center;
	padding: 20rpx;
	border-bottom: 1px solid #F5F5F5;
	&:last-child{
		border: 0;
	}
	.txt{
		margin-left: 20rpx;
	}
	.sw{
		margin-left: 300rpx;
	}
	.inputStyle{
		margin-left: 60rpx;
		width: 400rpx;
	}
	.radio{
		margin-left: 320rpx;
	}
	.icon{
		width: 40rpx;
		height: 40rpx;
	}
	.u-icon{
		margin-left: auto;
		color: #999;
	}
	
	.add-icon{
		margin-left: 0;
	}
}

.submit-btn{
	margin-top: 50rpx;
	color: #F4F4F5;
}
</style>
