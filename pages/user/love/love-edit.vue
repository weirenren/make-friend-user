<template>
	<view class="edit-content">
		<u-steps :list="list1" :current="active"></u-steps>
		<!-- 基本信息-->
		<view v-if="active === 0" class="base_info">
			<view class="info-item">
				<text class="">真实姓名</text>
				<input placeholder="请输入" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<view class="info-item1">
				<text>性别</text>

				<u-radio-group v-model="general_info_gender" placement="row" @change="generalInfoGenderChange">
					<u-radio activeColor="red" label="男" name="0">男</u-radio>
					<u-radio activeColor="red" label="女" name="1">女</u-radio>
				</u-radio-group>

			</view>
			<view class="base_line_light" />
			<view class="info-item">
				<text>身高(cm)</text>
				<input placeholder="请输入" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<view class="info-item">
				<text>生日</text>
				<input placeholder="请输入" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<view class="info-item">
				<text>微信号</text>
				<input placeholder="请输入" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<view class="info-item">
				<text>家乡</text>
				<input placeholder="请输入" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<view class="info-item">
				<text>工作所在城市</text>
				<input placeholder="请输入" placeholder-class="placeholder"></input>
			</view>
			<view class="info-item">
				<text>城市区域</text>
				<input placeholder="活动区域: 海淀/朝阳" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<view class="info-item">
				<text>学历</text>
				<input placeholder="请输入" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<view class="info-item">
				<text>学校</text>
				<input placeholder="请输入" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<view class="info-item">
				<text>职业</text>
				<input placeholder="请输入" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<!-- <view class="info-item">
				<text>收入</text>
				<input placeholder="请输入" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<view class="info-item1">
				<text>婚史</text>
				<u-radio-group v-model="general_info_wedding_state" placement="row" @change="generalInfoWeddingChange">
					<u-radio activeColor="red" label="未婚" name="0">未婚</u-radio>
					<u-radio activeColor="red" label="离异" name="1">离异</u-radio>
					<u-radio activeColor="red" label="已婚" name="2">已婚</u-radio>
				</u-radio-group>
			</view>
			<view class="base_line_light" /> -->
			<view class="info-item">
				<u-checkbox-group>
					<u-checkbox v-model="general_info_show_gongzhonghao" shape="circle" label="挂牌发布到微信公众号"></u-checkbox>
				</u-checkbox-group>

			</view>
			<view class="base_line_light" />

		</view>

		<view v-if="active === 1" class="base_info">

			<view class="info-item">
				<text class="">TA的年龄</text>
				<input placeholder="请输入 (25-36)" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<view class="info-item">
				<text>TA的身高(cm)</text>
				<input placeholder="请输入" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<view class="info-item">
				<text>TA的工作所在地</text>
				<input placeholder="请输入" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<view class="info-item">
				<text>TA的学历</text>
				<input placeholder="请输入" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<view class="info-item">
				<text>学校</text>
				<input placeholder="请输入" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<view class="info-item">
				<text>职业</text>
				<input placeholder="请输入" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<!-- 	<view class="info-item">
				<text>TA的收入</text>
				<input placeholder="请输入" placeholder-class="placeholder"></input>
			</view>
			<view class="base_line_light" />
			<view class="info-item1">
				<text>TA的婚史</text>
				<u-radio-group v-model="general_info_wedding_state" placement="row" @change="generalInfoWeddingChange">
					<u-radio activeColor="red" label="0" name="0">不限</u-radio>
					<u-radio activeColor="red" label="1" name="1">未婚</u-radio>
				</u-radio-group>
			</view>
			<view class="info-item1">
				<text>TA的购房情况</text>
				<u-radio-group v-model="general_info_wedding_state" placement="row" @change="generalInfoWeddingChange">
					<u-radio activeColor="red" label="0" name="0">不限</u-radio>
					<u-radio activeColor="red" label="1" name="1">已购</u-radio>
				</u-radio-group>
			</view> -->
			<!-- <view>
				<text>对TA的禁忌</text>
				<u-textarea v-model="value1" placeholder="职业/地域/外形" ></u-textarea>
			</view>
			 -->
			<view class="info-textarea">
				<text>对TA的期待</text>
				<u-input type="textarea" placeholder="例如: 职业/地域/外形/偏好" ></u-input>
							
				<!-- <u--textarea name="hope" placeholder="例如: 职业/地域/外形/偏好" confirmType="done"></u--textarea> -->
			</view>

			<view class="base_line_light" />

		</view>

		<!-- 心中的ta -->

		<view v-if="active === 2" class="base_info">
			<view class="info-textarea">
				<text>自我介绍</text>
				<u-input type="textarea" placeholder="可以介绍自己的兴趣爱好 求学经历等等展现自己的闪光点" ></u-input>
				<!-- <u--textarea name="hope" placeholder="可以介绍自己的兴趣爱好 求学经历等等展现自己的闪光点" confirmType="done"></u--textarea> -->
			</view>
			<view class="base_line_light" />
			<view class="info-textarea">
				<text>情感经历</text>
				<u-input type="textarea" placeholder="实可靠就行" ></u-input>
				
				<!-- <u--textarea name="hope" placeholder="真实可靠就行" confirmType="done"></u--textarea> -->
			</view>
			<view class="base_line_light" />
			<view class="info-textarea">
				<text>个人照片</text>
				<u-upload ref="uUpload" :size-type="['original']" name="Image" :max-count="9" @on-uploaded="submit"
					:auto-upload="false"></u-upload>
				<view class="base_line_light" />

				<!-- 	<u-upload
				ref="uUpload"
				:size-type="['original']"
				name="Image"
				:max-count="9"
				:header="header"
				:action="uploadImgUrl"
				@on-uploaded="submit"
				:auto-upload="false"
			></u-upload> -->
			</view>
		</view>

		<view v-if="active === 3" class="base_info">
			<love-user-preview></love-user-preview>
		</view>

		<view class="fix-bottom-step">
			<view class="next-step">
				<u-button type="primary" size="mini" style="margin: 30px 10px; width: 100px;" @click="changeToLastStep">
					{{ lastStep }}
				</u-button>
				<u-button type="primary" size="mini" style="margin: 30px 10px; width: 100px;" @click="changeToNextStep">
					{{ nextStep }}
				</u-button>
			</view>
		</view>


	</view>
</template>

<script>
	import loveUserPreview from '../../../components/love-user-preview/love-user-preview.vue'
	export default {
		components: {},
		data() {
			return {
				active: 0,
				lastStep: '上一步',
				nextStep: '下一步',
				list1: [{
					name: '基础资料'
				}, {
					name: '心中的TA'
				}, {
					name: '详细资料'
				}, {
					name: '预览提交'
				}],
				general_info_gender: 0,
				general_info_wedding_state: 0,
				general_info_show_gongzhonghao: false,
				general_info: {
					name: '',
					gender: 0, // 0 = 男，1 = 女
					height: 0,
					birthday: '1990-03-10',
					wechat_id: '',

					hometown: '',
					work_place: '',
					edu_backgrond: '',
					colleage_name: '',
					work_name: '', // 职业
					salary: '', // 
					wedding_state: 0, // 0 = 未婚，1 = 离婚，2 = 已婚

					show_gongzhonghao: false // 是否挂牌公众号

				}
			}
		},
		methods: {
			changeToLastStep() {
				if (this.active < this.list1.length && this.active > 0) {
					this.active -= 1
				} else {
					this.active = 0
				}
				this.changeButtonState()
			},
			changeToNextStep() {
				if (this.active < this.list1.length - 1) {
					this.active += 1
				}
				this.changeButtonState()
			},
			changeButtonState: function() {
				if (this.active === 3) {
					this.nextStep = '提交'
				} else {
					this.nextStep = '下一步'
				}
			},
			generalInfoGenderChange(gender) {
				this.general_info.gender = gender
			},
			generalInfoWeddingChange(wedding) {
				this.general_info.wedding_state = wedding
			},
			generalInfoShowGZHChange(show) {
				this.general_info.show_gongzhonghao = show
			},
			submit() {

			}
		}
	}
</script>



<style lang="scss">
	input {
		text-align: right;
	}

	.edit-content {
		padding-bottom: 100rpx;
	}

	.base_line_light {
		background-color: #f7f7f7;
		height: 2rpx;
		margin-left: 20rpx;
	}

	.base_line_gray {
		background-color: #8c9ab8;
		margin-left: 5rpx;
	}



	.base_info {
		.info-item {
			display: flex;
			justify-content: space-between;
			padding: 20rpx;
			font-weight: bold;

			.placeholder {
				color: pink;
				font-weight: bold;
			}
		}

		.info-item1 {
			display: flex;
			justify-content: space-between;
			padding: 20rpx;
			font-weight: bold;

			/deep/ .u-radio-group {
				flex: initial;

				/deep/ .u-radio {
					margin-right: 10rpx;
				}
			}
		}

		.info-textarea {
			display: flex;
			flex-direction: column;
			padding: 20rpx;
			font-weight: bold;

			.placeholder {
				color: pink;
				font-weight: bold;
			}
		}
	}

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


	.status-btn {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 92rpx;
		margin: 30rpx;
		background-color: #007AFF;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 15px;
		flex-direction: row;
	}
</style>
