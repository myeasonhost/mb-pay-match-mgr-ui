<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="商家账号" prop="siteAccount">
        <el-input
          v-model="queryParams.siteAccount"
          placeholder="请输入商家账号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商家名称" prop="siteName">
        <el-input
          v-model="queryParams.siteName"
          placeholder="请输入商家名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商家ID" prop="siteId">
        <el-input
          v-model="queryParams.siteId"
          placeholder="请输入商家ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态">
          <el-option
            v-for="dict in dict.type.site_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="创建时间">
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['pay:siteinfo:add']"
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
          v-hasPermi="['pay:siteinfo:edit']"
        >编辑</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['pay:siteinfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['pay:siteinfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="siteList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"  />
      <el-table-column label="序号" align="center" prop="id" v-if="false"/>
      <el-table-column label="商家账号" align="center" prop="siteAccount" />
      <el-table-column label="商家名称" align="center" prop="siteName" />
      <el-table-column label="商家ID" align="center" prop="siteId" />
      <el-table-column label="信用等级" align="center" prop="creditRating" />
      <el-table-column label="充值费率" align="center" prop="chargeRate" >
        <template slot-scope="scope">
          <div>{{scope.row.chargeRate}}%</div>
        </template>
      </el-table-column>
      <el-table-column label="提现费率" align="center" prop="withdrawRate" >
        <template slot-scope="scope">
          <div>{{scope.row.withdrawRate}}%</div>
        </template>
      </el-table-column>
      <el-table-column label="撮合充值费率" align="center" prop="chChargeRate"  >
        <template slot-scope="scope">
          <div>{{scope.row.chChargeRate}}%</div>
        </template>
      </el-table-column>
      <el-table-column label="撮合提现费率" align="center" prop="chWithdrawRate" >
        <template slot-scope="scope">
          <div>{{scope.row.chWithdrawRate}}%</div>
        </template>
      </el-table-column>
      <el-table-column label="当前余额" align="center" prop="balance" />
      <el-table-column label="冻结金额" align="center" prop="freeBalance" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" >
        <template slot-scope="scope">
          <div>{{parseTime(scope.row.createTime)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleShow(scope.row)"
            v-hasPermi="['pay:siteinfo:edit']"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pay:siteinfo:edit']"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pay:siteinfo:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-refresh"
            @click="handleUpdPwd(scope.row,1)"
            v-hasPermi="['pay:siteinfo:updPwd']"
          >重置密码</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-refresh"
            @click="handleUpdPwd(scope.row,2)"
            v-hasPermi="['pay:siteinfo:updPwd']"
          >重置交易密码</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleBalance(scope.row)"
            v-hasPermi="['pay:siteinfo:upBalance']"
          >额度调整</el-button>
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

    <!-- 添加或编辑商户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商家账号" prop="siteAccount"  v-if="['update', 'show','add','balance'].includes(type)">
          <el-input :disabled="['update', 'show','balance'].includes(type)" v-model="form.siteAccount" placeholder="请输入商家账号"  />
        </el-form-item>
        <el-form-item label="商家ID" prop="siteId" v-if="['update', 'show','balance'].includes(type)" >
          <el-input :disabled="['update', 'show','balance'].includes(type)" v-model="form.siteId" placeholder="请输入商家ID" />
        </el-form-item>
        <el-form-item label="商家名称" prop="siteName" >
          <el-input :disabled="['show','balance'].includes(type)" v-model="form.siteName" placeholder="请输入商家名称" />
        </el-form-item>
        <el-form-item label="密码" prop="sitePwd"  v-if="['add'].includes(type)">
          <el-input :disabled="['show'].includes(type)" v-model="form.sitePwd" placeholder="请输入密码"  />
        </el-form-item>
        <el-form-item label="交易密码" prop="siteTransactionPwd"  v-if="['add'].includes(type)">
          <el-input :disabled="['show'].includes(type)" v-model="form.siteTransactionPwd" placeholder="请输入交易密码"  />
        </el-form-item>
        <el-form-item label="信用等级" prop="creditRating" v-if="['update', 'show','add'].includes(type)">
          <el-select :disabled="['show'].includes(type)" v-model="form.creditRating" placeholder="请选择信用等级">
            <el-option
              v-for="dict in dict.type.mbpay_credit_rating"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            >{{dict.label}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充值费率" prop="chargeRate" v-if="['update', 'show','add'].includes(type)">
          <el-input :disabled="['show'].includes(type)" v-model="form.chargeRate" placeholder="请输入充值费率" />
        </el-form-item>
        <el-form-item label="提现费率" prop="withdrawRate" v-if="['update', 'show','add'].includes(type)">
          <el-input :disabled="['show'].includes(type)" v-model="form.withdrawRate" placeholder="请输入提现费率" />
        </el-form-item>
        <el-form-item label="撮合充值费率" prop="chChargeRate" v-if="['update', 'show','add'].includes(type)">
          <el-input :disabled="['show'].includes(type)" v-model="form.chChargeRate" placeholder="请输入撮合充值费率" />
        </el-form-item>
        <el-form-item label="撮合提现费率" prop="chWithdrawRate" v-if="['update', 'show','add'].includes(type)">
          <el-input :disabled="['show'].includes(type)" v-model="form.chWithdrawRate" placeholder="请输入撮合提现费率" />
        </el-form-item>
        <el-form-item label="姓" prop="surname" v-if="['update', 'show','add'].includes(type)">
          <el-input :disabled="['show'].includes(type)" v-model="form.surname" placeholder="请输入姓" />
        </el-form-item>
        <el-form-item label="名" prop="name" v-if="['update', 'show','add'].includes(type)">
          <el-input :disabled="['show'].includes(type)" v-model="form.name" placeholder="请输入名" />
        </el-form-item>
        <el-form-item label="证件类型" prop="documentType" v-if="['update', 'show','add'].includes(type)">
          <el-select :disabled="['show'].includes(type)" v-model="form.documentType" placeholder="请选择证件类型">
            <el-option
              v-for="dict in dict.type.mbpay_document_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            >{{dict.label}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号" prop="idNo" v-if="['update', 'show','add'].includes(type)">
          <el-input :disabled="['show'].includes(type)" v-model="form.idNo" placeholder="请输入证件号" />
        </el-form-item>
        <el-form-item label="性别" v-if="['update', 'show','add'].includes(type)">
          <el-select :disabled="['show'].includes(type)" v-model="form.gender" placeholder="请选择性别">
            <el-option
              v-for="dict in dict.type.sys_user_sex"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            >{{dict.label}}</el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="手机号" prop="phone" v-if="['update', 'show','add'].includes(type)">
          <el-input :disabled="['show'].includes(type)" v-model="form.phone" placeholder="请输入手机号"  maxlength="11" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email" v-if="['update', 'show','add'].includes(type)">
          <el-input :disabled="['show'].includes(type)" v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="联系地址" prop="address" v-if="['update', 'show','add'].includes(type)">
          <el-input :disabled="['show'].includes(type)" v-model="form.address" placeholder="请输入联系地址" />
        </el-form-item>
        <el-form-item label="备注" prop="remark" v-if="['update', 'show','add'].includes(type)">
          <el-input :disabled="['show'].includes(type)" v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>

       <el-form-item label="调整类型" prop="balance_type" placeholder="请选择调整类型" v-if="['balance'].includes(type)">
          <el-select  v-model="form.balance_type">
            <el-option label="增加" value="6" />
            <el-option label="扣除" value="7" />
          </el-select>
        </el-form-item>

        <el-form-item label="金额" prop="balance" v-if="['balance'].includes(type)">
          <el-input  v-model="form.balance"   placeholder="请输入金额"  maxlength="11" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!['show','balance'].includes(type)" type="primary" @click="submitForm">确 定</el-button>
        <el-button v-if="['balance'].includes(type)" type="primary" @click="balanceForm"  >调整余额</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSiteInfo, userRules ,getSiteInfo, delSiteInfo,updPwdSiteInfo, addSiteInfo,changeSiteStatus, updateSiteInfo, updateSiteInfoBalance,exportSiteInfo } from "@/api/pay/siteinfo";

export default {
  name: "SiteInfo",
  dicts:['site_status','mbpay_document_type','sys_user_sex','mbpay_credit_rating'],
  components: {
  },
  data() {
    //失去焦点的时候校验商家账号是否存在
    var checkSiteAccount = (rule, value, callback) => {
      if (value != "") {
        if(this.SiteAccountRules()){
          callback(new Error("商家账号已存在，请重新输入"))
        }else{
          callback()
        }

      }
      callback();
    };
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
      // 商户表格数据
      siteList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 当前编辑类型
      type: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: undefined,
        siteId: undefined,
        siteAccount: undefined,
        sitePwd: undefined,
        siteTransactionPwd: undefined,
        siteName: undefined,
        creditRating: undefined,
        chargeRate: undefined,
        withdrawRate: undefined,
        chChargeRate: undefined,
        chWithdrawRate: undefined,
        surname: undefined,
        name: undefined,
        documentType: undefined,
        idNo: undefined,
        gender: undefined,
        phone: undefined,
        email: undefined,
        address: undefined,
        balance: undefined,
        freeBalance: undefined,
        status: undefined,
      },
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        siteName: [
          { required: true, message: "商家名称不能为空", trigger: "blur" },
          { min: 2, max: 50, message: '2-50位字母数字组合', trigger: 'blur' },
          {
            pattern:/^[a-zA-Z0-9]+$/,
            message: "请输入正确的商家名称",
            trigger: "blur"
          }
        ],
        siteAccount:[
          { required: true, message: "商家账号不能为空", trigger: "blur" },
          { min: 4,   max: 20, message: "4-20位字母数字组合",  trigger: "blur"},
          { validator: checkSiteAccount, trigger: "blur" },
        ],
        chargeRate: [
          { required: true, message: "充值费率不能为空", trigger: "blur" }
        ],
        withdrawRate: [
          { required: true, message: "提现费率不能为空", trigger: "blur" }
        ],
        chChargeRate: [
          { required: true, message: "撮合充值费率不能为空", trigger: "blur" }
        ],
        chWithdrawRate: [
          { required: true, message: "撮合提现费率不能为空", trigger: "blur" }
        ],
        balance: [
          { required: true, message: "金额不能为空", trigger: "blur" },{
            pattern:/^\+?[1-9]\d*$/,
            message: "请输入正确的金额",
            trigger: "blur"
          }
        ],
        balance_type: [
          { required: true, message: "类型不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },{
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商户列表 */
    getList() {
      this.loading = true;
      listSiteInfo(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.siteList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 状态编辑
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.siteName + '"吗？').then(function() {
        return changeSiteStatus(row.id,row.siteId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    //验证账号名称是否存在
     SiteAccountRules() {
      let params = {
        siteAccount: this.form.siteAccount,
        id:this.form.id
      };
      userRules(params).then((response) => {
          if(response.code == 200 ){
          }else{
            this.$message.error("账号已存在")
            this.form.siteAccount = ""
          }
      }).catch(function() {

      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        userId: undefined,
        siteId: undefined,
        siteAccount: undefined,
        sitePwd: undefined,
        siteTransactionPwd: undefined,
        siteName: undefined,
        creditRating: undefined,
        chargeRate: undefined,
        withdrawRate: undefined,
        chChargeRate: undefined,
        chWithdrawRate: undefined,
        surname: undefined,
        name: undefined,
        documentType: undefined,
        idNo: undefined,
        gender: undefined,
        phone: undefined,
        email: undefined,
        address: undefined,
        balance: undefined,
        freeBalance: undefined,
        status: undefined,
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
      this.dateRange = [];
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
      this.title = "添加商户";
      this.type = "add"
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSiteInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "编辑商户";
        this.type = "update"
      });
    },
    /** 查看按钮操作 */
    handleShow(row) {
      this.reset();
      const id = row.id || this.ids
      getSiteInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "查看商户";
        this.type = "show"
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSiteInfo(this.form).then(response => {
              this.msgSuccess("编辑成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSiteInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除商户编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSiteInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 调整余额按钮 */
    balanceForm() {
      let params = {
        balance: this.form.balance,
        balance_type: this.form.balance_type,
        id:this.form.id
      };
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
             updateSiteInfoBalance(params).then(response => {
              this.msgSuccess("调整成功");
              this.open = false;
              this.getList();

            });
          }
        }
      });
    },
    /** 重置密码按钮操作 */
    handleUpdPwd(row,type) {
      this.$confirm('确认将密码重置为默认密码123456？', " 重置密码", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updPwdSiteInfo(row.id,type);
      }).then(() => {
        this.getList();
        this.msgSuccess("重置成功");
      })
    },
    /** 调整余额按钮操作 */
    handleBalance(row) {
      this.reset();
      const id = row.id || this.ids
      getSiteInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "调整余额";
        this.type = "balance"
        this.form.balance=undefined;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有商户数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSiteInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
