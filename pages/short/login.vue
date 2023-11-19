<template>
	<view>
		<view>
			<u-field v-model="activity_id" label="活动编号" placeholder="请填写活动编号">
			</u-field>
			<u-field v-model="user_id" label="用户编号" placeholder="请填写用户编号">
			</u-field>
		</view>
		<u-button @click="login()">登录</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activity_id: '1',
				user_id: '306917331@vph'
			}
		},
		methods: {
			login() {
				if (this.activity_id.trim() === '' ||
					this.user_id.trim() === '') {
					this.$u.toast('请输入完整信息');
					return
				}

				const form = {
					userId: this.user_id,
					activityId: this.activity_id
				}

				this.$H.post('short/person/login', form).then(res => {
					if (res.code == 0) {
						this.$u.toast('保存成功');

						uni.navigateTo({ // pages/short/add_user
							url: '/pages/short/match?uid=' + this.user_id + '&actid=' + this.activity_id
						});

						this.queryPersonList()
					}
				});
			},
			submit() {
				this.$refs.uToast.show({
					title: '登录成功',
					type: 'success',
				})
			}
		}
	}
</script>

<style>

</style>