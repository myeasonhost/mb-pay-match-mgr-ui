<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商家ID" prop="memberId">
        <el-input
          v-model="queryParams.memberId"
          placeholder="请输入商家ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商家账号" prop="memberAccount">
        <el-input
          v-model="queryParams.memberAccount"
          placeholder="请输入商家账号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商家密码" prop="memberPwd">
        <el-input
          v-model="queryParams.memberPwd"
          placeholder="请输入商家密码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商家交易密码" prop="memberTransactionPwd">
        <el-input
          v-model="queryParams.memberTransactionPwd"
          placeholder="请输入商家交易密码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商家名称" prop="memberName">
        <el-input
          v-model="queryParams.memberName"
          placeholder="请输入商家名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="信用等级" prop="creditRating">
        <el-input
          v-model="queryParams.creditRating"
          placeholder="请输入信用等级"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="充值费率" prop="chargeRate">
        <el-input
          v-model="queryParams.chargeRate"
          placeholder="请输入充值费率"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提现费率" prop="withdrawRate">
        <el-input
          v-model="queryParams.withdrawRate"
          placeholder="请输入提现费率"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="撮合充值费率" prop="chChargeRate">
        <el-input
          v-model="queryParams.chChargeRate"
          placeholder="请输入撮合充值费率"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="撮合提现费率" prop="chWithdrawRate">
        <el-input
          v-model="queryParams.chWithdrawRate"
          placeholder="请输入撮合提现费率"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓" prop="surname">
        <el-input
          v-model="queryParams.surname"
          placeholder="请输入姓"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="证件类型" prop="documentType">
        <el-select v-model="queryParams.documentType" placeholder="请选择证件类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="证件号" prop="idNo">
        <el-input
          v-model="queryParams.idNo"
          placeholder="请输入证件号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-input
          v-model="queryParams.gender"
          placeholder="请输入性别"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入邮箱"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系地址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入联系地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前余额" prop="balance">
        <el-input
          v-model="queryParams.balance"
          placeholder="请输入当前余额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="冻结金额" prop="freeBalance">
        <el-input
          v-model="queryParams.freeBalance"
          placeholder="请输入冻结金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-input
          v-model="queryParams.state"
          placeholder="请输入状态"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['pay:member:add']"
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
          v-hasPermi="['pay:member:edit']"
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
          v-hasPermi="['pay:member:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['pay:member:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="memberList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" v-if="false"/>
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="商家ID" align="center" prop="memberId" />
      <el-table-column label="商家账号" align="center" prop="memberAccount" />
      <el-table-column label="商家密码" align="center" prop="memberPwd" />
      <el-table-column label="商家交易密码" align="center" prop="memberTransactionPwd" />
      <el-table-column label="商家名称" align="center" prop="memberName" />
      <el-table-column label="信用等级" align="center" prop="creditRating" />
      <el-table-column label="充值费率" align="center" prop="chargeRate" />
      <el-table-column label="提现费率" align="center" prop="withdrawRate" />
      <el-table-column label="撮合充值费率" align="center" prop="chChargeRate" />
      <el-table-column label="撮合提现费率" align="center" prop="chWithdrawRate" />
      <el-table-column label="姓" align="center" prop="surname" />
      <el-table-column label="名" align="center" prop="name" />
      <el-table-column label="证件类型" align="center" prop="documentType" />
      <el-table-column label="证件号" align="center" prop="idNo" />
      <el-table-column label="性别" align="center" prop="gender" />
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="联系地址" align="center" prop="address" />
      <el-table-column label="当前余额" align="center" prop="balance" />
      <el-table-column label="冻结金额" align="center" prop="freeBalance" />
      <el-table-column label="状态" align="center" prop="state" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pay:member:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pay:member:remove']"
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

    <!-- 添加或修改商户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="商家ID" prop="memberId">
          <el-input v-model="form.memberId" placeholder="请输入商家ID" />
        </el-form-item>
        <el-form-item label="商家账号" prop="memberAccount">
          <el-input v-model="form.memberAccount" placeholder="请输入商家账号" />
        </el-form-item>
        <el-form-item label="商家密码" prop="memberPwd">
          <el-input v-model="form.memberPwd" placeholder="请输入商家密码" />
        </el-form-item>
        <el-form-item label="商家交易密码" prop="memberTransactionPwd">
          <el-input v-model="form.memberTransactionPwd" placeholder="请输入商家交易密码" />
        </el-form-item>
        <el-form-item label="商家名称" prop="memberName">
          <el-input v-model="form.memberName" placeholder="请输入商家名称" />
        </el-form-item>
        <el-form-item label="信用等级" prop="creditRating">
          <el-input v-model="form.creditRating" placeholder="请输入信用等级" />
        </el-form-item>
        <el-form-item label="充值费率" prop="chargeRate">
          <el-input v-model="form.chargeRate" placeholder="请输入充值费率" />
        </el-form-item>
        <el-form-item label="提现费率" prop="withdrawRate">
          <el-input v-model="form.withdrawRate" placeholder="请输入提现费率" />
        </el-form-item>
        <el-form-item label="撮合充值费率" prop="chChargeRate">
          <el-input v-model="form.chChargeRate" placeholder="请输入撮合充值费率" />
        </el-form-item>
        <el-form-item label="撮合提现费率" prop="chWithdrawRate">
          <el-input v-model="form.chWithdrawRate" placeholder="请输入撮合提现费率" />
        </el-form-item>
        <el-form-item label="姓" prop="surname">
          <el-input v-model="form.surname" placeholder="请输入姓" />
        </el-form-item>
        <el-form-item label="名" prop="name">
          <el-input v-model="form.name" placeholder="请输入名" />
        </el-form-item>
        <el-form-item label="证件类型" prop="documentType">
          <el-select v-model="form.documentType" placeholder="请选择证件类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号" prop="idNo">
          <el-input v-model="form.idNo" placeholder="请输入证件号" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-input v-model="form.gender" placeholder="请输入性别" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入联系地址" />
        </el-form-item>
        <el-form-item label="当前余额" prop="balance">
          <el-input v-model="form.balance" placeholder="请输入当前余额" />
        </el-form-item>
        <el-form-item label="冻结金额" prop="freeBalance">
          <el-input v-model="form.freeBalance" placeholder="请输入冻结金额" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-input v-model="form.state" placeholder="请输入状态" />
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
import { listMember, getMember, delMember, addMember, updateMember, exportMember } from "@/api/pay/member";

export default {
  name: "Member",
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
      // 商户表格数据
      memberList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: undefined,
        memberId: undefined,
        memberAccount: undefined,
        memberPwd: undefined,
        memberTransactionPwd: undefined,
        memberName: undefined,
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
        state: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        memberId: [
          { required: true, message: "商家ID不能为空", trigger: "blur" }
        ],
        memberTransactionPwd: [
          { required: true, message: "商家交易密码不能为空", trigger: "blur" }
        ],
        memberName: [
          { required: true, message: "商家名称不能为空", trigger: "blur" }
        ],
        creditRating: [
          { required: true, message: "信用等级不能为空", trigger: "blur" }
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
        surname: [
          { required: true, message: "姓不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "名不能为空", trigger: "blur" }
        ],
        balance: [
          { required: true, message: "当前余额不能为空", trigger: "blur" }
        ],
        freeBalance: [
          { required: true, message: "冻结金额不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
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
      listMember(this.queryParams).then(response => {
        this.memberList = response.rows;
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
        memberId: undefined,
        memberAccount: undefined,
        memberPwd: undefined,
        memberTransactionPwd: undefined,
        memberName: undefined,
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
        state: undefined,
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
      this.title = "添加商户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMember(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMember(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMember(this.form).then(response => {
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
          return delMember(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有商户数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportMember(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
