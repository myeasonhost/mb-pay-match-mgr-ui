<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane label="盈利统计" name="1">
      <ProfitStatis v-if="activeTab === '1'"/>
    </el-tab-pane>
    <el-tab-pane label="订单统计" name="2">
      <OrderStatis v-if="activeTab === '2'"/>
    </el-tab-pane>
  </el-tabs>
</template>


<script>
  import ProfitStatis from "./statis/ProfitStatis";
  import OrderStatis from "./statis/OrderStatis";
  export default {
    components: {ProfitStatis,OrderStatis},
    data() {
      return {
        activeTab: "1"

      }
    },
    mounted() {
    },
    methods: {

    }
  }
</script>


