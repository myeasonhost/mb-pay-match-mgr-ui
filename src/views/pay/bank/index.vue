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
      <el-form-item label="银行卡名称" prop="bankName">
        <el-input
          v-model="queryParams.bankName"
          placeholder="请输入银行卡名称"
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
      <el-form-item label="支行名称" prop="branchName">
        <el-input
          v-model="queryParams.branchName"
          placeholder="请输入支行名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="actualName">
        <el-input
          v-model="queryParams.actualName"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="银行编码" prop="bankId">
        <el-input
          v-model="queryParams.bankId"
          placeholder="请输入银行编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="币种" prop="currency">
        <el-input
          v-model="queryParams.currency"
          placeholder="请输入币种"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="每日限额" prop="dailyLimit">
        <el-input
          v-model="queryParams.dailyLimit"
          placeholder="请输入每日限额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="每月限额" prop="monthlyLimit">
        <el-input
          v-model="queryParams.monthlyLimit"
          placeholder="请输入每月限额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单笔限额" prop="singleLimit">
        <el-input
          v-model="queryParams.singleLimit"
          placeholder="请输入单笔限额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单日收款额度" prop="dayReceiptAmount">
        <el-input
          v-model="queryParams.dayReceiptAmount"
          placeholder="请输入单日收款额度"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="累计收款金额" prop="totalReceiptAmount">
        <el-input
          v-model="queryParams.totalReceiptAmount"
          placeholder="请输入累计收款金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="录入人" prop="operCode">
        <el-input
          v-model="queryParams.operCode"
          placeholder="请输入录入人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="1=启用,2=禁用,3=只收不付,4=只付不收,5=不收不付" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择1=启用,2=禁用,3=只收不付,4=只付不收,5=不收不付" clearable size="small">
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
          v-hasPermi="['pay:bank:add']"
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
          v-hasPermi="['pay:bank:edit']"
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
          v-hasPermi="['pay:bank:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['pay:bank:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bankList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" v-if="false"/>
      <el-table-column label="商户ID" align="center" prop="siteId" />
      <el-table-column label="银行卡名称" align="center" prop="bankName" />
      <el-table-column label="银行账户" align="center" prop="bankNum" />
      <el-table-column label="支行名称" align="center" prop="branchName" />
      <el-table-column label="姓名" align="center" prop="actualName" />
      <el-table-column label="银行编码" align="center" prop="bankId" />
      <el-table-column label="币种" align="center" prop="currency" />
      <el-table-column label="每日限额" align="center" prop="dailyLimit" />
      <el-table-column label="每月限额" align="center" prop="monthlyLimit" />
      <el-table-column label="单笔限额" align="center" prop="singleLimit" />
      <el-table-column label="单日收款额度" align="center" prop="dayReceiptAmount" />
      <el-table-column label="累计收款金额" align="center" prop="totalReceiptAmount" />
      <el-table-column label="录入人" align="center" prop="operCode" />
      <el-table-column label="1=启用,2=禁用,3=只收不付,4=只付不收,5=不收不付" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pay:bank:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pay:bank:remove']"
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

    <!-- 添加或修改收款银行对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商户ID" prop="siteId">
          <el-input v-model="form.siteId" placeholder="请输入商户ID" />
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
        <el-form-item label="姓名" prop="actualName">
          <el-input v-model="form.actualName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="银行编码" prop="bankId">
          <el-input v-model="form.bankId" placeholder="请输入银行编码" />
        </el-form-item>
        <el-form-item label="币种" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入币种" />
        </el-form-item>
        <el-form-item label="每日限额" prop="dailyLimit">
          <el-input v-model="form.dailyLimit" placeholder="请输入每日限额" />
        </el-form-item>
        <el-form-item label="每月限额" prop="monthlyLimit">
          <el-input v-model="form.monthlyLimit" placeholder="请输入每月限额" />
        </el-form-item>
        <el-form-item label="单笔限额" prop="singleLimit">
          <el-input v-model="form.singleLimit" placeholder="请输入单笔限额" />
        </el-form-item>
        <el-form-item label="单日收款额度" prop="dayReceiptAmount">
          <el-input v-model="form.dayReceiptAmount" placeholder="请输入单日收款额度" />
        </el-form-item>
        <el-form-item label="累计收款金额" prop="totalReceiptAmount">
          <el-input v-model="form.totalReceiptAmount" placeholder="请输入累计收款金额" />
        </el-form-item>
        <el-form-item label="录入人" prop="operCode">
          <el-input v-model="form.operCode" placeholder="请输入录入人" />
        </el-form-item>
        <el-form-item label="1=启用,2=禁用,3=只收不付,4=只付不收,5=不收不付">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { listBank, getBank, delBank, addBank, updateBank, exportBank } from "@/api/pay/bank";

export default {
  name: "Bank",
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
      // 收款银行表格数据
      bankList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteId: undefined,
        bankName: undefined,
        bankNum: undefined,
        branchName: undefined,
        actualName: undefined,
        bankId: undefined,
        currency: undefined,
        dailyLimit: undefined,
        monthlyLimit: undefined,
        singleLimit: undefined,
        dayReceiptAmount: undefined,
        totalReceiptAmount: undefined,
        operCode: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        bankName: [
          { required: true, message: "银行卡名称不能为空", trigger: "blur" }
        ],
        bankNum: [
          { required: true, message: "银行账户不能为空", trigger: "blur" }
        ],
        branchName: [
          { required: true, message: "支行名称不能为空", trigger: "blur" }
        ],
        bankId: [
          { required: true, message: "银行编码不能为空", trigger: "blur" }
        ],
        currency: [
          { required: true, message: "币种不能为空", trigger: "blur" }
        ],
        operCode: [
          { required: true, message: "录入人不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "录入人不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询收款银行列表 */
    getList() {
      this.loading = true;
      listBank(this.queryParams).then(response => {
        this.bankList = response.rows;
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
        bankName: undefined,
        bankNum: undefined,
        branchName: undefined,
        actualName: undefined,
        bankId: undefined,
        currency: undefined,
        dailyLimit: undefined,
        monthlyLimit: undefined,
        singleLimit: undefined,
        dayReceiptAmount: undefined,
        totalReceiptAmount: undefined,
        operCode: undefined,
        status: "0",
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
      this.title = "添加收款银行";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBank(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改收款银行";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBank(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBank(this.form).then(response => {
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
      this.$confirm('是否确认删除收款银行编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBank(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有收款银行数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportBank(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
