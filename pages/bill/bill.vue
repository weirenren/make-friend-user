<template>
  <view class="bill-details" ref="container">
    <view class="nav acea-row">
      <view class="item" :class="types == 0 ? 'on' : ''" @click="changeTypes(0)">全部</view>
      <view class="item" :class="types == 1 ? 'on' : ''" @click="changeTypes(1)">消费</view>
      <view class="item" :class="types == 2 ? 'on' : ''" @click="changeTypes(2)">充值</view>
    </view>
    <view class="sign-record">
      <view class="list">
        <view class="item" v-for="(item, listIndex) in list" :key="listIndex">
          <view class="data"></view>
          <view class="listn">
            <view class="itemn acea-row row-between-wrapper">
              <view>
                <view class="name line1">{{ item.title }}</view>
                <view>{{ item.addTime }}</view>
              </view>
              <view
                class="num"
                :class="item.pm == 0 ? 'font-color-red' : ''"
              >{{ item.pm == 0 ? "-" : "+" }}{{ item.number }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
   
  </view>
</template>
<script>

export default {
  name: "bill",
  props: {},
  data: function() {
    return {
	  loadStatus: "loading",
      types: 0,
      where: {
        page: 1,
        limit: 10
      },
      list: [],
    };
  },
  onLoad(options) {
	this.types=options.types
  },

  mounted: function() {
	this.getBillList();
  },
  onReachBottom() {
    this.where.page++;
	this.getBillList();
  },
  methods: {

    changeTypes: function(val) {
      if (val != this.types) {
        this.types = val;
        this.list = [];
        this.where.page = 1;
      }
	  this.getBillList();
    },

	getBillList(){
		this.loadStatus = "loading";
		this.$H.post("bill/billList", {
			page: this.where.page,
			limit: this.where.limit,
			type: this.types
		}).then(res => {
		
			this.list=this.list.concat(res.result.data)
			if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
				this.loadStatus = "nomore";
			} else {
				this.loadStatus = "loadmore"
			}
			
		})
	},

	
	}
}
</script>

<style lang="less" scoped>
.bill-details .nav {
  background-color: #fff;
  height: 0.9 * 100rpx;
  width: 100%;
  line-height: 0.9 * 100rpx;
}

.bill-details .nav .item {
  flex: 1;
  -o-flex: 1;
  -ms-flex: 1;
  text-align: center;
  font-size: 0.3 * 100rpx;
  color: #282828;
  height: 100%;
}

.bill-details .nav .item.on {
  color: #55aaff;
  border-bottom: 0.03 * 100rpx solid #55aaff;
}
.sign-record .list .item .data {
  height: 0.8 * 100rpx;
  line-height: 0.8 * 100rpx;
  padding: 0 0.3 * 100rpx;
  font-size: 0.24 * 100rpx;
  color: #666;
}

.sign-record .list .item .listn {
  background-color: #fff;
  font-size: 0.24 * 100rpx;
  color: #999;
}

.sign-record .list .item .listn .itemn {
  height: 1.2 * 100rpx;
  border-bottom: 1px solid #eee;
  padding-right: 0.3 * 100rpx;
  margin-left: 0.3 * 100rpx;
}

.sign-record .list .item .listn .itemn .name {
  width: 3.9 * 100rpx;
  font-size: 0.28 * 100rpx;
  color: #282828;
  margin-bottom: 0.06 * 100rpx;
}

.sign-record .list .item .listn .itemn .num {
  font-size: 0.36 * 100rpx;
  font-family: 'GuildfordProBook 5';
  color: #ff0000;
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
