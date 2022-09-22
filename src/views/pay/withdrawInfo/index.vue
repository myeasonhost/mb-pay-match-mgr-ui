<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单号" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="银行账户" prop="bankNum">
        <el-input
          v-model="queryParams.bankNum"
          placeholder="请输入银行账户"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="0=待审核,1=提现成功,2=提现失败,3=取消" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择0=待审核,1=提现成功,2=提现失败,3=取消" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['pay:withdrawInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['pay:withdrawInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['pay:withdrawInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['pay:withdrawInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="withdrawInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" v-if="false"/>
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="商家ID" align="center" prop="siteId" />
      <el-table-column label="商家名称" align="center" prop="siteName" />
      <el-table-column label="订单号" align="center" prop="orderId" />
      <el-table-column label="币种 USDT/RMB" align="center" prop="currency" />
      <el-table-column label="提现金额" align="center" prop="withdrawAmount" />
      <el-table-column label="姓名" align="center" prop="userName" />
      <el-table-column label="银行卡名称" align="center" prop="bankName" />
      <el-table-column label="银行账户" align="center" prop="bankNum" />
      <el-table-column label="支行名称" align="center" prop="branchName" />
      <el-table-column label="银行编码" align="center" prop="bankCode" />
      <el-table-column label="USDT数量" align="center" prop="usdtCount" />
      <el-table-column label="地址名称" align="center" prop="addrName" />
      <el-table-column label="协议" align="center" prop="protocol" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="截图地址" align="center" prop="payimageUrl" />
      <el-table-column label="操作人" align="center" prop="operCode" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="0=待审核,1=提现成功,2=提现失败,3=取消" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pay:withdrawInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pay:withdrawInfo:remove']"
          >删除</el-button>
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

    <!-- 添加或修改提现管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="商家ID" prop="siteId">
          <el-input v-model="form.siteId" placeholder="请输入商家ID" />
        </el-form-item>
        <el-form-item label="商家名称" prop="siteName">
          <el-input v-model="form.siteName" placeholder="请输入商家名称" />
        </el-form-item>
        <el-form-item label="订单号" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="币种 USDT/RMB" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入币种 USDT/RMB" />
        </el-form-item>
        <el-form-item label="提现金额" prop="withdrawAmount">
          <el-input v-model="form.withdrawAmount" placeholder="请输入提现金额" />
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="银行卡名称" prop="bankName">
          <el-input v-model="form.bankName" placeholder="请输入银行卡名称" />
        </el-form-item>
        <el-form-item label="银行账户" prop="bankNum">
          <el-input v-model="form.bankNum" placeholder="请输入银行账户" />
        </el-form-item>
        <el-form-item label="支行名称" prop="branchName">
          <el-input v-model="form.branchName" placeholder="请输入支行名称" />
        </el-form-item>
        <el-form-item label="银行编码" prop="bankCode">
          <el-input v-model="form.bankCode" placeholder="请输入银行编码" />
        </el-form-item>
        <el-form-item label="USDT数量" prop="usdtCount">
          <el-input v-model="form.usdtCount" placeholder="请输入USDT数量" />
        </el-form-item>
        <el-form-item label="地址名称" prop="addrName">
          <el-input v-model="form.addrName" placeholder="请输入地址名称" />
        </el-form-item>
        <el-form-item label="协议" prop="protocol">
          <el-input v-model="form.protocol" placeholder="请输入协议" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="截图地址" prop="payimageUrl">
          <el-input v-model="form.payimageUrl" placeholder="请输入截图地址" />
        </el-form-item>
        <el-form-item label="操作人" prop="operCode">
          <el-input v-model="form.operCode" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="0=待审核,1=提现成功,2=提现失败,3=取消" prop="status">
          <el-select v-model="form.status" placeholder="请选择0=待审核,1=提现成功,2=提现失败,3=取消">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWithdrawInfo, getWithdrawInfo, delWithdrawInfo, addWithdrawInfo, updateWithdrawInfo, exportWithdrawInfo } from "@/api/pay/withdrawInfo";

export default {
  name: "WithdrawInfo",
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
      // 提现管理表格数据
      withdrawInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderId: undefined,
        bankNum: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        siteId: [
          { required: true, message: "商家ID不能为空", trigger: "blur" }
        ],
        siteName: [
          { required: true, message: "商家名称不能为空", trigger: "blur" }
        ],
        orderId: [
          { required: true, message: "订单号不能为空", trigger: "blur" }
        ],
        currency: [
          { required: true, message: "币种 USDT/RMB不能为空", trigger: "blur" }
        ],
        withdrawAmount: [
          { required: true, message: "提现金额不能为空", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        bankName: [
          { required: true, message: "银行卡名称不能为空", trigger: "blur" }
        ],
        bankNum: [
          { required: true, message: "银行账户不能为空", trigger: "blur" }
        ],
        branchName: [
          { required: true, message: "支行名称不能为空", trigger: "blur" }
        ],
        bankCode: [
          { required: true, message: "银行编码不能为空", trigger: "blur" }
        ],
        usdtCount: [
          { required: true, message: "USDT数量不能为空", trigger: "blur" }
        ],
        addrName: [
          { required: true, message: "地址名称不能为空", trigger: "blur" }
        ],
        protocol: [
          { required: true, message: "协议不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "地址不能为空", trigger: "blur" }
        ],
        payimageUrl: [
          { required: true, message: "截图地址不能为空", trigger: "blur" }
        ],
        operCode: [
          { required: true, message: "操作人不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    //this.getList();
  },
  methods: {
    /** 查询提现管理列表 */
    getList() {
      this.loading = true;
      listWithdrawInfo(this.queryParams).then(response => {
        this.withdrawInfoList = response.rows;
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
        userId: undefined,
        siteId: undefined,
        siteName: undefined,
        orderId: undefined,
        currency: undefined,
        withdrawAmount: undefined,
        userName: undefined,
        bankName: undefined,
        bankNum: undefined,
        branchName: undefined,
        bankCode: undefined,
        usdtCount: undefined,
        addrName: undefined,
        protocol: undefined,
        address: undefined,
        payimageUrl: undefined,
        operCode: undefined,
        remark: undefined,
        status: undefined,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加提现管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWithdrawInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改提现管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWithdrawInfo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWithdrawInfo(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除提现管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delWithdrawInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有提现管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportWithdrawInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
