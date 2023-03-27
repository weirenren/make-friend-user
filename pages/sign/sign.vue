<template>
	<view class="sign">
		<view class="header bg-color-blue">
			<view class="headerCon acea-row row-between-wrapper">
				<view class="left acea-row row-between-wrapper">
					<view class="pictrue">
						<image :src="userInfo.avatar" />
					</view>
					<view class="text">
						<view class="line1">{{ userInfo.username || '' }}</view>
						<view class="integral acea-row">
							<text>积分: {{ userInfo.integral || 0 }}</text>
						</view>
					</view>
				</view>
				<view @click="goSignRecord()" class="right acea-row row-middle">
					<view class="iconfont icon-caidan"></view>
					<view>明细</view>
				</view>
			</view>
		</view>
		<view class="wrapper">
			<view class="list acea-row row-between-wrapper">
				<view class="item" v-for="(item, signSystemListIndex) in signSystemList" :key="signSystemListIndex">
					<view :class="signSystemListIndex + 1 === signSystemList.length ? 'rewardTxt' : ''">{{ item.day }}</view>
					<view class="venus" :class=" (signSystemListIndex + 1 === signSystemList.length ? 'reward' : '') +' ' + (sign_index >= signSystemListIndex + 1 ? 'venusSelect' : '')"></view>
					<view class="num" :class="sign_index >= signSystemListIndex + 1 ? 'on' : ''">+{{ item.signNum }}</view>
				</view>
			</view>
			<!--加在 but 上 on 为已签到-->
			<view class="but bg-color-blue" :class="userInfo.isDaySign ? 'on' : ''" @click="goSign">{{ userInfo.isDaySign ? "已签到" : "立即签到" }}</view>
			<view class="lock"></view>
		</view>
		<view class="wrapper wrapper2">
			<view class="tip">已累计签到</view>
			<view class="list2 acea-row row-center row-bottom">
				<view class="item" v-for="(item, signCountIndex) in signCount" :key="signCountIndex">{{ item || 0 }}</view>
				<view class="data">天</view>
			</view>
			<view class="tip2">据说连续签到第{{ day }}天可获得超额积分哦</view>
			<view class="list3">
				<view class="item acea-row row-between-wrapper" v-for="(item, signListIndex) in signList" :key="signListIndex">
					<view>
						<view class="name line1">{{ item.title }}</view>
						<view class="data">{{ item.addTime }}</view>
					</view>
					<view class="num font-color-red">+{{ item.number }}</view>
				</view>
				<view @click="goSignRecord()" class="Loads acea-row row-center-wrapper" v-if="signList.length > 0">
					点击更多
					<view class="iconfont icon-xiangyou acea-row row-center-wrapper"></view>
				</view>
			</view>
		</view>
		<view class="signTip acea-row row-center-wrapper" :class="active === true ? 'on' : ''">
			<view class="signTipLight loadingpic">
				<!-- <image :src="`${$VUE_APP_RESOURCES_URL}/images/light.png`" /> -->
			</view>
			<view class="signTipCon">
				<view class="state">签到成功</view>
				<view class="integral">获得{{ integral }}积分</view>
				<view class="signTipBnt" @click="close">好的</view>
			</view>
		</view>
		<view class="mask" @touchmove.prevent :hidden="active === false"></view>
	</view>
</template>
<script>

	export default {
		name: "sign",
		components: {},
		props: {},
		data: function() {
			return {
				userInfo: {},
				integral: 0,
				signCount: [],
				sign_index: 0,
				signSystemList: [],
				signList: [],
				page: 1,
				limit: 3,
				active: false,
				day: ""
			};
		},
		mounted: function() {
			uni.showLoading({ title: "加载中", mask: true });
			this.signUser();
			this.signConfig();
			this.getSignList();
		},
		methods: {
			goSignRecord() {
				uni.navigateTo({
					url:"/pages/sign/integral"
				})
			},
			// js给数字补0；num：需要补0的数字，length：长度（补到多少位）；
			PrefixInteger: function(num, length) {
				return (Array(length).join("0") + num).slice(-length).split("");
			},
			//数字转中文
			Rp: function(n) {
				var cnum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
				var s = "";
				n = "" + n; // 数字转为字符串
				for (var i = 0; i < n.length; i++) {
					s += cnum[parseInt(n.charAt(i))];
				}
				return s;
			},
			// 获取用户信息
			signUser() {
				this.$H.post('sign/userInfo', {}).then(res => {
					uni.hideLoading();
					res.data.integral = parseInt(res.data.integral);
					var sumSginDay = res.data.sumSignDay;
					this.userInfo = res.data;
					this.signCount = this.PrefixInteger(sumSginDay, 4);
					this.sign_index = parseInt(res.data.signNum);
				})
			},
			// 签到配置
			signConfig: function() {
				this.$H.get('sign/config', {}).then(res => {
					this.signSystemList = res.data;
					this.day = this.Rp(this.signSystemList.length);
				})
			},
			//  用户签到
			goSign: function() {
				let that = this,
				sumSginDay = that.userInfo.sumSignDay;
				if (that.userInfo.isDaySign) {
					uni.showToast({
						title: "您今日已签到",
						icon: "none",
						duration: 2000
					});
					return
				}
				this.$H.post('sign/sign', {}).then(res => {
					that.active = true;
					that.integral = res.integral;
					let sign_index = parseInt(that.sign_index + 1);
					that.sign_index = sign_index > that.signSystemList.length ? 1 : sign_index;
					that.signCount = that.PrefixInteger(sumSginDay + 1, 4);
					that.userInfo.isDaySign = true;
					that.userInfo.integral = add(that.userInfo.integral, res.data.integral);
					that.getSignList();
				})
				
			},
			//获取签到列表
			getSignList: function() {
				let that = this;
				this.$H.get('sign/signList', {
					page: that.page, 
					limit: that.limit
				}).then(res => {
					that.signList = res.data;
				})
			},
			close: function() {
				this.active = false;
			}
		}
	};
</script>
<style scoped lang="less">
	.Loads .iconfont {
		font-size: 0.25*100rpx;
		margin: 0.02*100rpx 0 0 0.1*100rpx;
	}
	
	/* layout */
	.acea-row {
	  display: flex;
	  flex-wrap: wrap;
	  /* 辅助类 */
	}
	.acea-row.row-middle {
	  align-items: center;
	}
	.acea-row.row-top {
	  align-items: flex-start;
	}
	.acea-row.row-bottom {
	  align-items: flex-end;
	}
	.acea-row.row-center {
	  justify-content: center;
	}
	.acea-row.row-right {
	  justify-content: flex-end;
	}
	.acea-row.row-left {
	  justify-content: flex-start;
	}
	.acea-row.row-between {
	  justify-content: space-between;
	}
	.acea-row.row-around {
	  justify-content: space-around;
	}
	.acea-row.row-column-around {
	  flex-direction: column;
	  justify-content: space-around;
	}
	.acea-row.row-column {
	  flex-direction: column;
	}
	.acea-row.row-column-between {
	  flex-direction: column;
	  justify-content: space-between;
	}
	/* 上下左右垂直居中 */
	.acea-row.row-center-wrapper {
	  align-items: center;
	  justify-content: center;
	}
	/* 上下两边居中对齐 */
	.acea-row.row-between-wrapper {
	  align-items: center;
	  justify-content: space-between;
	}
	
	.font-color-red {
	  color: #64B5F6 !important;
	}
	.bg-color-blue {
	  background-color: #64B5F6 !important;
	}
	.icon-color {
	  color: #64B5F6;
	}
	.sign .header {
	  width: 100%;
	  height: 3.1 * 100rpx;
	}
	
	.sign .header .headerCon {
	  padding: 0 0 0 0.3 * 100rpx;
	  height: 2.34 * 100rpx;
	}
	
	.sign .header .headerCon .left {
	  width: 5.3 * 100rpx;
	  font-size: 0.32 * 100rpx;
	  color: #fff;
	  font-weight: bold;
	}
	
	.sign .header .headerCon .left .integral text {
	  font-size: 0.24 * 100rpx;
	  margin-top: 0.19 * 100rpx;
	  background-color: #a17cff;
	  text-align: center;
	  border-radius: 0.06 * 100rpx;
	  font-weight: normal;
	  padding: 0.06 * 100rpx 0.15 * 100rpx;
	}
	
	.sign .header .headerCon .text {
	  width: 4.1 * 100rpx;
	}
	
	.sign .header .headerCon .left .pictrue {
	  width: 0.86 * 100rpx;
	  height: 0.86 * 100rpx;
	  border-radius: 50%;
	  border: 0.04 * 100rpx solid #ecddbc;
	}
	
	.sign .header .headerCon .left .pictrue image {
	  width: 100%;
	  height: 100%;
	  border-radius: 50%;
	}
	
	.sign .header .headerCon .right {
	  width: 1.42 * 100rpx;
	  height: 0.66 * 100rpx;
	  background-color: #fff;
	  border-radius: 0.5 * 100rpx 0 0 0.5 * 100rpx;
	  font-size: 0.24 * 100rpx;
	  color: #aaaaff;
	}
	
	.sign .header .headerCon .right .iconfont {
	  font-size: 0.33 * 100rpx;
	  padding: 0 0.1 * 100rpx 0 0.3 * 100rpx;
	  height: 0.35 * 100rpx;
	  line-height: 0.35 * 100rpx;
	}
	
	.sign .wrapper {
	  background-color: #fff;
	  margin: -0.8 * 100rpx 0.2 * 100rpx 0 0.2 * 100rpx;
	  border-radius: 0.15 * 100rpx;
	  padding-bottom: 0.8 * 100rpx;
	  position: relative;
	}
	
	.sign .wrapper .list {
	  padding: 0 0.3 * 100rpx;
	  height: 2.4 * 100rpx;
	}
	
	.sign .wrapper .list .item {
	  font-size: 0.22 * 100rpx;
	  color: #8a8886;
	  text-align: center;
	}
	
	.sign .wrapper .list .item .rewardTxt {
	  width: 0.74 * 100rpx;
	  height: 0.32 * 100rpx;
	  background-color: #f4b409;
	  border-radius: 0.16 * 100rpx;
	  font-size: 0.2 * 100rpx;
	  color: #a57d3f;
	  line-height: 0.32 * 100rpx;
	}
	
	.sign .wrapper .list .item .num {
	  font-size: 0.3 * 100rpx;
	  color: #999;
	}
	
	.sign .wrapper .list .item .num.on {
	  color: #ff9000;
	}
	
	.sign .wrapper .list .item .venus {
	      background-image: url('@/static/images/xing.png');
	  background-repeat: no-repeat;
	  background-size: 100% 100%;
	  width: 0.56 * 100rpx;
	  height: 0.56 * 100rpx;
	  margin: 0.1 * 100rpx 0;
	}
	
	.sign .wrapper .list .item .venus.venusSelect {
      background-image: url('@/static/images/xing.png');
	}
	
	.sign .wrapper .list .item .venus.reward {
	  background-image: url('@/static/images/xing.png');
	  width: 0.75 * 100rpx;
	  height: 0.56 * 100rpx;
	}
	
	.sign .wrapper .but {
	  width: 4 * 100rpx;
	  height: 0.76 * 100rpx;
	  font-size: 0.3 * 100rpx;
	  line-height: 0.76 * 100rpx;
	  color: #fff;
	  border-radius: 0.5 * 100rpx;
	  text-align: center;
	  margin: 0 auto;
	}
	
	.sign .wrapper .but.on {
	  background-color: #999 !important;
	}
	
	.sign .wrapper .lock {
	 background-image: url('@/static/images/xing.png');
	  background-repeat: no-repeat;
	  background-size: 100% 100%;
	  width: 5.58 * 100rpx;
	  height: 0.68 * 100rpx;
	  position: absolute;
	  left: 50%;
	  transform: translateX(-50%);
	  bottom: -0.41 * 100rpx;
	  z-index: 9;
	}
	
	.sign .wrapper2 {
	  margin-top: 0.15 * 100rpx;
	  padding: 0.73 * 100rpx 0 0 0;
	}
	
	.sign .wrapper2 .tip {
	  font-size: 0.3 * 100rpx;
	  color: #666;
	  text-align: center;
	}
	
	.sign .wrapper2 .list2 {
	  margin: 0.45 * 100rpx 0 0.49 * 100rpx 0;
	}
	
	.sign .wrapper2 .list2 .item {
	  width: 0.8 * 100rpx;
	  height: 1.16 * 100rpx;
	  background-repeat: no-repeat;
	  background-size: 100% 100%;
	  color: #fff;
	  font-size: 0.72 * 100rpx;
	  text-align: center;
	  line-height: 1.16 * 100rpx;
	  margin-right: 0.19 * 100rpx;
      background-image: url('@/static/images/xing.png');
	}
	
	.sign .wrapper2 .list2 .data {
	  font-size: 0.3 * 100rpx;
	  color: #232323;
	}
	
	.sign .wrapper2 .tip2 {
	  font-size: 0.3 * 100rpx;
	  color: #999999;
	  padding: 0 0.55 * 100rpx;
	  text-align: center;
	  line-height: 1.5;
	}
	
	.sign .list3 {
	  margin: 0.45 * 100rpx 0.37 * 100rpx 0 0.37 * 100rpx;
	  border-top: 1px dashed #eee;
	}
	
	.sign .list3 .item {
	  border-bottom: 1px solid #eee;
	  height: 1.3 * 100rpx;
	}
	
	.sign .list3 .item .name {
	  color: #232323;
	  font-size: 0.3 * 100rpx;
	  width: 4 * 100rpx;
	}
	
	.sign .list3 .item .data {
	  font-size: 0.24 * 100rpx;
	  color: #bbbbbb;
	  margin-top: 0.09 * 100rpx;
	}
	
	.sign .list3 .item .num {
	  font-size: 0.36 * 100rpx;
	  font-family: 'GuildfordProBook 5';
	}
	
	.sign .signTip {
	  width: 6.44 * 100rpx;
	  height: 6.45 * 100rpx;
	  position: fixed;
	  top: 50%;
	  left: 50%;
	  margin-left: -3.22 * 100rpx;
	  margin-top: -3.225 * 100rpx;
	  z-index: 99;
	  text-align: center;
	  transition: all 0.3s ease-in-out 0s;
	  opacity: 0;
	  transform: scale(0);
	}
	
	.sign .signTip .signTipLight {
	  background-repeat: no-repeat;
	  background-size: 100% 100%;
	  width: 100%;
	  height: 100%;
	}
	
	.sign .signTip.on {
	  opacity: 1;
	  transform: scale(1);
	}
	
	.sign .signTip .signTipCon {
      background-image: url('@/static/images/xing.png');
	  background-repeat: no-repeat;
	  background-size: 100% 100%;
	  width: 4.2 * 100rpx;
	  height: 4.2 * 100rpx;
	  margin-top: -7 * 100rpx;
	  position: relative;
	}
	
	.sign .signTip .signTipCon .state {
	  font-size: 0.34 * 100rpx;
	  color: #fff;
	  margin-top: 1.5 * 100rpx;
	}
	
	.sign .signTip .signTipCon .integral {
	  font-size: 0.3 * 100rpx;
	  color: rgba(255, 255, 255, 0.6);
	  margin-top: 0.09 * 100rpx;
	}
	
	.sign .signTip .signTipCon .signTipBnt {
	  font-size: 0.3 * 100rpx;
	  color: #eb4331;
	  width: 2.6 * 100rpx;
	  height: 0.76 * 100rpx;
	  background-color: #f8d168;
	  border-radius: 0.38 * 100rpx;
	  line-height: 0.76 * 100rpx;
	  margin: 0.48 * 100rpx auto 0 auto;
	}
</style>
