<template>
	<view>
		<view><u-field type="textarea" v-model="shortInfo" label="简单版" placeholder="请填个人信息简单版本">
			</u-field>
			<u-field type="textarea" v-model="detailInfo" label="详细版" placeholder="请填个人信息详情版本">
			</u-field>
			<u-field v-model="wechatId" label="微信" placeholder="请填写微信">
			</u-field>
			<u-radio-group v-model="gender">
				<u-radio active-color="red" name="0">男</u-radio>
				<u-radio shape="circle" name="1">女</u-radio>
			</u-radio-group>
		</view>
		<u-button type="primary" @click="submit">添加个人交友信息提交</u-button>

		<block v-for="(item, index) in person_list" :key="index">
			<view>{{item}}</view>

			<u-button @click="selectUser(item)"> 选中该用户</u-button>
			<u-button type="warning" @click="update"> 修改个人信息提交</u-button>
			<u-line color="green" />
			<!-- <u-button @click=""> 删除个人信息入口</u-button> -->
		</block>
		<!-- 	<view> 活动列表，倒序排列，显示活动编号</view> -->

	</view>
</template>

<script>
	export default {
		data() {
			return {
				//    private String shortInfo; // 个人简单信息

				//     private String detailInfo; // 个人交友详情

				//     private String wechatId;

				//     private int gender; // 0 = male, 1 = female
				shortInfo: '',
				detailInfo: '',
				wechatId: '', // 哪一天
				gender: 0,
				person_list: [],
			}
		},
		onLoad() {
			this.queryPersonList()
		},
		methods: {
			submit() {
				if (this.shortInfo.trim() === '' ||
					this.detailInfo.trim() === '' ||
					this.wechatId.trim() === '') {
					this.$u.toast('请填写完信息');
					return
				}

				const form = {
					shortInfo: this.shortInfo,
					detailInfo: this.detailInfo,
					wechatId: this.wechatId,
					gender: this.gender
				}

				this.$H.post('short/person/create', form).then(res => {
					if (res.code == 0) {
						this.$u.toast('保存成功');

						this.queryPersonList()
					}
				});
			},
			update() {
				if (this.shortInfo.trim() === '' ||
					this.detailInfo.trim() === '' ||
					this.wechatId.trim() === '') {
					this.$u.toast('请填写完信息');
					return
				}

				const form = {
					shortInfo: this.shortInfo,
					detailInfo: this.detailInfo,
					wechatId: this.wechatId,
					gender: this.gender
				}

				this.$H.post('short/person/update', form).then(res => {
					if (res.code == 0) {
						this.$u.toast('修改成功');

						this.queryPersonList()
					}
				});
			},
			queryPersonList() {
				this.$H
					.get('short/person/list')
					.then(res => {
						if (res.code == 0) {
							this.person_list = res.result
						}
					});
			},
			clickAddUser(item) {
				// console.log("item:" + JSON.stringify(item))
				uni.navigateTo({ // pages/short/add_user
					url: '/pages/short/add_user?id=' + item.id
				});
			},
			selectUser(item) {
				this.shortInfo = item.shortInfo
				this.detailInfo = item.detailInfo
				this.wechatId = item.wechatId
				this.gender = item.gender
			}
		}
	}
</script>

<style>

</style>