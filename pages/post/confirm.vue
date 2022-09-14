<template>
  <view>
    <view class="payment-top acea-row row-column row-center-wrapper">
      <text class="name">需要支付</text>
      <view class="pic">
        <text>
          ￥
          <text class="pic-font">{{ post.pay || 0 }}</text>
        </text>
      </view>
    </view>
    <view class="recharge">
      <view class="nav acea-row row-around row-middle">
        <view class="item on">帖子充值</view>
      </view>
      <view class="info-wrapper">
        <view class="picList acea-row row-between mt-20">

        </view>
        
		<view class="tip2">标题：{{post.title}}</view>
        <view class="pay-btn bg-color-blue" v-if="enough" @click="payVipPost">立即支付</view>
		<view class="pay-btn bg-color-orange" v-else @click="goRecharge">去充值</view>
		<view class="tip">提示：支付后即可查看付费帖详情，支付后不可退款哦</view>
      </view>
    </view>
  </view>
</template>
<script>

  export default {
    name: "Confirm",
    components: {},
    props: {},
    data: function () {
      return {
		enough:false,
        active: 0,
        money: "",
        now_money: "",
        picList: [],
        activePic: 0,
        numberPic: "",
        paid_price: "",
        rechar_id: 0,
		post:{},
		userInfo:{},
		postId: 0,
		type:0,
		isBuy: false,
      };
    },

	onLoad(options) {
		this.postId = options.id;
		this.type=options.type;
	},
    mounted: function () {
      
	  this.getUserInfo();
    },
    methods: {
	payVipPost(){
		var that=this;
		uni.showModal({
			title: '提示',
			content: '确定支付吗？',
			success: function (res) {
				if (res.confirm) {
					// console.log('用户点击确定');
					that.$H.post('user/payVipPost',{
						postId: that.postId
					}).then(res => {
						let url;
						if(that.type==1||that.type==4){			
							url='/pages/post/detail?id=' + that.postId;
						}else if(that.type==2){
							url= '/pages/post/video-detail?id=' + that.postId;
						}
						if(res.code==0){
							uni.navigateTo({
								url:url
							})
						}
						
					});
				} else if (res.cancel) {
					// console.log('用户点击取消');
				}
			}
		});
	},	
		
	goRecharge(){
		uni.navigateTo({
			url:'/pages/pay/pay'
		})
	},
		
	getUserInfo() {
		this.$H.get('user/userInfo').then(res => {
			this.userInfo = res.result;
			this.now_money = this.userInfo.money;
			this.getVipPostInfo();
		});
	},
	
	getVipPostInfo(){
		this.$H.post('post/getVipPostInfo',{
			postId: this.postId,
			uid: this.userInfo.uid
		}).then(res => {
			this.post = res.result;
			this.isBuy = res.result.isBuy;
			if(res.result.isBuy){
				let url;
				if(this.type==1||this.type==4){			
					url='/pages/post/detail?id=' + this.postId;
				}else if(this.type==2){
					url= '/pages/post/video-detail?id=' + this.postId;
				}
				uni.navigateTo({
					url:url
				})
			}else{
				if(this.userInfo.money>=res.result.pay){
					this.enough=true
				}else{
					uni.showToast({
					  title: "余额不足，请充值",
					  icon: "none",
					  duration: 2000,
					});
					
				}
			}
			
		});
	},


    },
  };
</script>

<style scoped lang="less">


  .pic-box-color-active {
    background-color: #42A5F5 !important;
    color: #fff !important;
  }

  .picList {
    margin-bottom: 0.3 * 100rpx;
    margin-top: 0.3 * 100rpx;
	display: flex;
  }

  .font-color {
    color: #e83323;
  }

  .recharge {
    border-radius: 0.1 * 100rpx;
    width: 100%;
    background-color: #fff;
    margin: 0.2 * 100rpx auto 0 auto;
    padding: 0.3 * 100rpx;
    // border-top-right-radius: 0.39 * 100rpx;
    // border-top-left-radius: 0.39 * 100rpx;
    // margin-top: -0.45 * 100rpx;
    box-sizing: border-box;
	
  }

  .recharge .nav {
    height: 0.75 * 100rpx;
    line-height: 0.75 * 100rpx;
    padding: 0 1 * 100rpx;
  }

  .recharge .nav .item {
    font-size: 0.3 * 100rpx;
    color: #333;
  }

  .recharge .nav .item.on {
    font-weight: bold;
    border-bottom: 0.04 * 100rpx solid #e83323;
  }

  .recharge .info-wrapper {}

  .recharge .info-wrapper .money {
    margin-top: 0.6 * 100rpx;
    padding-bottom: 0.2 * 100rpx;
    border-bottom: 1px dashed #ddd;
    text-align: center;
  }

  .recharge .info-wrapper .money span {
    font-size: 0.56 * 100rpx;
    color: #333;
    font-weight: bold;
  }

  .recharge .info-wrapper .money input {
    display: inline-block;
    width: 3 * 100rpx;
    font-size: 0.84 * 100rpx;
    text-align: center;
    color: #282828;
    font-weight: bold;
    padding-right: 0.7 * 100rpx;
  }

  .recharge .info-wrapper .money input::placeholder {
    color: #ddd;
  }

  .recharge .info-wrapper .money input::-webkit-input-placeholder {
    color: #ddd;
  }

  .recharge .info-wrapper .money input:-moz-placeholder {
    color: #ddd;
  }

  .recharge .info-wrapper .money input::-moz-placeholder {
    color: #ddd;
  }

  .recharge .info-wrapper .money input:-ms-input-placeholder {
    color: #ddd;
  }

  .tip {
    font-size: 0.28 * 100rpx;
    color: #797979;
    font-weight: 800;
    margin-bottom: 0.07 * 100rpx;
  }
  .tip2 {
    font-size: 0.32 * 100rpx;
    color: #333333;
    font-weight: 800;
    margin-bottom: 0.10 * 100rpx;
  }

  .recharge .info-wrapper .tips span {
    color: #64B5F6;
  }

  .recharge .info-wrapper .pay-btn {
    display: block;
    width: 100%;
    height: 0.86 * 100rpx;
    margin: 0.5 * 100rpx auto 0 auto;
    line-height: 0.86 * 100rpx;
    text-align: center;
    color: #fff;
    border-radius: 0.5 * 100rpx;
    font-size: 0.3 * 100rpx;
    font-weight: bold;
  }

  .payment-top {
    width: 100%;
    height: 3.5 * 100rpx;
    background-color: #64B5F6;
  }

  .payment-top .name {
    font-size: 0.26 * 100rpx;
    color: rgba(255, 255, 255, 0.8);
    margin-top: -0.38 * 100rpx;
    margin-bottom: 0.3 * 100rpx;
  }

  .payment-top .pic {
    font-size: 0.32 * 100rpx;
    color: #fff;
  }

  .payment-top .pic-font {
    font-size: 0.78 * 100rpx;
    color: #fff;
  }

  .picList .pic-box {
    width: 32%;
    height: auto;
    border-radius: 0.2 * 100rpx;
    margin-top: 0.21 * 100rpx;
    padding: 0.2 * 100rpx 0;
  }

  .pic-box-color {
    background-color: #f4f4f4;
    color: #656565;
  }

  .pic-number {
    font-size: 0.22 * 100rpx;
  }

  .pic-number-pic {
    font-size: 0.38 * 100rpx;
    margin-right: 0.1 * 100rpx;
    text-align: center;
  }

  .pic-box-money {
    width: 100%;
    display: block;
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
  .bg-color-orange {
    background-color: #585884 !important;
  }
  .icon-color {
    color: #64B5F6;
  }
</style>