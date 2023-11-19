<template>
	<view>
		<pre>{{result}}</pre>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				result: '没有人参加'
			}
		},
		onLoad(options) {
			// 如果已经选择，则直接查看结果
			this.activity_id = options.actid

			this.requesrSeeMatch(options.uid, options.actid)
		},
		methods: {

			requesrSeeMatch(fromUid, activityId, callback) {
				this.$H
					.post('short/activity/seematch', {
						fromUid: 'wei306917331',
						activityId: activityId
					})
					.then(res => {
						if (res.code == 0) {
							if (res.result) {

								this.result = res.result

								// console.log("match result:" + JSON.stringify(result))

								// this.personal_short = result.personalShort
								// this.personal_detail = result.personalDetail
								// this.activity_date = result.activityDate
								// this.personal_gender = result.personGender
								// this.activity_title = result.activityTitle
								// this.activity_detail = result.activityDetail

								// result.matchResults.forEach(item => {
								// 	const taPerson = {
								// 		shortInfo: item.shortPersonInfo,
								// 		gender: item.gender,
								// 		select: item.likeType, // 初始值
								// 	}

								// 	this.pending_matchList.push(taPerson)
								// })

								// console.log("res:" + JSON.stringify(result))

							}


							// this.pending_matchList = []
							// res.result.forEach(item => {
							// 	if (item.gender !== gender) {
							// 		item.select = -1
							// 		this.pending_matchList.push(item)
							// 	}
							// })
							// callback(1)

						}
					});
			},

			getGenderText(gender) {
				if (gender == -1) return ''
				return gender == 0 ? '男' : '女'
			},
			requestActivityPerson(activityId, gender) {
				this.$H
					.get('short/activity/userlist', {
						activityId: activityId
					})
					.then(res => {
						if (res.code == 0) {
							this.pending_matchList = []
							res.result.forEach(item => {
								if (item.gender !== gender) {
									item.select = -1
									this.pending_matchList.push(item)
								}
							})

						} else {
							this.$refs.uToast.show({
								title: '账号不存在',
								type: 'error',
							})
						}
					});
			},
			requestPersonInfo(unicode) {
				this.$H
					.get('short/person/one', {
						uid: unicode
					})
					.then(res => {
						if (res.code == 0 && res.result) {
							this.from_uid = res.result.id
							this.personal_short = res.result.shortInfo
							this.personal_detail = res.result.detailInfo
							this.personal_gender = res.result.gender

							this.requestActivityPerson(this.activity_id, res.result.gender)
						} else {
							this.$refs.uToast.show({
								title: '账号不存在',
								type: 'error',
							})
						}
					});
			},
			requestActivityInfo(activity_id) {
				this.$H
					.get('short/activity/one', {
						actid: activity_id
					})
					.then(res => {
						if (res.code == 0) {
							this.activity_title = res.result.title
							this.activity_detail = res.result.description
							this.activity_date = res.result.date
						} else {
							this.$refs.uToast.show({
								title: '活动不存在',
								type: 'error',
							})
						}
					});
			},
			radioGroupChange(person) {

				// console.log(JSON.stringify(this.pending_matchList))
			},
			submit() {
				for (var i = 0; i < this.pending_matchList.length; i++) {
					const matcherPerson = this.pending_matchList[i]
					if (matcherPerson.select === -1) {
						this.$refs.uToast.show({
							title: '需要选择完全',
							type: 'error',
						})
						return
					}
					const matchResult = {
						toUid: matcherPerson.id,
						likeType: matcherPerson.select,
					}
					this.match_result.push(matchResult)
				}

				//     private String fromUid;


				//     private String toUid;

				//     private Integer likeType;

				//     private Integer activityId;

				const form = {
					fromUid: this.from_uid,
					matchers: this.match_result,
					activityId: this.activity_id
				}

				// console.log("res:" + JSON.stringify(form))

				this.$H.post('short/person/domatch', form).then(res => {
					if (res.code == 0) {

						this.$refs.uToast.show({
							title: '提交成功',
							type: 'success',
						})
						// this.$u.toast('保存成功');

						// uni.navigateTo({ // pages/short/add_user
						// 	url: '/pages/short/match?uid=' + this.user_id + '&actid=' + this.activity_id
						// });

						// this.queryPersonList()
					} else {

						// this.$refs.uToast.show({
						// 	title: '提交失败',
						// 	type: 'error',
						// })
					}
				});

			},
			// showToast() {
			// 	this.$refs.uToast.show({
			// 		title: '提交成功',
			// 		type: 'success',
			// 	})
			// }
		}
	}
</script>

<style>

</style>