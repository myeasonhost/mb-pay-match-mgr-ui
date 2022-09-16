<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="85px">
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
      <el-form-item label="币种" prop="currency">
        <el-select
          v-model="queryParams.currency"
          placeholder="全部"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.mbpay_currency"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
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
        >新增
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">
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
            -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bankList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center" prop="id"/>
      <el-table-column label="商户ID" align="center" prop="siteId" width="200"/>
      <el-table-column label="银行卡明细" align="left" prop="bankName" width="200">
        <template slot-scope="scope">
          <div style="color: #666666;font-family: 'Arial Black';font-size: small;">
            银行卡名称：{{ scope.row.bankName }}
          </div>
          <div style="color: #666666;font-family: 'Arial Black';font-size: small;">
            银行账户：{{ scope.row.bankNum }}
          </div>
          <div style="color: #666666;font-family: 'Arial Black';font-size: small;">
            支行名称：{{ scope.row.branchName }}
          </div>
          <div style="color: #666666;font-family: 'Arial Black';font-size: small;">
            姓名：{{ scope.row.userName }}
          </div>
          <div style="color: #666666;font-family: 'Arial Black';font-size: small;">
            银行编码：{{ scope.row.bankCode }}
          </div>
          <div style="color: #666666;font-family: 'Arial Black';font-size: small;">
            币种：{{ scope.row.currency }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="限额与收款明细" align="left" prop="dayLimit" width="200">
        <template slot-scope="scope">
          <div style="color: #ff6600;font-family: 'Arial Black';font-size: small;">
            每日限额：{{ scope.row.dayLimit == null ? "0.00" : scope.row.dayLimit }}
          </div>
          <div style="color: #ff3333;font-family: 'Arial Black';font-size: small;">
            每月限额：{{ scope.row.monthLimit == null ? "0.00" : scope.row.monthLimit }}
          </div>
          <div style="color: #cc0000;font-family: 'Arial Black';font-size: small;">
            单笔限额：{{ scope.row.singleLimit == null ? "0.00" : scope.row.singleLimit }}
          </div>
          <div style="color: #ff0000;font-family: 'Arial Black';font-size: small;">
            当日收款金额：{{ scope.row.dayReceiptAmount == null ? "0.00" : scope.row.dayReceiptAmount }}
          </div>
          <div style="color: #ff0000;font-family: 'Arial Black';font-size: small;">
            本月收款金额：{{ scope.row.monthReceiptAmount == null ? "0.00" : scope.row.monthReceiptAmount }}
          </div>
          <div style="color: #1890ff;font-family: 'Arial Black';font-size: small;">
            累计收款金额：{{ scope.row.totalReceiptAmount == null ? "0.00" : scope.row.totalReceiptAmount }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="录入人" align="center" prop="operCode"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mbpay_bank_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="录入时间" align="center" prop="createTime" sortable="custom"
                       :sort-orders="['descending', 'ascending']" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pay:bank:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pay:bank:remove']"
          >删除
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

    <!-- 添加或修改收款银行对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="银行卡名称" prop="bankName">
              <el-input v-model="form.bankName" placeholder="请输入银行卡名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支行名称" prop="branchName">
              <el-input v-model="form.branchName" placeholder="请输入支行名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="银行账户" prop="bankNum">
              <el-input v-model="form.bankNum" placeholder="请输入银行账户"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入姓名"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="银行编码" prop="bankCode">
              <el-input v-model="form.bankCode" placeholder="请输入银行编码"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="币种" prop="currency">
              <el-select
                v-model="form.currency"
                placeholder="请选择"
                clearable
                style="width: 240px"
              >
                <el-option
                  v-for="dict in dict.type.mbpay_currency"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="每日限额" prop="dayLimit">
              <el-input v-model="form.dayLimit" placeholder="请输入每日限额"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每月限额" prop="monthLimit">
              <el-input v-model="form.monthLimit" placeholder="请输入每月限额"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单笔限额" prop="singleLimit">
              <el-input v-model="form.singleLimit" placeholder="请输入单笔限额"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="form.status"
                clearable
                style="width: 240px"
              >
                <el-option
                  v-for="dict in dict.type.mbpay_bank_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark" placeholder="请输入备注" />
                </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {listBank, getBank, delBank, addBank, updateBank, exportBank, checkBankNum} from "@/api/pay/bank";

  export default {
    name: "Bank",
    dicts: ['mbpay_currency', 'mbpay_bank_status'],
    components: {},
    data() {
      const checkAmount = (rule, value, callback) => {
        if (value) {
          var reg = /^[0-9]{0,16}$/
          if (reg.test(value) === false) {
            callback(new Error("只能输入16位正整数"))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      const checkBankNum = (rule, value, callback) => {
        if (value) {
          this.checkBankNumber(value).then(response => {
            if(response.code === 200){
              callback()
            }else{
              callback(new Error("银行账户已存在，请重新输入"))
            }
          }).catch(err => {
            callback(new Error("银行账户已存在，请重新输入"))
          })
          return;
        }
        callback();
      }
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
        //登录用户信息
        user: {},
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
          userName: undefined,
          bankCode: undefined,
          currency: undefined,
          dayLimit: undefined,
          monthLimit: undefined,
          singleLimit: undefined,
          dayReceiptAmount: undefined,
          monthReceiptAmount: undefined,
          totalReceiptAmount: undefined,
          operCode: undefined,
          status: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          bankName: [
            {required: true, message: "请输入银行卡名称", trigger: "blur"},
            {min: 2, max: 100, message: "长度2-100个字符", trigger: "blur"}
          ],
          bankNum: [
            {required: true, message: "请输入银行账户", trigger: "blur"},
            {min: 1, max: 20, message: "长度1-20个字符", trigger: "blur"},
            {trigger: "blur", validator: checkBankNum}//自定义规则
          ],
          branchName: [
            {min: 2, max: 100, message: "长度2-100个字符", trigger: "blur"}
          ],
          userName: [
            {required: true, message: "请输入姓名", trigger: "blur"},
            {min: 1, max: 50, message: "长度1-50个字符", trigger: "blur"}
          ],
          bankCode: [
            {min: 0, max: 20, message: "长度0-20个字符", trigger: "blur"}
          ],
          currency: [
            {required: true, message: "请选择币种", trigger: "blur"}
          ],
          dayLimit: [
            {trigger: "blur", validator: checkAmount}//自定义规则
          ],
          monthLimit: [
            {trigger: "blur", validator: checkAmount}//自定义规则
          ],
          singleLimit: [
            {trigger: "blur", validator: checkAmount}//自定义规则
          ]
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
          siteId: "admin",
          bankName: undefined,
          bankNum: undefined,
          branchName: undefined,
          userName: undefined,
          bankCode: undefined,
          currency: undefined,
          dayLimit: undefined,
          monthLimit: undefined,
          singleLimit: undefined,
          dayReceiptAmount: undefined,
          monthReceiptAmount: undefined,
          totalReceiptAmount: undefined,
          operCode: this.$store.state.user.name,
          status: "1",
          remark: undefined,
          createTime: undefined,
          updateTime: undefined,
          partDay: undefined,
          partMon: undefined
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
              this.form
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
        }).then(function () {
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
        }).then(function () {
          return exportBank(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      },
      //验证银行卡号是否存在
      checkBankNumber(bankNum) {
        return checkBankNum(bankNum,this.form.id)
      }
    }
  };
</script>
