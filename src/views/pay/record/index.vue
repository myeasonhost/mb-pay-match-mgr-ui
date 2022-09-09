<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="85px">
      <el-form-item label="平台订单号" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入平台订单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="银行名称" prop="bankName">
        <el-input
          v-model="queryParams.bankName"
          placeholder="请输入银行名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="银行账号" prop="bankNum">
        <el-input
          v-model="queryParams.bankNum"
          placeholder="请输入银行账号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="币种" prop="currency">
        <el-select v-model="queryParams.currency" placeholder="请选择币种" clearable size="small">
          <el-option
            v-for="dict in currencyOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['pay:record:add']"
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
          v-hasPermi="['pay:record:edit']"
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
          v-hasPermi="['pay:record:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['pay:record:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center" prop="id" width="120"/>
      <el-table-column label="平台订单号" align="center" prop="orderId"/>
      <el-table-column label="银行卡明细" align="left" prop="bankName">
        <template slot-scope="scope">
          <div style="color: #666666;font-family: 'Arial Black';font-size: small;">
            币种：{{ scope.row.currency }}
          </div>
          <div style="color: #666666;font-family: 'Arial Black';font-size: small;">
            银行名称：{{ scope.row.bankName }}
          </div>
          <div style="color: #666666;font-family: 'Arial Black';font-size: small;">
            支行名称：{{ scope.row.branchName }}
          </div>
          <div style="color: #666666;font-family: 'Arial Black';font-size: small;">
            姓名：{{ scope.row.userName }}
          </div>
          <div style="color: #666666;font-family: 'Arial Black';font-size: small;">
            银行账户：{{ scope.row.bankNum }}
          </div>
          <div style="color: #666666;font-family: 'Arial Black';font-size: small;">
            银行编码：{{ scope.row.bankCode }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="收款明细" align="left" prop="receiptAmount">
        <template slot-scope="scope">
          <div style="color: red;font-family: 'Arial Black';font-size: small;">
            收款金额：{{ scope.row.receiptAmount == null ? "0.00" : scope.row.receiptAmount }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="收款时间" align="center" prop="createTime" sortable="custom"
                       :sort-orders="['descending', 'ascending']">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pay:record:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pay:record:remove']"
          >删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改收款记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商户ID" prop="siteId">
          <el-input v-model="form.siteId" placeholder="请输入商户ID" />
        </el-form-item>
        <el-form-item label="平台订单号" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入平台订单号" />
        </el-form-item>
        <el-form-item label="币种" prop="currency">
          <el-select v-model="form.currency" placeholder="请选择币种">
            <el-option
              v-for="dict in currencyOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="银行卡名称" prop="bankName">
          <el-input v-model="form.bankName" placeholder="请输入银行卡名称" />
        </el-form-item>
        <el-form-item label="支行名称" prop="branchName">
          <el-input v-model="form.branchName" placeholder="请输入支行名称" />
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="银行账户" prop="bankNum">
          <el-input v-model="form.bankNum" placeholder="请输入银行账户" />
        </el-form-item>
        <el-form-item label="收款金额" prop="receiptAmount">
          <el-input v-model="form.receiptAmount" placeholder="请输入收款金额" />
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
import { listRecord, getRecord, delRecord, addRecord, updateRecord, exportRecord } from "@/api/pay/record";

export default {
  name: "Record",
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
      // 收款记录表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 币种字典
      currencyOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteId: undefined,
        orderId: undefined,
        currency: undefined,
        bankName: undefined,
        branchName: undefined,
        userName: undefined,
        bankNum: undefined,
        receiptAmount: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        siteId: [
          { required: true, message: "商户ID不能为空", trigger: "blur" }
        ],
        orderId: [
          { required: true, message: "平台订单号不能为空", trigger: "blur" }
        ],
        bankName: [
          { required: true, message: "银行卡名称不能为空", trigger: "blur" }
        ],
        branchName: [
          { required: true, message: "支行名称不能为空", trigger: "blur" }
        ],
        bankNum: [
          { required: true, message: "银行账户不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "银行账户不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("mbpay_currency").then(response => {
      this.currencyOptions = response.data;
    });
  },
  methods: {
    /** 查询收款记录列表 */
    getList() {
      this.loading = true;
      listRecord(this.queryParams).then(response => {
        this.recordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 币种字典翻译
    currencyFormat(row, column) {
      return this.selectDictLabel(this.currencyOptions, row.currency);
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
        currency: undefined,
        bankName: undefined,
        branchName: undefined,
        userName: undefined,
        bankNum: undefined,
        receiptAmount: undefined,
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
      this.title = "添加收款记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改收款记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRecord(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRecord(this.form).then(response => {
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
      this.$confirm('是否确认删除收款记录编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRecord(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有收款记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRecord(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
