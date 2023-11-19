<template>
	<view>
		<view>当前活动编号：{{activity_id}}</view>
		<u-field v-model="user_id" label="用户编号" placeholder="请填写参加活动的用户编号">
		</u-field>
		<u-button @click="submit">提交</u-button>
		<!-- <view> 显示已经参加活动的用户列表</view> -->
		<block v-for="(item, index) in user_list" :key="index">
			<view>{{item}}</view>
			<!-- 			<u-button @click="clickAddUser(item)"> 添加用户跳转入口</u-button> -->
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activity_id: '',
				user_id: '',
				user_list: []
			}
		},
		onLoad(option) {
			this.activity_id = option.id
			this.queryUserList()
		},
		methods: {
			submit() {
				if (this.user_id.trim() === '') {
					this.$u.toast('请输入完整信息')
					return
				}

				const form = {
					userId: this.user_id,
					activityId: this.activity_id
				}

				this.$H.post('short/activity/join', form).then(res => {
					if (res.code == 0) {
						this.$u.toast('保存成功');
						this.queryUserList()
					}
				});
			},
			queryUserList() {
				this.$H
					.get('short/activity/userlist', {
						activityId: this.activity_id
					})
					.then(res => {
						if (res.code == 0) {
							this.user_list = res.result
						}
					});
			},
		}
	}
</script>

<style>

</style>