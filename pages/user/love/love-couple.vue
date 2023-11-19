<template>
	<view class="container">
		<view class="head">
			<view style="margin: 0 5rpx;">💗</view>
			<view style="font-size: 40rpx;">匹配成功！</view>
		</view>
		<view class="wechat" v-if="show_wechat">
			<view class="lab">可以加微信交流啦,TA的微信: </view>
			<view class="value">{{wechat}}</view>
		</view>
		<view class="body" v-for="step in steps" :key="step.step_index">
			<love-couple-step :step_index="step.step_index" :step_description="step.step_description"
				:step_day="step.step_day" :step_status="step.step_status">
			</love-couple-step>
		</view>

		<u-button v-if="currentStepStatus.active && currentStepStatus.active == 1" class="bottom" @click="showCancelPopup = true">中止接触</u-button>

		<u-modal @confirm="confirm" v-model="step_task_tip_show" :showConfirmButton="hide_confim_button? true : true"
			:showCancelButton="hide_confim_button? false : true" width="400rpx">{{step_task_tip_content}}</u-modal>

		<!-- 	<u-modal v-if="showCancelPopup" @confirm="" v-model="" :showConfirmButton="true"
			:showCancelButton="true" width="500rpx"> 对方没兴趣了</u-modal> -->
		<u-popup v-model="showCancelPopup" mode="center">
			<view>
				<text>请简单描述中止与对方进一步接触的原因</text>
				<u-input v-model="cancelInputContent" type="text" :border="true" />
				<q-button @click="submitCancelCPtask()">确定</q-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import LoveCoupleStep from '../../../components/love-couple-step/love-couple-step.vue'

	export default {
		data() {
			return {
				show_wechat: false,
				wechat: "306917331",
				step_task_tip_content: "您是愿意和对方一起玩心动任务打卡游戏？",
				step_task_tip_show: false,
				hide_confim_button: false,
				showCancelPopup: false,
				cancelInputContent: '',
				currentStepStatus: {},

				ta_uid: -1,
				current_step_index: -1, // 0初始状态，需要等对方是否确认玩这个游戏，双方确认了，才能看到对方等微信
				steps: [{
						step_index: 1,
						step_description: "已添加微信？",
						step_day: 1,
						step_status: 0
					},
					{
						step_index: 2,
						step_description: "已文字聊天？",
						step_day: 1,
						step_status: 0
					},
					{
						step_index: 3,
						step_description: "已语音聊天？",
						step_day: 2,
						step_status: 0
					},
					{
						step_index: 4,
						step_description: "已预约线下见面？",
						step_day: 1,
						step_status: 0
					},
					{
						step_index: 5,
						step_description: "已经线下见面接触？",
						step_day: 5,
						step_status: 0
					},
					{
						step_index: 6,
						step_description: "已经给予对方见面反馈？",
						step_day: 1,
						step_status: 0
					}
				]
			}
		},
		onLoad: function(options) {
			if (options.ta_uid) {
				this.ta_uid = options.ta_uid;
			}

			if (this.ta_uid == -1) {
				return
			}
			this.loadStepStatus()
		},
		methods: {

			// loadStepTipPopwindow() {
			// 	console.log("index:" + this.current_step_index)

			// 	if (this.current_step_index == 0) {
			// 		this.step_task_tip_show = true
			// 		// 1.同意玩法，调用接口获取对方威信号
			// 		// 2.附带付款确认信息，微信付款备注时间，个人微信号

			// 		return
			// 	}

			// 	for (var i = 0; i < this.steps.length; i++) {
			// 		const item = this.steps[i]
			// 		if (item.step_status == 0) {
			// 			this.current_step_index = item.step_index
			// 			break
			// 		}
			// 	}

			// 	if (this.current_step_index <= this.steps.length) {
			// 		this.step_task_tip_show = true
			// 		this.step_task_tip_content = this.steps[this.current_step_index - 1].step_description
			// 	} else {
			// 		// over 
			// 	}
			// },


			submitCancelCPtask() {

				const cancelReason = this.cancelInputContent.trim()
				if (cancelReason.length < 10) {
					this.$u.toast('输入内容过短，需大于十个字');
					return
				}
				if (cancelReason.indexOf("_") != -1) {
					this.$u.toast('不能包含非汉字字符');
					return
				}
				if (this.currentStepStatus.active != 1) {
					return
				}
				this.showCancelPopup = false

				this.$H.post('love/cp/cancelTask', {
					taUid: this.ta_uid,
					cancelReason: cancelReason
				}).then(res => {

					// if (callback) {
					// 	callback({
					// 		wechat: "306917331",
					// 		stepIndex: 0
					// 	})
					// }

					if (res.code != 0) {
						this.$u.toast('非法字符');
						return
					}
					
					if (res.code == 0) {
						this.loadStepStatus()
					}

					// if (callback) {
					// 	callback()
					// }

					// console.log("res:" + JSON.stringify(res))
				});
			},
			requestAgreementAPI(callback) {
				// const mockWechat = 306917331
				// const mockStepIndex = 0
				// this.current_step_index = mockStepIndex
				// if (this.current_step_index === 0) {
				// 	this.loadStepTipPopwindow()
				// }

				this.$H.post('love/cp/create', {
					taUid: this.ta_uid
				}).then(res => {

					// if (callback) {
					// 	callback({
					// 		wechat: "306917331",
					// 		stepIndex: 0
					// 	})
					// }

					if (callback) {
						callback()
					}

					// console.log("res:" + JSON.stringify(res))
				});

				// if (callback) {
				// 	callback({
				// 		wechat: "306917331",
				// 		stepIndex: 0
				// 	})
				// }
			},

			requestUpdateStepIndex(stepIndex, callback) {

				this.$H.post('love/cp/updateStep', {
					stepIndex,
					taUid: this.ta_uid
				}).then(res => {
					// if (callback) {
					// 	callback({
					// 		wechat: "306917331",
					// 		stepIndex: 0
					// 	})
					// }

					if (callback) {
						callback()
					}
					console.log("res:" + JSON.stringify(res))
				});

				// if (callback) {
				// 	this.showWechatView()
				// 	callback("306917331")
				// }
			},
			resetDataStatus() {
				// show_wechat: false,
				// wechat: "306917331",
				// step_task_tip_content: "您是愿意和对方一起玩心动任务打卡游戏？",
				// step_task_tip_show: false,
				// hide_confim_button: false,
				// ta_uid: -1,
				// current_step_index: 0, // 0初始状态，需要等对方是否确认玩这个游戏，双方确认了，才能看到对方等微信

				this.step_task_tip_content = ""
				this.step_task_tip_show = false
				this.hide_confim_button = false
				this.current_step_index = -1
				this.show_wechat = false
			},
			loadStepStatus() {
				this.resetDataStatus()

				this.requestStepStatus((stepStatus) => {

					if (stepStatus == null) {
						this.current_step_index = -1
						this.step_task_tip_show = true
						this.step_task_tip_content = "期待对方一起玩心动任务打卡游戏？"
						return
					}
					
					// 此刻获取对方的微信，且展示出来
					this.currentStepStatus = stepStatus
					this.wechat = stepStatus.wechatId

					if (stepStatus.active == 3) { // 已经中止
						// this.$u.toast('恋爱打开游戏已经中止');
						this.step_task_tip_content = "恋爱打开游戏已经中止！"
						this.step_task_tip_show = true
						this.hide_confim_button = true
						return
					}

					if (stepStatus.active == 2) {
						
						this.step_task_tip_content = "恋爱打开游戏已经成功结束！"
						this.step_task_tip_show = true
						this.hide_confim_button = true
						return
					}

					const userInfo = uni.getStorageSync("userInfo")
					// console.log("user:" + JSON.stringify(userInfo))
					const male = userInfo.gender == 0

					const historySteps = stepStatus.historySteps
					if (historySteps.trim() === "") { // 说明还在第一步，等待双方接受游戏玩法步骤
						// this.current_step_index = 0
						// this.step_task_tip_show = true
						// return


						if ((male && stepStatus.action == 1) || (!male && stepStatus.action == 2)) {
							this.step_task_tip_content = "您已经发出交友打开申请，等待对方同意中？"
							this.step_task_tip_show = true
							this.current_step_index = -1
							this.hide_confim_button = true
							this.refreshStepStatusView(true)

						} else if ((male && stepStatus.action == 2) || (!male && stepStatus.action == 1)) {
							this.step_task_tip_content = "对方发起交友打开申请，您是否接受，还剩下时间：" + this.current_step_index
							this.step_task_tip_show = true
							this.current_step_index = -1
							this.refreshStepStatusView(false)

						}

						return
						// console.log("WARN: history empty")
					} else {
						
						this.show_wechat = true
						

						if (historySteps.indexOf("_") != -1) {
							const steps = historySteps.split("_")
							const last_step_index = steps[steps.length - 1]
							this.current_step_index = last_step_index

						} else {
							this.current_step_index = historySteps.trim() == "" ? 0 : historySteps.trim()
						}

						this.current_step_index = parseInt(this.current_step_index)

						// parse history
						// Action: de

						// fault:0; 1,2,3 
						//       Male-加1；female-加2；
						// Active： 0-游戏初始，1-进行中，2-游戏正常结束，3-中途退出
						// history_steps: “",已经执行的步骤ID列表；action 与 history_steps一起使用 满足男女同时使用;
					}

					if (this.current_step_index >= this.steps.length && stepStatus.action == 3) {
						this.step_task_tip_show = true
						this.step_task_tip_content = "任务成功结束，进入自由恋爱吧"
						this.refreshStepStatusView(false)
						this.hide_confim_button = true
						return
					}


					if ((male && stepStatus.action == 1) || (!male && stepStatus.action == 2)) {
						this.step_task_tip_content = "等待对方打卡确认，对方截止时间：" + this.current_step_index
						this.step_task_tip_show = true

						this.hide_confim_button = true
						this.refreshStepStatusView(true)

					} else if ((male && stepStatus.action == 2) || (!male && stepStatus.action == 1)) {
						this.step_task_tip_content = "对方已经打卡，等待您确认，截止时间：" + this.current_step_index
						this.step_task_tip_show = true


						this.hide_confim_button = false
						this.refreshStepStatusView(true)

					} else { // 当前step index已经打卡成功，进行下一个
						this.step_task_tip_show = true

						this.refreshStepStatusView(false)

						if (this.current_step_index < this.steps.length) {
							this.current_step_index++
						}

						if (this.current_step_index <= this.steps.length) {
							this.step_task_tip_content = this.steps[this.current_step_index - 1].step_description
						}

					}

				})

			},
			refreshStepStatusView(needWait) {
				// this.wechat = "306917331"
				// this.show_wechat = true

				if (needWait) {
					for (var i = 0; i < this.steps.length; i++) {

						if (this.current_step_index > 0 && i < this.current_step_index - 1 && this.current_step_index <=
							this.steps.length) {

							this.steps[i].step_status = 1
						}

						this.steps[this.current_step_index - 1].step_status = 2
					}
				} else {
					for (var i = 0; i < this.steps.length; i++) {

						if (this.current_step_index > 0 && i < this.current_step_index && this.current_step_index <=this
							.steps.length) {

							this.steps[i].step_status = 1
						}
					}
				}


				// console.log(waitTa + " " + this.current_step_index)

				// if (waitTa && this.current_step_index >0 && this.current_step_index < this.steps.length - 1) {
				// 	this.steps[this.current_step_index-1].step_status = 1
				// }

				// this.showStepCompoment = false
				// setImmediate(()=> {
				// 	this.showStepCompoment = true
				// })

				// if (!waitTa && this.current_step_index >0 && i <= this.current_step_index && this.current_step_index < this.steps.length) { // 
				// 	this.steps[this.current_step_index - 1].step_status = 0
				// }

				// 	if (this.current_step_index - 1 >= 0) {
				// 		this.steps[this.current_step_index - 1].step_status = 1
				// 	} 
			},
			requestStepStatus(callback) {

				console.log("taUid:" + this.ta_uid)
				// 1. sent request, parms= ta_uid; response: 0,no wechat; 1..N, wechat;
				// 2. 
				this.$H.post('love/cp/step', {
					taUid: this.ta_uid
				}).then(res => {

					if (res && res.code == 0) {

						if (res.result) {
							if (callback) {
								callback(res.result)
							}
						} else { // 还没有新建任务
							if (callback) {
								callback(null)
							}
						}


						const userInfo = uni.getStorageSync("userInfo")
						console.log("user:" + JSON.stringify(userInfo))

						// const male = userInfo.gender == 0
						// if ((male && res.result[0].action == 1) || (!male && res.result[0].action == 2)) {

						// 	this.step_task_tip_content = "等待对方打卡确认，对方还剩下时间："
						// 	this.step_task_tip_show = true
						// 	return
						// }

						// const historySteps = res.result[0].historySteps
						// if (historySteps.trim() == "") { // 
						// 	if (callback) {
						// 		callback({
						// 			wechat: "306917331",
						// 			stepIndex: 1
						// 		})
						// 	}
						// } else {

						// 	if (historySteps.indexOf("_") != -1) {
						// 		const steps = historySteps.split("_")
						// 		const last_step_index = steps[steps.length - 1]
						// 		this.current_step_index = last_step_index

						// 	} else {
						// 		this.current_step_index = historySteps.trim()
						// 	}


						// 	if ((male && res.result[0].action == 1) || (!male && res.result[0].action == 2)) {

						// 		this.step_task_tip_content = "等待对方打卡确认，对方还剩下时间："
						// 		this.step_task_tip_show = true

						// 	}

						// 	// parse history
						// 	// Action: de

						// 	// fault:0; 1,2,3 
						// 	//       Male-加1；female-加2；
						// 	// Active： 0-游戏初始，1-进行中，2-游戏正常结束，3-中途退出
						// 	// history_steps: “",已经执行的步骤ID列表；action 与 history_steps一起使用 满足男女同时使用;
						// }
					}

					console.log("res:" + JSON.stringify(res))
				});

				// if (callback) {
				// 	callback({
				// 		wechat: "306917331",
				// 		stepIndex: 1
				// 	})
				// }
			},

			confirm() {

				if (this.hide_confim_button) {
					return
				}

				console.log("this.current_step_index:" + this.current_step_index)

				if (this.current_step_index == -1) {
					this.requestAgreementAPI((wechat) => {
						// this.showWechatView()
						setTimeout(() => {
							this.loadStepStatus()
						}, 2000)
					})

				} else if (this.current_step_index >= 0) {
					this.requestUpdateStepIndex(this.current_step_index, (wechat) => {

						setTimeout(() => {
							this.loadStepStatus()
						}, 2000)

					})
				}

				// if (this.current_step_index - 1 >= 0) {
				// 	this.steps[this.current_step_index - 1].step_status = 1
				// }

				// this.current_step_index++
				// this.loadStepTipPopwindow()

				// setTimeout(() => {
				// 	if (this.current_step_index - 1 >= 0) {
				// 		this.steps[this.current_step_index - 1].step_status = 1
				// 	} 

				// 	this.current_step_index++
				// 	this.loadStepTipPopwindow()
				// }, 1000)
			}
		}
	}
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
		display: flex;
		flex-direction: column;

		.head {
			margin: 10rpx;
			display: flex;
			// flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		
		.wechat {
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 10rpx 0;
			.value {
				font-size: 40rpx;
				font-weight: bolder;
			}
		}

		.body {
			display: flex;
			// flex-direction: column;
			background-color: white;
			margin: 20rpx;
			
		}

		.bottom {
			margin-top: 100rpx;
			height: 70rpx;
			font-size: 25rpx;
			background-color: lightgray;
			margin-left: 0 !important;
			margin-right: 0 !important;
			border-radius: 20rpx;
			border-width: 0rpx;
		}
	}
</style>