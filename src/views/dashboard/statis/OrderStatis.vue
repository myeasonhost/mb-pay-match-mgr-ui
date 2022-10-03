<template>
  <div>
    <div><br/></div>
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
    <div><br/></div>
    <div id="orderBar" :style="{width: '100%', height: '500px'}"/>
    <div style="font-size: 20px;font-family: 'Arial Black';margin-left: 20px">
      成功率
    </div>
    <div><br/></div>
    <el-row :gutter="10" style="margin-bottom: 30px;">
      <el-col :span="6" style="display: flex;justify-content: center;align-items: center">
        <el-card style="border-radius: 50%;text-align: center; width: 180px;height: 180px;">
          <div><br/></div>
          <div><br/></div>
          <count-to :start-val="0" :end-val="channelSuccessRate" :decimals="2" :duration="3600" class="card-panel-num"/>
          <div><br/></div>
          <div class="card-panel-text">
            渠道成功率(%)
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" style="display: flex;justify-content: center;align-items: center">
        <el-card style="border-radius: 50%;text-align: center; width: 180px;height: 180px;">
          <div><br/></div>
          <div><br/></div>
          <count-to :start-val="0" :end-val="matchSuccessRate" :decimals="2" :duration="3600" class="card-panel-num"/>
          <div><br/></div>
          <div class="card-panel-text">
            撮合成功率(%)
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" style="display: flex;justify-content: center;align-items: center">
        <el-card style="border-radius: 50%;text-align: center; width: 180px;height: 180px;">
          <div><br/></div>
          <div><br/></div>
          <count-to :start-val="0" :end-val="chargeSuccessRate" :decimals="2" :duration="3600" class="card-panel-num"/>
          <div><br/></div>
          <div class="card-panel-text">
            充值成功率(%)
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" style="display: flex;justify-content: center;align-items: center">
        <el-card style="border-radius: 50%;text-align: center; width: 180px;height: 180px;margin-right:20px;">
          <div><br/></div>
          <div><br/></div>
          <count-to :start-val="0" :end-val="withdrawSuccessRate" :decimals="2" :duration="3600"
                    class="card-panel-num"/>
          <div><br/></div>
          <div class="card-panel-text">
            提现成功率(%)
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div><br/></div>
    <div class="block">
      <span class="demonstration" style="margin-right:10px;">月份</span>
      <el-date-picker
        v-model="monthDateTwo"
        type="month"
        size="mini"
        value-format="yyyy-MM"
        style="margin-right:10px; width: 150px"
        placeholder="选择月">
      </el-date-picker>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleTwoQuery">查询</el-button>
      <el-button type="primary" size="mini" @click="handleAllQuery">全部</el-button>
    </div>
    <div><br/></div>
    <div id="chargePie" :style="{width: '100%', height: '500px'}"/>
    <div><br/></div>
    <div id="withdrawPie" :style="{width: '100%', height: '500px'}"/>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  import {getStatisOrder, getStatisOrderPro} from "@/api/pay/statis";

  export default {
    components: {
      CountTo
    },
    data() {
      return {
        monthDate: '',
        monthDateTwo: '',
        dateList: [],               //日期数组
        chargeAmountList: [],       //充值成功金额数组
        withdrawAmountList: [],     //提现成功金额数组
        matchAmountList: [],        //撮合成功金额数组
        chargeCountList: [],        //充值订单数数组
        withdrawCountList: [],      //提现订单数数组
        matchCountList: [],         //撮合订单数数组
        channelSuccessRate: 0,      //渠道成功率
        matchSuccessRate: 0,        //撮合成功率
        chargeSuccessRate: 0,       //充值成功率
        withdrawSuccessRate: 0,     //提现成功率
        chargeSucCount: 0,          //充值订单数
        matchChargeSucCount: 0,     //撮合充值订单数
        chargeAmount: 0,            //充值订单金额
        matchChargeAmount: 0,       //撮合充值订单金额
        withdrawSucCount: 0,          //提现订单数
        matchWithdrawSucCount: 0,     //撮合提现订单数
        withdrawAmount: 0,            //提现订单金额
        matchWithdrawAmount: 0,       //撮合提现订单金额

      }
    },
    mounted() {
      this.monthDate = this.getNowTime();
      this.$nextTick(() => {
        this.drawLineOne()
        this.drawLineTwo(0, 0)
      });
    },
    methods: {
      /** 搜索按钮操作 */
      handleQuery() {
        this.drawLineOne()
      },
      /** 搜索按钮操作 */
      handleTwoQuery() {
        this.drawLineTwo(this.monthDate.split('-')[0], this.monthDate.split('-')[1])
      },
      /** 搜索按钮操作 */
      handleAllQuery() {
        this.monthDateTwo = '';
        this.drawLineTwo(0, 0)
      },
      getNowTime() {
        var data = new Date();
        var y = data.getFullYear();
        var m = data.getMonth() + 1;
        return y + '-' + m;
      },
      drawLineOne() {
        let params = {
          part_year: this.monthDate.split('-')[0],
          part_month: this.monthDate.split('-')[1]
        };
        // 基于准备好的dom，初始化echarts实例
        const orderBar = this.$echarts.init(document.getElementById('orderBar'))
        getStatisOrder(params).then(response => {
          this.dateList = response.data.dateList;
          this.chargeAmountList = response.data.chargeAmountList;
          this.withdrawAmountList = response.data.withdrawAmountList;
          this.matchAmountList = response.data.matchAmountList;
          this.chargeCountList = response.data.chargeCountList;
          this.withdrawCountList = response.data.withdrawCountList;
          this.matchCountList = response.data.matchCountList;
          this.channelSuccessRate = response.data.channelSuccessRate;
          this.matchSuccessRate = response.data.matchSuccessRate;
          this.chargeSuccessRate = response.data.chargeSuccessRate;
          this.withdrawSuccessRate = response.data.withdrawSuccessRate;
          orderBar.setOption({
            title: {
              text: '订单走势',
              textStyle: {
                color: '#333333',
                fontSize: 20
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            toolbox: {
              feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
              }
            },
            legend: {
              data: ['充值订单数', '提现订单数', '撮合订单数', '充值成功金额', '提现成功金额', '撮合成功金额']
            },
            xAxis: [
              {
                name: '日期',
                type: 'category',
                data: this.dateList,
                axisPointer: {
                  type: 'shadow'
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '订单数',
              },
              {
                type: 'value',
                name: '金额',
              }
            ],
            series: [
              {
                name: '充值成功金额',
                type: 'bar',
                color: '#138413FF',
                yAxisIndex: 1,
                data: this.chargeAmountList
              },
              {
                name: '提现成功金额',
                type: 'bar',
                color: '#E21313FF',
                yAxisIndex: 1,
                data: this.withdrawAmountList
              },
              {
                name: '撮合成功金额',
                type: 'bar',
                color: '#192EE7FF',
                yAxisIndex: 1,
                data: this.matchAmountList
              },
              {
                name: '充值订单数',
                type: 'line',
                color: '#138413FF',
                yAxisIndex: 0,
                data: this.chargeCountList
              },
              {
                name: '提现订单数',
                type: 'line',
                color: '#E21313FF',
                yAxisIndex: 0,
                data: this.withdrawCountList
              },
              {
                name: '撮合订单数',
                type: 'line',
                color: '#192EE7FF',
                yAxisIndex: 0,
                data: this.matchCountList
              }
            ]
          });
        })
      },
      drawLineTwo(partYear, partMonth) {
        let params = {
          part_year: partYear,
          part_month: partMonth
        };
        const chargePie = this.$echarts.init(document.getElementById('chargePie'))
        const withdrawPie = this.$echarts.init(document.getElementById('withdrawPie'))
        getStatisOrderPro(params).then(response => {
          this.chargeSucCount = response.data.chargeSucCount;
          this.matchChargeSucCount = response.data.matchChargeSucCount;
          this.chargeAmount = response.data.chargeAmount;
          this.matchChargeAmount = response.data.matchChargeAmount;
          this.withdrawSucCount = response.data.withdrawSucCount;
          this.matchWithdrawSucCount = response.data.matchWithdrawSucCount;
          this.withdrawAmount = response.data.withdrawAmount;
          this.matchWithdrawAmount = response.data.matchWithdrawAmount;
          chargePie.setOption({
            title: [
              {
                text: '充值订单',
                textStyle: {
                  color: '#333333',
                  fontSize: 20
                }
              },
              {
                subtext: '充值订单数占比',
                left: '20%',
                textAlign: 'center',
                subtextStyle: {
                  color: '#333333',
                  fontSize: 20
                }
              },
              {
                subtext: '充值订单金额占比',
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
              formatter: '{b}<br/>{c}<br/>{d}%'
            },
            color: ['#6194EAFF', '#E78129FF'],
            series: [
              {
                type: 'pie',
                radius: '50%',
                center: ['50%', '50%'],
                data: [
                  {
                    name: '代收订单',
                    value: this.chargeSucCount
                  },
                  {
                    name: '撮合订单',
                    value: this.matchChargeSucCount
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
                    name: '代收订单',
                    value: this.chargeAmount
                  },
                  {
                    name: '撮合订单',
                    value: this.matchChargeAmount
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
          });

          withdrawPie.setOption({
            title: [
              {
                text: '提现订单',
                textStyle: {
                  color: '#333333',
                  fontSize: 20
                }
              },
              {
                subtext: '提现订单数占比',
                left: '20%',
                textAlign: 'center',
                subtextStyle: {
                  color: '#333333',
                  fontSize: 20
                }
              },
              {
                subtext: '提现订单金额占比',
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
              formatter: '{b}<br/>{c}<br/>{d}%'
            },
            color: ['#6194EAFF', '#E78129FF'],
            series: [
              {
                type: 'pie',
                radius: '50%',
                center: ['50%', '50%'],
                data: [
                  {
                    name: '代付订单',
                    value: this.withdrawSucCount
                  },
                  {
                    name: '撮合订单',
                    value: this.matchWithdrawSucCount
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
                    name: '代付订单',
                    value: this.withdrawAmount
                  },
                  {
                    name: '撮合订单',
                    value: this.matchWithdrawAmount
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
          });
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card-panel-num {
    font-size: 20px;
    color: red;
  }
</style>
