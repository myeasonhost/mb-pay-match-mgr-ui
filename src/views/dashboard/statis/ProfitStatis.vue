<template>
  <div>
    <div><br/></div>
    <el-row :gutter="10" style="margin-bottom: 30px">
      <el-col :span="5">
        <el-card style="text-align: center;">
          <count-to :start-val="0" :end-val="totalProfit" :decimals="2" :duration="3600" class="card-panel-num"/>
          <div><br/></div>
          <div class="card-panel-text">
            累计盈利
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card style="text-align: center;">
          <count-to :start-val="0" :end-val="monthProfit" :decimals="2" :duration="3600" class="card-panel-num"/>
          <div><br/></div>
          <div class="card-panel-text">
            当月盈利
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card style="text-align: center;">
          <count-to :start-val="0" :end-val="todayProfit" :decimals="2" :duration="3600" class="card-panel-num"/>
          <div><br/></div>
          <div class="card-panel-text">
            当天盈利
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card style="text-align: center;">
          <count-to :start-val="0" :end-val="yesterdayProfit" :decimals="2" :duration="3600" class="card-panel-num"/>
          <div><br/></div>
          <div class="card-panel-text">
            昨日盈利
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" style="display: flex;justify-content: center;align-items: center">
        <el-card style="border-radius: 50%;text-align: center;">
          <div :class="upFromYesterday > 0 ? 'el-icon-top' : 'el-icon-bottom'"
               :style="{color:upFromYesterday > 0 ? '#ff0000':'#0BC433FF'}"></div>
          <count-to :start-val="0" :end-val="upFromYesterday" :decimals="2" :duration="3600"
                    :class="upFromYesterday > 0 ? 'card-panel-num' : 'card-panel-burden'"/>
          <div><br/></div>
          <div class="card-panel-text" style="font-size: 12px;">
            较昨日上升(%)
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="block">
      <span class="demonstration" style="margin-right:10px;">月份</span>
      <el-date-picker
        v-model="monthDate"
        type="month"
        size="mini"
        value-format="yyyy-MM"
        style="margin-right:10px; width: 150px"
        placeholder="选择月">
      </el-date-picker>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
    </div>
    <div id="profitBar" :style="{width: '100%', height: '500px'}"/>
    <div id="profitPie" :style="{width: '100%', height: '500px'}"/>

  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  import {getStatisProfit} from "@/api/pay/statis";

  export default {
    components: {
      CountTo
    },
    data() {
      return {
        monthDate: '',
        totalProfit: 0,             //累计盈利
        monthProfit: 0,             //当月盈利
        todayProfit: 0,             //当天盈利
        yesterdayProfit: 0,         //今日充值订单数
        upFromYesterday: 0,         //较昨日上升
        dateList: [],                //日期数组
        profitAmountList: [],         //盈利金额数组
        chargeProfitAmount: 0,         //充值盈利金额
        withdrawProfitAmount: 0,         //提现盈利金额
        matchProfitAmount: 0,         //撮合盈利金额
        chargeTotalProfitAmount: 0,         //充值总盈利金额
        withdrawTotalProfitAmount: 0,         //提现总盈利金额
        matchTotalProfitAmount: 0,         //撮合总盈利金额
      }
    },
    mounted() {
      this.monthDate = this.getNowTime();
      this.$nextTick(() => {
        this.drawLine()
      });
    },
    methods: {
      /** 搜索按钮操作 */
      handleQuery() {
        this.drawLine();
      },
      getNowTime() {
        var data = new Date();
        var y = data.getFullYear();
        var m = data.getMonth() + 1;
        return y + '-' + m;
      },
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        const profitBar = this.$echarts.init(document.getElementById('profitBar'))
        let params = {
          part_year: this.monthDate.split('-')[0],
          part_month: this.monthDate.split('-')[1]
        };
        //盈利统计
        getStatisProfit(params).then(response => {
          this.totalProfit = response.data.totalProfit;
          this.monthProfit = response.data.monthProfit;
          this.todayProfit = response.data.todayProfit;
          this.yesterdayProfit = response.data.yesterdayProfit;
          this.upFromYesterday = response.data.upFromYesterday;
          this.dateList = response.data.dateList;
          this.profitAmountList = response.data.profitAmountList;
          this.chargeProfitAmount = response.data.chargeProfitAmount;
          this.withdrawProfitAmount = response.data.withdrawProfitAmount;
          this.matchProfitAmount = response.data.matchProfitAmount;
          this.chargeTotalProfitAmount = response.data.chargeTotalProfitAmount;
          this.withdrawTotalProfitAmount = response.data.withdrawTotalProfitAmount;
          this.matchTotalProfitAmount = response.data.matchTotalProfitAmount;
          profitBar.setOption({
            title: {
              text: '盈利走势',
              left: 'center',
              textStyle: {
                color: '#333333',
                fontSize: 20
              }
            },
            tooltip: {
              trigger: 'axis'
            },

            xAxis: {
              name: "日期",
              type: 'category',
              data: this.dateList
            },
            yAxis: {
              name: "金额",
              type: 'value',

            },
            series: [
              {
                name: "金额",
                type: 'line',
                data: this.profitAmountList,
                color: '#000000',
                lineStyle: {color: '#ff3333'}
              }
            ]
          });

          const profitPie = this.$echarts.init(document.getElementById('profitPie'))
          profitPie.setOption({
            title: [
              {
                subtext: '总盈利占比',
                left: '20%',
                textAlign: 'center',
                subtextStyle: {
                  color: '#333333',
                  fontSize: 20
                }
              },
              {
                subtext: '当月盈利占比',
                left: '70%',
                textAlign: 'center',
                subtextStyle: {
                  color: '#333333',
                  fontSize: 20
                }
              }
            ],
            tooltip: {
              show: true,
              formatter: '{b}<br/>订单数:{c}<br/> 占比:{d}%'
            },
            color: ['#E25F3FFF', '#8E9899FF', '#447BD9FF'],
            series: [
              {
                type: 'pie',
                radius: '50%',
                center: ['50%', '50%'],
                data: [
                  {
                    name: '充值订单',
                    value: this.chargeTotalProfitAmount
                  },
                  {
                    name: '撮合订单',
                    value: this.matchTotalProfitAmount
                  },
                  {
                    name: '提现订单',
                    value: this.withdrawTotalProfitAmount
                  }
                ],
                label: {
                  position: 'outer',
                  alignTo: 'none',
                  bleedMargin: 5,
                  normal: {
                    textStyle: {
                      fontWeight: 300,
                      fontSize: 12,    //文字的字体大小
                      color: '#447BD9FF'
                    },
                    formatter: '{b}{d}%({c})'
                  }
                },
                left: 0,
                right: '50%',
                top: 0,
                bottom: 0
              },
              {
                type: 'pie',
                radius: '50%',
                center: ['50%', '50%'],
                data: [
                  {
                    name: '充值订单',
                    value: this.chargeProfitAmount
                  },
                  {
                    name: '撮合订单',
                    value: this.matchProfitAmount
                  },
                  {
                    name: '提现订单',
                    value: this.withdrawProfitAmount
                  }
                ],
                label: {
                  position: 'outer',
                  alignTo: 'labelLine',
                  bleedMargin: 5,
                  normal: {
                    textStyle: {
                      fontWeight: 300,
                      fontSize: 12,    //文字的字体大小
                      color: '#447BD9FF',
                    },
                    formatter: '{b}{d}%({c})'
                  }
                },
                left: '50%',
                right: 0,
                top: 0,
                bottom: 0
              },
            ]
          })
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card-panel-num {
    font-size: 20px;
    color: red;
  }

  .card-panel-burden {
    font-size: 20px;
    color: #0BC433FF;
  }

  .card-panel-icon {
    float: left;
    font-size: 48px;
  }
</style>
