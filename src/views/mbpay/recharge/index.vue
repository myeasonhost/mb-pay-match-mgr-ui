<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商户ID" prop="siteId">
        <el-input
          v-model="queryParams.siteId"
          placeholder="请输入商户ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商户订单号" prop="orderId" label-width="100px">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入商户订单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="玩家ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入玩家ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="支付状态" clearable>
          <el-option
            v-for="dict in dict.type.mbpay_recharge_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间" prop="createTime">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="rechargeList">
      <el-table-column label="支付订单号" align="center" prop="id"/>
      <el-table-column label="商户ID/玩家ID" align="center" prop="siteId" width="120">
        <template slot-scope="scope">
          <div style="color: #13ce66;font-weight: bold;font-size: 13px;">{{ scope.row.siteId }}</div>
          <div style="color: #f4516c;font-weight: bold;font-size: 13px;">{{ scope.row.userId }}</div>
        </template>
      </el-table-column>
      <el-table-column label="商户订单号" align="center" prop="orderId"/>
      <el-table-column label="产品名" align="center" prop="productName"/>
      <el-table-column label="充值明细" align="center" prop="amount" width="130">
        <template slot-scope="scope">
          <div style="color: #1890ff;font-family: 'Arial Black';font-size: small;">
            充值金额：{{ scope.row.amount == null ? "0.00" : scope.row.amount }}
          </div>
          <div style="color: red;font-family: 'Arial Black';font-size: small;">
            换算金额：{{ scope.row.coinAmount == null ? "0.00" : scope.row.coinAmount }}
          </div>
          <div style="color: #f8ac59;font-style: italic;font-size: small;">
            汇率：{{ scope.row.currency == null ? "0.00" : scope.row.currency }}
            / {{ scope.row.coinCode == null ? "0.00" : scope.row.coinCode }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="实际收款" align="center" prop="coinAmount"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mbpay_recharge_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="applyBy"/>
      <el-table-column label="审核时间" align="center" prop="applyTime" width="100"/>
      <el-table-column label="下单时间" align="center" prop="createTime" width="100"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status==6"
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mbpay:recharge:edit']"
          >查看凭证
          </el-button>
          <el-button
            v-if="scope.row.status==4 || scope.row.status==7"
            size="mini"
            type="text"
            icon="el-icon-s-custom"
            @click="handleAdmin(scope.row)"
            v-hasPermi="['mbpay:recharge:edit']"
          >转代付
          </el-button>
          <el-button
            v-if="scope.row.status==5"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mbpay:recharge:edit']"
          >审批
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 查看凭证对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <div style="color: green;font-weight: bold;font-size: 10px;" v-if="form.status==5">
        <div>
          <i class="el-icon-warning"></i>
          <span>&nbsp;&nbsp;&nbsp;温馨提示：请仔细核对收款信息与转账截图凭证一致，确保用户充值交易成功</span>
        </div>
        <div style="color: #f4516c;font-size: 8px;">&nbsp;&nbsp;&nbsp;（1）如果信息匹配，点击按钮【评审通过】，代表用户支付成功；</div>
        <div style="color: #f4516c;font-size: 8px;">&nbsp;&nbsp;&nbsp;（2）如果信息不匹配，点击按钮【评审失败】，代表用户支付失败；</div>
      </div>
      <div/>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商家账号" prop="siteId">
              <el-input v-model="form.siteId" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="玩家ID" prop="userId">
              <el-input v-model="form.userId" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="充值金额" prop="amount">
              <el-input v-model="form.amount" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际收款" prop="coinAmount">
              <el-input v-model="form.coinAmount" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="支付状态" prop="status">
              <dict-tag :options="dict.type.mbpay_recharge_status" :value="form.status"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手续费" prop="currency">
              <el-input v-model="form.currency" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="收款户主" prop="productName">
          <el-input v-model="form.userName" :disabled="true"/>
        </el-form-item>
        <el-form-item label="收款卡号" prop="userBankCard">
          <el-input v-model="form.userBankCard" :disabled="true"/>
        </el-form-item>
        <el-form-item label="收款银行" prop="userBankName">
          <el-input v-model="form.userBankName" :disabled="true"/>
        </el-form-item>
        <el-form-item label="评审意见" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入评审意见" />
        </el-form-item>
        <el-form-item label="图片凭证" prop="payimageUrl" width="300px">
          <el-image :src="form.payimageUrl"></el-image>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitForm(6)" v-if="form.status==5">审批通过</el-button>
        <el-button type="danger" @click="submitForm(7)" v-if="form.status==5">审批失败</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listRecharge, getRecharge, updateRecharge} from "@/api/mbpay/recharge";

export default {
  name: "Recharge",
  dicts: ['mbpay_recharge_status'],
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 充值订单表格数据
      rechargeList: [],
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteId: undefined,
        orderId: undefined,
        userId: undefined,
        matchId: undefined,
        productName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        siteId: [
          {required: true, message: "商户ID不能为空", trigger: "blur"}
        ],
        orderId: [
          {required: true, message: "商户订单号不能为空", trigger: "blur"}
        ],
        remark: [
          {required: true, message: "评审意见不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询充值订单列表 */
    getList() {
      this.loading = true;
      listRecharge(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.rechargeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        siteId: undefined,
        orderId: undefined,
        userId: undefined,
        matchId: undefined,
        productName: undefined,
        amount: undefined,
        currency: undefined,
        coinAmount: undefined,
        coinCode: undefined,
        status: "0",
        notifySucceed: undefined,
        notifyTimes: undefined,
        lastNotifyTime: undefined,
        nextNotifyTime: undefined,
        timeout: undefined,
        payTime: undefined,
        transferTime: undefined,
        applyTime: undefined,
        timeoutTime: undefined,
        cancelTime: undefined,
        finishTime: undefined,
        notifyUrl: undefined,
        redirectUrl: undefined,
        cashierUrl: undefined,
        qrcodeUrl: undefined,
        payimageUrl: undefined,
        remark: undefined,
        createTime: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 修改按钮操作 */
    handleAdmin(row) {
      this.reset();
      this.msgSuccess("请客户手动转账");
      this.open = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRecharge(id).then(response => {
        this.form = response.data;
        this.open = true;
        if (this.form.status==5){
          this.title = "审核订单";
        } else {
          this.title = "订单凭证详情";
        }

      });
    },
    /** 提交按钮 */
    submitForm(status) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.form.status = status;
            updateRecharge(this.form).then(response => {
              this.msgSuccess("审批处理完成");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    }
  }
};
</script>
