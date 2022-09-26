<template>
  <div>
    <div style="font-size: 20px;">
      我的余额
      <div class="top-right-btn">
          <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button size="mini" circle icon="el-icon-refresh" :disabled="isClick" @click="refresh" />
          </el-tooltip>
      </div>
    </div>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-description" style="width: 100%;text-align: center;">
            <count-to :start-val="0" :end-val="balance" :duration="3600" class="card-panel-num"/>
            <div><br/></div>
            <div class="card-panel-text">
              当前余额
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('messages')">
          <div class="card-panel-description" style="width: 100%;text-align: center;">
            <count-to :start-val="0" :end-val="freeBalance" :duration="3600" class="card-panel-num"/>
            <div><br/></div>
            <div class="card-panel-text">
              冻结余额
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-description" style="width: 100%;text-align: center;">
            <count-to :start-val="0" :end-val="todayIncome" :duration="3600" class="card-panel-num"/>
            <div><br/></div>
            <div class="card-panel-text">
              今日收入
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div style="font-size: 20px;">
      充值订单
    </div>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-description" style="width: 100%;text-align: center;">
            <count-to :start-val="0" :end-val="todayChargeCnt" :duration="3600" class="card-panel-num"/>
            <div><br/></div>
            <div class="card-panel-text">
              今日充值订单数
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-description" style="width: 100%;text-align: center;">
            <count-to :start-val="0" :end-val="todayChargeAmount" :duration="3600" class="card-panel-num"/>
            <div><br/></div>
            <div class="card-panel-text">
              今日充值金额
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-description" style="width: 100%;text-align: center;">
            <count-to :start-val="0" :end-val="totalChargeCnt" :duration="3600" class="card-panel-num"/>
            <div><br/></div>
            <div class="card-panel-text">
              充值订单总数
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-description" style="width: 100%;text-align: center;">
            <count-to :start-val="0" :end-val="totalChargeAmount" :duration="3600" class="card-panel-num"/>
            <div><br/></div>
            <div class="card-panel-text">
              充值订单总金额
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-description" style="width: 100%;text-align: center;">
            <count-to :start-val="0" :end-val="totalChargeSuccessCnt" :duration="3600" class="card-panel-num"/>
            <div><br/></div>
            <div class="card-panel-text">
              充值成功数
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-description" style="width: 100%;text-align: center;">
            <count-to :start-val="0" :end-val="totalChargeSuccessRate" :duration="3600" class="card-panel-num"/>
            <div><br/></div>
            <div class="card-panel-text">
              充值成功率(%)
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div style="font-size: 20px;">
      提现订单
    </div>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-description" style="width: 100%;text-align: center;">
            <count-to :start-val="0" :end-val="todayWithdrawCnt" :duration="3600" class="card-panel-num"/>
            <div><br/></div>
            <div class="card-panel-text">
              今日提现订单数
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-description" style="width: 100%;text-align: center;">
            <count-to :start-val="0" :end-val="todayWithdrawAmount" :duration="3600" class="card-panel-num"/>
            <div><br/></div>
            <div class="card-panel-text">
              今日提现金额
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-description" style="width: 100%;text-align: center;">
            <count-to :start-val="0" :end-val="totalWithdrawCnt" :duration="3600" class="card-panel-num"/>
            <div><br/></div>
            <div class="card-panel-text">
              提现订单总数
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-description" style="width: 100%;text-align: center;">
            <count-to :start-val="0" :end-val="totalWithdrawAmount" :duration="3600" class="card-panel-num"/>
            <div><br/></div>
            <div class="card-panel-text">
              提现订单总金额
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-description" style="width: 100%;text-align: center;">
            <count-to :start-val="0" :end-val="totalWithdrawSuccessCnt" :duration="3600" class="card-panel-num"/>
            <div><br/></div>
            <div class="card-panel-text">
              提现成功数
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-description" style="width: 100%;text-align: center;">
            <count-to :start-val="0" :end-val="totalWithdrawSuccessRate" :duration="3600" class="card-panel-num"/>
            <div><br/></div>
            <div class="card-panel-text">
              提现成功率(%)
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  import {getCountFishBalance} from "@/api/pay/siteinfo";
  import {getCountFishCharge} from "@/api/mbpay/recharge";
  import {getCountFishWithdraw} from "@/api/mbpay/withdraw";

  export default {
    data() {
      return {
        balance: 0,                 //当前余额
        freeBalance: 0,             //冻结余额
        todayIncome: 0,             //今日收入
        todayChargeCnt: 0,          //今日充值订单数
        todayChargeAmount: 0,       //今日充值金额
        totalChargeCnt: 0,          //充值订单总数
        totalChargeAmount: 0,       //充值总金额
        totalChargeSuccessCnt: 0,   //充值成功数
        totalChargeSuccessRate: 0,  //充值成功率
        todayWithdrawCnt: 0,        //今日提现订单数
        todayWithdrawAmount: 0,     //今日提现金额
        totalWithdrawCnt: 0,        //提现订单总数
        totalWithdrawAmount: 0,     //提现总金额
        totalWithdrawSuccessCnt: 0,  //提现成功数
        totalWithdrawSuccessRate: 0,//提现成功率
        isClick:false               //是否能点击
      }
    },
    created() {
      this.getInfo();
    },
    components: {
      CountTo
    },
    methods: {
      handleSetLineChartData(type) {
        this.$emit('handleSetLineChartData', type)
      },
      getInfo() {
        //我的余额
        getCountFishBalance().then(response => {
          this.balance = response.data.balance;
          this.freeBalance = response.data.freeBalance;
          this.todayIncome = response.data.todayIncome;
        });

        //充值订单
        getCountFishCharge().then(response => {
          this.todayChargeCnt = response.data.todayChargeCnt;
          this.todayChargeAmount = response.data.todayChargeAmount;
          this.totalChargeCnt = response.data.totalChargeCnt;
          this.totalChargeAmount = response.data.totalChargeAmount;
          this.totalChargeSuccessCnt = response.data.totalChargeSuccessCnt;
          this.totalChargeSuccessRate = response.data.totalChargeSuccessRate;
        });

        //提现订单
        getCountFishWithdraw().then(response => {
          this.todayWithdrawCnt = response.data.todayWithdrawCnt;
          this.todayWithdrawAmount = response.data.todayWithdrawAmount;
          this.totalWithdrawCnt = response.data.totalWithdrawCnt;
          this.totalWithdrawAmount = response.data.totalWithdrawAmount;
          this.totalWithdrawSuccessCnt = response.data.totalWithdrawSuccessCnt;
          this.totalWithdrawSuccessRate = response.data.totalWithdrawSuccessRate;
        });
      },
      refresh() {
        this.isClick = true;
        this.getInfo();
        setTimeout(()=>{
          this.isClick = false;
          },5000);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-money {
          background: #f4516c;
        }

        .icon-shopping {
          background: #34bfa3
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
          color: red;
        }
      }
    }
  }

  @media (max-width: 550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
