<template>
	<view>
		<u-button type="warning" @click="clickEditUser()"> 跳转编辑用户</u-button>
		<view><u-field v-model="activity_title" label="活动名称" placeholder="请填写活动名称">
			</u-field>
			<u-field v-model="activity_detail" label="活动详情" placeholder="请填写活动详情">
			</u-field>
			<u-field v-model="activity_date" label="活动日期" placeholder="请填写活动日期">
			</u-field>
		</view>

		<u-button type="primary" @click="submit">添加活动</u-button>

		<block v-for="(item, index) in activity_list" :key="index">
			<view>{{item}}</view>
			<u-button @click="seeMatchResult(item)">查看双选结果</u-button>
			<u-button type="warning" @click="slectAct(item)">选中该活动</u-button>
			<u-button type="primary" @click="updateAct(item)">修改活动</u-button>
			<u-button type="success" @click="clickAddUser(item)">给活动添加报名用户</u-button>
			<u-line color="red" />
		</block>
		<!-- 	<view> 活动列表，倒序排列，显示活动编号</view> -->

	</view>
</template>

<script>
	export default {
		data() {
			return {
				activity_title: '',
				activity_detail: '',
				activity_date: '', // 哪一天
				activity_list: [],
			}
		},
		onLoad() {
			this.queryActivityList()
		},
		methods: {
			submit() {
				if (this.activity_title.trim() === '' || this.activity_detail.trim() === '') {
					this.$u.toast('请填写完信息')
					return
				}

				const form = {
					title: this.activity_title,
					description: this.activity_detail,
					date: this.activity_date,
				}

				this.$H.post('short/activity/create', form).then(res => {
					if (res.code == 0) {
						this.$u.toast('保存成功');

						this.queryActivityList()
					}
				});
			},
			queryActivityList() {
				this.$H
					.get('short/activity/list')
					.then(res => {
						if (res.code == 0) {
							this.activity_list = res.result
						}
					});
			},
			seeMatchResult(item) {
				console.log("act:" + JSON.stringify(item))
				uni.navigateTo({ // pages/short/add_user
					url: '/pages/short/see_match?actid=' + item.id
				});
			},
			slectAct(item) {
				this.activity_title = item.title
				this.activity_detail = item.description
				this.activity_date = item.date // 哪一天
			},
			updateAct(item) {
				if (this.activity_title.trim() === '' || this.activity_detail.trim() === '') {
					this.$u.toast('请填写完信息')
					return
				}

				const form = {
					id: item.id,
					title: this.activity_title,
					description: this.activity_detail,
					date: this.activity_date,
				}

				this.$H.post('short/activity/update', form).then(res => {
					if (res.code == 0) {
						this.$u.toast('修改成功');

						this.queryActivityList()
					}
				});
			},
			clickAddUser(item) {
				// console.log("item:" + JSON.stringify(item))
				uni.navigateTo({ // pages/short/add_user
					url: '/pages/short/add_user?id=' + item.id
				});
			},
			clickEditUser() {
				uni.navigateTo({ // pages/short/add_user
					url: '/pages/short/edit_person'
				});
			}
		}
	}
</script>

<style>

</style>