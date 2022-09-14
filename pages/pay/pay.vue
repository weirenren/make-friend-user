<template>
  <view>
    <view class="payment-top acea-row row-column row-center-wrapper">
      <text class="name">我的余额</text>
      <view class="pic">
        <text>
          ￥
          <text class="pic-font">{{ now_money || 0 }}</text>
        </text>
      </view>
    </view>
    <view class="recharge">
      <view class="nav acea-row row-around row-middle">
        <view class="item on">账户充值</view>
      </view>
      <view class="info-wrapper">
        <view class="picList acea-row row-between mt-20">
          <view class="pic-box pic-box-color acea-row row-center-wrapper row-column"
            :class="activePic === index ? 'pic-box-color-active' : ''" v-for="(item, index) in picList" :key="index"
            @click="picCharge(index, item)">
            <view class="pic-number-pic">
              <text>
                {{ item.price }}
                <text class="pic-number">元</text>
              </text>
            </view>
            <view class="pic-number" v-if="item.givePrice > 0">赠送：{{ item.givePrice }} 元</view>
          </view>

        </view>
        <view class="tip">提示：充值后帐户的金额不能提现</view>
        <view class="pay-btn bg-color-red"  @click="recharge">立即充值</view>
      </view>
    </view>
  </view>
</template>
<script>

  export default {
    name: "Recharge",
    components: {},
    props: {},
    data: function () {
      return {
        active: 0,
        from: this.$deviceType,
        money: "",
        now_money: "",
        picList: [],
        activePic: 0,
        numberPic: "",
        paid_price: "",
        rechar_id: 0,
      };
    },

    mounted: function () {
      
      this.getRecharge();
	  this.getUserInfo();
    },
    methods: {
	getUserInfo() {
		this.$H.get('user/userInfo').then(res => {
			this.userInfo = res.result;
			this.now_money = this.userInfo.money;
		});
	},
      /**
       * 充值额度选择
       */
      getRecharge() {
		  this.$H.get('user/recharge/list').then(res => {
		  	this.picList = res.result;
			    if (this.picList[0]) {
			      this.rechar_id = this.picList[0].id;
			      this.paid_price = this.picList[0].price;
			      this.numberPic = this.picList[0].givePrice;
			    }
		  });

      },
      /**
       * 选择金额
       */
      picCharge(idx, item) {
        this.activePic = idx;
        if (idx == this.picList.length) {
          this.rechar_id = 0;
          this.paid_price = "";
          this.numberPic = "";
        } else {
          this.money = "";
          this.rechar_id = item.id;
          this.paid_price = item.givePrice;
          this.numberPic = item.price;
        }
      },
      recharge: function () {
        let that = this,
          price = Number(this.money);
        if (this.picList.length == this.activePic && price === 0) {
          uni.showToast({
            title: "请输入您要充值的金额",
            icon: "none",
            duration: 2000,
          });
          return;
        } else if (this.picList.length == this.activePic && price < 0.01) {
          uni.showToast({
            title: "充值金额不能低于0.01",
            icon: "none",
            duration: 2000,
          });
          return;
        } else if (this.picList.length == this.activePic && price > 99999) {
          uni.showToast({
            title: "充值金额不能大于99999",
            icon: "none",
            duration: 2000,
          });
          return;
        }
        let prices = "",
          paid_price = "";
        if (price) {
          prices = price;
          paid_price = 0;
        } else {
          prices = that.numberPic;
          paid_price = that.paid_price;
        }
		uni.showLoading({
		  mask: true,
		  title: '支付中...',
		})
		// #ifdef MP-WEIXIN
        this.$H.post('/user/recharge',{
            price: prices,
            from: 'weixin',
            paidPrice: paid_price,
            recharId: that.rechar_id,
          })
          .then((res) => {
			uni.hideLoading()
			console.log("miniprogram:"+res.data)
            // var data = res.data;
			
			uni.requestPayment({
			  provider: 'wxpay',
			  timeStamp: res.data.timeStamp,
			  nonceStr: res.data.nonceStr,
			  package: res.data.package,
			  signType: res.data.signType,
			  paySign: res.data.paySign,
			  success: function (payRes) {
			    
			    uni.showToast({
			      icon: 'none',
			      title: '支付成功'
			    })
			
			    uni.navigateTo({
			      url: '/pages/account/account'
			    })
			  },
			  fail: function (err) {
			    uni.showToast({
			      icon: 'none',
			      title: '支付取消'
			    })
			    uni.navigateTo({
			      url: '/pages/account/account'
			    })
			  }
			})
          })
          .catch((err) => {
            console.log(err);
            uni.showToast({
              title: err.msg,
              icon: "none",
              duration: 2000,
            });
          });
		  // #endif
		  // #ifdef H5
		  let ua = navigator.userAgent.toLowerCase();
		  if (ua.match(/MicroMessenger/i) == "micromessenger") {
		    uni.showToast({
		      icon: 'none',
		      title: '请用微信外浏览器打开支付'
		    })
		  } else {
		    this.$H.post('/user/rechargeByH5',{
		        price: prices,
		        from: 'weixin',
		        paidPrice: paid_price,
		        recharId: that.rechar_id,
		      })
		      .then((res) => {
		    	uni.hideLoading()
		    	console.log("h5:"+res.data)
		        location.replace(res.data.mwebUrl)
		        // window.location.replace(url)
		    }).catch(err => {
		      uni.hideLoading()
		      uni.showToast({
		        title: '支付失败',
		        icon: 'none'
		      })
		      uni.navigateTo({
		        url: '/pages/account/account'
		      })
		    })
		  
		  }
		  // #endif
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
    border-top-right-radius: 0.39 * 100rpx;
    border-top-left-radius: 0.39 * 100rpx;
    margin-top: -0.45 * 100rpx;
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
    color: #333333;
    font-weight: 800;
    margin-bottom: 0.14 * 100rpx;
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
  .bg-color-red {
    background-color: #64B5F6 !important;
  }
  .icon-color {
    color: #64B5F6;
  }
</style>