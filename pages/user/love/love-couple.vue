<template>
	<view class="container">
		<view class="head">
			<view>💗</view>
			<view>匹配成功！</view>
			<view v-if="show_wechat">TA的微信是：{{wechat}}，可以加微信交流啦</view>
		</view>
		<view class="body" v-for="step in steps" :key="step.step_index">
			<love-couple-step :step_index="step.step_index" :step_description="step.step_description"
				:step_day="step.step_day" :step_status="step.step_status">
			</love-couple-step>
		</view>

		<view class="bottom">
			<q-button>中止接触</q-button>
		</view>
		
		<u-modal @confirm="confirm" v-model="step_task_tip_show" :showConfirmButton="hide_confim_button? true : true" :showCancelButton="hide_confim_button? false : true"
			width="400rpx">{{step_task_tip_content}}</u-modal>
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
				current_step_index: 0, // 0初始状态，需要等对方是否确认玩这个游戏，双方确认了，才能看到对方等微信
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
		onLoad: function(opt) {
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
			requestAgreementAPI(callback) {
				// const mockWechat = 306917331
				// const mockStepIndex = 0
				// this.current_step_index = mockStepIndex
				// if (this.current_step_index === 0) {
				// 	this.loadStepTipPopwindow()
				// }

				this.$H.post('love/cp/create', {
					taUid: 149
				}).then(res => {

					// if (callback) {
					// 	callback({
					// 		wechat: "306917331",
					// 		stepIndex: 0
					// 	})
					// }

					this.loadStepStatus()
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
					step_index: this.current_step_index
				}).then(res => {
					// if (callback) {
					// 	callback({
					// 		wechat: "306917331",
					// 		stepIndex: 0
					// 	})
					// }

					this.loadStepStatus()
					console.log("res:" + JSON.stringify(res))
				});

				// if (callback) {
				// 	this.showWechatView()
				// 	callback("306917331")
				// }
			},
			loadStepStatus() {
				this.requestStepStatus((stepStatus) => {

					const userInfo = uni.getStorageSync("userInfo")
					// console.log("user:" + JSON.stringify(userInfo))
					const male = userInfo.gender == 0

					const historySteps = stepStatus.historySteps
					if (historySteps.trim() === "") { // 说明还在第一步，等待双方接受游戏玩法步骤
						this.current_step_index = 0
					} else {

						if (historySteps.indexOf("_") != -1) {
							const steps = historySteps.split("_")
							const last_step_index = steps[steps.length - 1]
							this.current_step_index = last_step_index

						} else {
							this.current_step_index = historySteps.trim()
						}


						// parse history
						// Action: de

						// fault:0; 1,2,3 
						//       Male-加1；female-加2；
						// Active： 0-游戏初始，1-进行中，2-游戏正常结束，3-中途退出
						// history_steps: “",已经执行的步骤ID列表；action 与 history_steps一起使用 满足男女同时使用;
					}

			
					
					if ((male && stepStatus.action == 1) || (!male && stepStatus.action == 2)) {
						this.step_task_tip_content = "等待对方打卡确认，对方还剩下时间："
						this.step_task_tip_show = true
						
						this.refreshStepStatusView(true)
						
					} else if ((male && stepStatus.action == 2) || (!male && stepStatus.action == 1)) {
						this.step_task_tip_content = "对方已经打卡确认，此时等待你打卡确认，您的确认时间还剩下："
						this.step_task_tip_show = true
						
						this.refreshStepStatusView(false)
									
					} else { // 当前step index已经打卡成功，进行下一个
					
						this.refreshStepStatusView(false)
						if (this.current_step_index < this.steps.length) {
							this.current_step_index++
						}
						
						if (this.current_step_index <= this.steps.length) {
							
							this.step_task_tip_content = this.steps[this.current_step_index - 1].step_description
						} else {
							this.step_task_tip_content = "任务成功结束，进入自由恋爱吧"
						}
						
					}
				

					this.step_task_tip_show = true
				})

			},
			refreshStepStatusView(waitTa) {
				this.wechat = "306917331"
				this.show_wechat = true
				
				this.hide_confim_button = waitTa 
				
				for (var i = 0; i < this.steps.length; i++) {
					if (this.current_step_index >0 && i <= this.current_step_index && this.current_step_index < this.steps.length) {
						this.steps[i].step_status = 1
					}
				}
				
				if (!waitTa && this.current_step_index >0 && i <= this.current_step_index && this.current_step_index < this.steps.length) { // 
					this.steps[this.current_step_index - 1].step_status = 0
				}
				
				// 	if (this.current_step_index - 1 >= 0) {
				// 		this.steps[this.current_step_index - 1].step_status = 1
				// 	} 
			},
			requestStepStatus(callback) {

				// 1. sent request, parms= ta_uid; response: 0,no wechat; 1..N, wechat;
				// 2. 
				this.$H.post('love/cp/step', {
					taUid: 149
				}).then(res => {

					if (res && res.code == 0 && res.result && res.result.length > 0) {

						if (callback) {
							callback(res.result[0])
						}

						// const userInfo = uni.getStorageSync("userInfo")
						// console.log("user:" + JSON.stringify(userInfo))

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

				if (this.current_step_index === 0) {
					this.requestAgreementAPI((wechat) => {
						// this.showWechatView()
					})

				} else if (this.current_step_index > 0) {
					this.requestUpdateStepIndex(this.current_step_index, (wechat) => {

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
			flex-direction: column;
			align-items: center;
		}

		.body {
			// display: flex;
			// flex-direction: column;
		}

		.bottom {
			display: flex;
			justify-content: center;
		}
	}
</style>
