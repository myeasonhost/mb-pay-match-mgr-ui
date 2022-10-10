<template>
  <el-form ref="form" :model="mbpaySiteInfo" :rules="rules" label-width="100px">
    <el-form-item label="提现金额配置" prop="withdrawAmountList"
                  size="mini">
      <el-input type="textarea" v-model="mbpaySiteInfo.withdrawAmountList" placeholder=""
                maxlength="200" :rows="3"/>
    </el-form-item>

    <el-form-item label="拆分金额列表" prop="withdrawSplitConfig"
                  size="mini">
      <el-input type="textarea"  v-model="mbpaySiteInfo.withdrawSplitConfig"
                placeholder="" :rows="7"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { updateWithdrawList } from "@/api/pay/siteinfo";

export default {
  props: {
    mbpaySiteInfo: {
      type: Object
    }
  },
  data() {
    return {
      // 表单校验
      rules: {}
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateWithdrawList(this.mbpaySiteInfo).then(response => {
            this.$modal.msgSuccess("修改成功");
          });
        }
      });
    },
    close() {
      this.$tab.closePage();
    }
  }
};
</script>
