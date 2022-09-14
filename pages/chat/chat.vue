<template>
	<view>
		<!-- 顶部 -->
		<u-navbar back-text=" ">
			<view class="navbar-center">
				<text>与 {{user.username}} 闲聊中</text>
			</view>
		</u-navbar>
		<view class="h-flexc" style="position: fixed;top: 120;width: 750rpx;z-index: 999;">
			<h-tips content="请遵守相应法律法规文明发言,创建和谐环境"></h-tips>
		</view>
		<!-- 页面主体 -->
		<view class="page-body">
			<block v-for="(item,index) in msgList" :key="index">
				<view v-if="item.isshowtime" class="time">{{item.createTime | timeFormat}}</view>
				<!-- 左边消息 -->
				<view v-if="item.fromUid == user.uid" class="chat-item chat-item-left ">
					<u-avatar :src="user.avatar" class="h-flex" size="66"></u-avatar>
					<view>
						<text class="conent">{{item.content}}</text>
					</view>
				</view>
				<!-- 右边消息 -->
				<view v-else class="chat-item chat-item-right">
					<u-avatar class="h-flex" :src="userInfo.avatar" size="66"></u-avatar>
					<view style="margin-right: 20rpx;">
						<text class="conent" style="background-color: #26B562;">{{item.content}}</text>
					</view>
				</view>
			</block>
			<!-- 评论输入框 -->
			<view style="height: 130rpx;"></view>
			<view class="comment-tool">
				<textarea style="font-size: 28rpx;" :placeholder="placeholder" @blur="onBlur" :focus="focus" fixed="true"
					cursor-spacing="10" v-model="mTxt" auto-height="true" placeholder-class="txt-placeholder"
					confirm-type="send" @confirm="addComment"></textarea>
				<u-button @click="sendMessage"  :custom-style="btnStyle" type="success">发送
				</u-button>
			</view>

		</view>
	</view>
</template>

<script>
	import hTips from '../../components/h-tips.vue';
	import hCommon from '@/utils/h-common.js';
	export default {
		components: {
			hTips
		},
		data() {
			return {
				placeholder: '请文明发言哦~',
				btnStyle: {
					borderRadius: '0',
					color: "#fff",
					backgroundColor: '#95acff',
					width: '156rpx',
					height: '90rpx',
					fontSize: '30rpx'
				},
				mTxt: "",
				msgList: [],
				userInfo: uni.getStorageSync("userInfo"),
				user: {},
				page: 1,
				isTop: true,//上拉到顶后加锁处理
				timer: null,//定时器
			};
		},
		onLoad(options) {
			this.user = JSON.parse(options.user);
			this.getMessage(1);
			this.timer = setInterval(() => {
				this.getMessage(1);
			}, 3000);
		},
		onPullDownRefresh() {
			this.page++;
			if(this.isTop){
				this.getMessage(0);
			}
			// console.log(this.page)
			uni.stopPullDownRefresh();
			if(this.timer) {
				clearInterval(this.timer);  
				this.timer = null;  
			}
		},
		onReachBottom() {
			// console.log('触底了')
			if(this.timer) {
				clearInterval(this.timer);  
				this.timer = null;  
			}
			this.timer = setInterval(() => {
				this.getMessage(1);
			}, 3000);
		},
		onUnload() {
			if(this.timer) {  
				clearInterval(this.timer);  
				this.timer = null;  
			}
			// console.log('onUnload..')
		},
		methods: {
			// 转换时间方法
			changeTime(data) { //data是接受的item.time
				if (typeof data === 'string') {
					data = new Date(data.replace(/-/g, '/')).getTime()
				} else {
					if (time.toString().length === 10) {
						data = new Date(time * 1000).getTime()
					} else {
						data = new Date(time).getTime()
					}
				}
				//将字符串转换成时间格式
				let result;
				let timePublish = new Date(data);
				let timeNow = new Date();
				let minute = 1000 * 60;
				let hour = minute * 60;
				let day = hour * 24;
				let month = day * 30;
				let year = month * 12;
				let diffValue = timeNow - timePublish;
				// console.log('diffValue:',diffValue)
				let diffMonth = diffValue / month;
				let diffWeek = diffValue / (7 * day);
				let diffDay = diffValue / day;
				let diffHour = diffValue / hour;
				let diffMinute = diffValue / minute;
				let diffYear = diffValue / year;
				if (diffValue < minute) {
					result = "刚刚";
				} else if (diffYear > 1) {
					result = parseInt(diffYear) + "年前";
				} else if (diffMonth > 1) {
					result = parseInt(diffMonth) + "月前";
				} else if (diffWeek > 1) {
					result = parseInt(diffWeek) + "周前";
				} else if (diffDay > 1) {
					result = parseInt(diffDay) + "天前";
				} else if (diffHour > 1) {
					result = parseInt(diffHour) + "小时前";
					// let d = new Date(data).setHours(0, 0, 0, 0);
					// let today = new Date().setHours(0, 0, 0, 0);
					// let obj = {
					// 	'-86400000': '1天前',
					// 	0: '今天',
					// };
					// result = obj[d - today];
				} else if (diffMinute > 1) {
					result = parseInt(diffMinute) + "分钟前";
				} else {
					result = "刚刚";
				}
				return result;
			},
			
			
			//如果为1说明是初始加载或发送消息后的更新，如果参数为0说明是上拉加载
			getMessage(e) {
				if(e==1){
					this.page=1;
				}
				this.$H.post("user/chatList", {
					page: this.page,
					uid: this.user.uid
				}).then(res => {
					
					if(e==1){
						var comment = res.result;
						//增加一个显示时间值
						// var comment = res.result.data
						for (let i in comment) {
							comment[i].showtime = this.changeTime(comment[i].createTime)
							if (i > 0 && comment[i].showtime == comment[i - 1].showtime) {
								comment[i].isshowtime = false
							} else {
								comment[i].isshowtime = true
							}
						}
						console.log("fff",comment)
						this.msgList = res.result;
						this.page=1;
					}else{
						if(res.result.length==0){
							this.$u.toast('到顶啦！');
							this.isTop=false;
						}
						this.msgList = res.result.concat(this.msgList);
					}
					
					this.updateChatStatus();
				})
			},
			
			sendMessage() {
				if(!this.mTxt){
					this.$u.toast('内容不能为空');
					return;
				}
				this.isTop=true;
				this.$H.post("user/sendMessage", {
					uid: this.user.uid,
					content: this.mTxt
				}).then(res => {
					if (res.code == 0) {
						this.getMessage(1);
						this.mTxt = "";
					}
				})
			},
			// 更新阅读状态
			updateChatStatus() {
				this.$H.post("message/updateChatStatus", {
					uid: this.user.uid
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'chat.scss';
</style>
