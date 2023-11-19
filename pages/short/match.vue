<template>
	<view>
		<view>活动名称：{{activity_title}}</view>
		<view>活动日期：{{activity_date}}</view>
		<view>活动详情：</view>
		<view>{{activity_detail}}</view>
		<u-line color="green" />
		<u-line color="green" />
		<u-line color="green" />
		<view>互相选择原则：</view>
		<view>1.达到60分的感觉</view>
		<view>2.对方某些点让自己产生好奇感</view>
		<u-line color="black" />
		<u-line color="black" />
		<u-line color="black" />
		<view>个人交友帖子详情：</view>
		<view>{{personal_detail}} </view>
		<view>性别：{{ getGenderText(personal_gender) }}</view>
		<u-line color="red" />
		<u-line color="red" />
		<u-line color="red" />

		<block v-if="!hasMatched">请完成下面的交友选择：</block>
		<block v-else> 匹配结果如下：</block>
		<u-line color="red" />
		<block v-for="(item, index) in pending_matchList" :key="index">

			<view>{{item.shortInfo}}</view>
			<view>性别: {{ getGenderText(item.gender) }}</view>
			<u-radio-group v-model="item.select" @change="radioGroupChange(item)">
				<u-radio active-color="red" name="1" :disabled="hasMatched">可以了解</u-radio>
				<u-radio shape="circle" name="0" :disabled="hasMatched">不想了解</u-radio>
			</u-radio-group>
			<u-line color="red" />
		</block>

		<u-toast ref="uToast" />
		<u-button v-if="!hasMatched" @click="submit">提交</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hasMatched: false,
				personal_info: '90年，985本科，程序员，个人爱好，健身，社交',
				activity_title: '',
				activity_date: '',
				activity_detail: '',
				personal_short: '',
				personal_detail: '',
				personal_gender: -1,
				activity_id: '',
				from_uid: '',
				pending_matchList: [
					// {
					// 	person: "本科，男1",
					// 	gender: 0,
					// 	select: -1, // 初始值
					// },
					// {
					// 	person: "本科，男2",
					// 	gender: 0,
					// 	select: -1,
					// },
				],
				match_result: [], // 选择结果列表

			}
		},
		onLoad(options) {
			// 如果已经选择，则直接查看结果
			this.activity_id = options.actid

			this.checkIfMatch(options.uid, options.actid, () => {
				this.requestActivityInfo(this.activity_id)
				this.requestPersonInfo(options.uid)

			})
		},
		methods: {

			checkIfMatch(fromUid, activityId, callback) {
				this.$H
					.post('short/person/getmatch', {
						fromUid: fromUid,
						activityId: activityId
					})
					.then(res => {
						if (res.code == 0) {
							if (res.result) {
								this.hasMatched = true
								const result = res.result

								this.personal_short = result.personalShort
								this.personal_detail = result.personalDetail
								this.activity_date = result.activityDate
								this.personal_gender = result.personGender
								this.activity_title = result.activityTitle
								this.activity_detail = result.activityDetail

								result.matchResults.forEach(item => {
									const taPerson = {
										shortInfo: item.shortPersonInfo,
										gender: item.gender,
										select: item.likeType, // 初始值
									}

									this.pending_matchList.push(taPerson)
								})

								// console.log("res:" + JSON.stringify(result))

							} else {
								callback(1)
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