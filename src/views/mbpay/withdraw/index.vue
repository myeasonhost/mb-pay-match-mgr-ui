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
      <el-form-item label="商户提单号" prop="withdrawId" label-width="100px">
        <el-input
          v-model="queryParams.withdrawId"
          placeholder="请输入商户提单号"
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
        <el-select v-model="queryParams.status" placeholder="提现状态" clearable>
          <el-option
            v-for="dict in dict.type.mbpay_withdraw_status"
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

    <el-table v-loading="loading" :data="withdrawList" @sort-change="changeSort" @selection-change="handleSelectionChange">
      <el-table-column label="提现订单号" align="center" prop="id"/>
      <el-table-column label="商户ID/玩家ID" align="center" prop="siteId" width="120">
        <template slot-scope="scope">
          <div style="color: #13ce66;font-weight: bold;font-size: 13px;">{{ scope.row.siteId }}</div>
          <div style="color: #f4516c;font-weight: bold;font-size: 13px;">{{ scope.row.userId }}</div>
        </template>
      </el-table-column>
      <el-table-column label="商户提单号" align="center" prop="withdrawId" />
      <el-table-column label="提款明细" align="left" prop="amount" width="130">
        <template slot-scope="scope">
          <div style="color: #1890ff;font-family: 'Arial Black';font-size: small;">
            提现金额：{{ scope.row.amount == null ? "0.00" : scope.row.amount }}
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
      <el-table-column label="提现状态" align="center" prop="status" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mbpay_withdraw_status" :value="scope.row.status"/>
          <dict-tag :options="dict.type.mbpay_notify_status" :value="scope.row.notifySucceed"/>
        </template>
      </el-table-column>
      <el-table-column label="回调次数" align="center" prop="notifyTimes">
        <template slot-scope="scope">
          <div style="color: green;font-family: 'Arial Black';font-size: small;">
            {{ scope.row.notifyTimes == null ? "0" : scope.row.notifyTimes }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="提现时间" align="center" prop="withdrawTime" width="100" sortable="custom"/>
      <el-table-column label="提款人明细" align="left" prop="amount" width="200">
        <template slot-scope="scope">
          <div style="color: #666666;font-size: small;">
            提款姓名：{{ scope.row.userName }}
          </div>
          <div style="color: #666666;font-size: small;">
            提款卡号：{{ scope.row.userBankCard }}
          </div>
          <div style="color: #666666;font-size: small;">
            提款银行：{{ scope.row.userBankName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="applyBy" />
      <el-table-column label="审核时间" align="center" prop="applyTime" width="100" sortable="custom"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status==4 && scope.row.notifySucceed==2"
            size="mini"
            type="text"
            icon="el-icon-phone-outline"
            @click="handleNotify(scope.row)"
            v-hasPermi="['mbpay:withdraw:edit']"
          >手动通知
          </el-button>
          <el-button
            v-if="scope.row.status==1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mbpay:withdraw:edit']"
          >审批</el-button>
          <el-button
            v-if="scope.row.status==0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleCancel(scope.row)"
            v-hasPermi="['mbpay:withdraw:edit']"
          >取消提现
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

    <!-- 添加或修改提现订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <div style="color: green;font-weight: bold;font-size: 10px;">
        <div>
          <i class="el-icon-warning"></i>
          <span>&nbsp;&nbsp;&nbsp;温馨提示：请仔细核对商户余额是否充足，确保用户提现交易成功</span>
        </div>
        <div style="color: #f4516c;font-size: 8px;">&nbsp;&nbsp;&nbsp;（1）如果信息匹配，点击按钮【评审通过】，进行撮合池；</div>
        <div style="color: #f4516c;font-size: 8px;">&nbsp;&nbsp;&nbsp;（2）如果信息不匹配，点击按钮【评审失败】，代表拒绝用户提现；</div>
      </div>
      <div/>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="商家账号" prop="siteId">
              <el-input v-model="form.siteId" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="玩家ID" prop="userId">
              <el-input v-model="form.userId" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="提现金额" prop="amount">
              <el-input v-model="form.amount" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="手续费" prop="currency">
              <el-input v-model="form.currency" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="提现状态" prop="status">
              <dict-tag :options="dict.type.mbpay_withdraw_status" :value="form.status"/>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="提现时间" prop="currency">
              <el-input v-model="form.withdrawTime" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="评审意见" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入评审意见" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitForm(3)" v-if="form.status==1">审批通过</el-button>
        <el-button type="danger" @click="submitForm(2)" v-if="form.status==1">取消提现</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getWithdraw, listWithdraw, updateWithdraw, notifyWithdraw, notifyCancel} from "@/api/mbpay/withdraw";

export default {
  name: "Withdraw",
  dicts: ['mbpay_withdraw_status','mbpay_notify_status'],
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 提现订单表格数据
      withdrawList: [],
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
        withdrawId: undefined,
        userId: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        siteId: [
          { required: true, message: "商户ID不能为空", trigger: "blur" }
        ],
        withdrawId: [
          { required: true, message: "商户提单号不能为空", trigger: "blur" }
        ],
        userId: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "评审意见不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    changeSort(column){
      Object.assign(
        this.queryParams,
        {
          'orderProp': column.prop,
          'orderBy': column.order
        }
      )
      this.getList();
    },
    /** 查询提现订单列表 */
    getList() {
      this.loading = true;
      listWithdraw(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.withdrawList = response.rows;
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
        withdrawId: undefined,
        userId: undefined,
        status: "0",
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 手动通知按钮操作 */
    handleNotify(row) {
      this.reset();
      const id = row.id;
      this.$confirm('此操作将手动告知商户端进行下分操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        notifyWithdraw(id).then(response => {
          this.getList();
          this.msgSuccess('通知已发送!');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消手动'
        });
      });
      this.open = false;
    },
    /** 取消提现按钮操作 */
    handleCancel(row) {
      this.reset();
      const id = row.id;
      this.$confirm('此操作将手动消息通知商户端进行取消提现操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        notifyCancel(id).then(response => {
          this.getList();
          this.msgSuccess('取消提现已经通知');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消通知'
        });
      });
      this.open = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWithdraw(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "审批提现订单";
      });
    },
    /** 提交按钮 */
    submitForm(status) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.form.status = status;
            updateWithdraw(this.form).then(response => {
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
