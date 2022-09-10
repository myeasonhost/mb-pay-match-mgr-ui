<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">


      <el-form-item label="平台订单号" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入平台订单号"
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
      <el-form-item label="账变类型" prop="orderType">
        <el-select v-model="queryParams.orderType" placeholder="请选择账变类型" clearable size="small">
          <el-option
            v-for="dict in sysOrderTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="daterangeCreateTime"
          size="small"
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

    <el-table v-loading="loading" :data="detailList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center" prop="id" v-if="false"/>
      <el-table-column label="平台订单号" align="center" prop="orderId" />
      <el-table-column label="商家名称" align="center" prop="siteName" />
      <el-table-column label="商家ID" align="center" prop="siteId">
        <template slot-scope="scope">
            <div style="color: rgb(13,206,98); font-weight: bold; font-size: 13px;">{{ scope.row.siteId }}</div>
        </template>
      </el-table-column>
      <el-table-column label="账变类型" align="center" prop="orderType" :formatter="OrderTypeFormat" />
      <el-table-column label="账变前金额" align="center" prop="beforeMoney" />
      <el-table-column label="账变金额" align="center" prop="remit" />
      <el-table-column label="手续费" align="center" prop="serviceCharge" />
      <el-table-column label="账变后金额" align="center" prop="afterMoney" />
      <el-table-column label="账变时间" align="center" prop="createTime" sortable="custom"
                       :sort-orders="['descending', 'ascending']" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改商户账变记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商家ID" prop="siteId">
          <el-input v-model="form.siteId" placeholder="请输入商家ID" />
        </el-form-item>
        <el-form-item label="商家名称" prop="siteName">
          <el-input v-model="form.siteName" placeholder="请输入商家名称" />
        </el-form-item>
        <el-form-item label="平台订单号" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入平台订单号" />
        </el-form-item>
        <el-form-item label="账变类型" prop="orderType">
          <el-select v-model="form.orderType" placeholder="请选择账变类型">
            <el-option
              v-for="dict in sysOrderTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账变前金额" prop="beforeMoney">
          <el-input v-model="form.beforeMoney" placeholder="请输入账变前金额" />
        </el-form-item>
        <el-form-item label="账变金额" prop="remit">
          <el-input v-model="form.remit" placeholder="请输入账变金额" />
        </el-form-item>
        <el-form-item label="账变后金额" prop="afterMoney">
          <el-input v-model="form.afterMoney" placeholder="请输入账变后金额" />
        </el-form-item>
        <el-form-item label="手续费" prop="serviceCharge">
          <el-input v-model="form.serviceCharge" placeholder="请输入手续费" />
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
import { listDetail, getDetail, delDetail, addDetail, updateDetail, exportDetail } from "@/api/pay/acct/log";

export default {
  dicts: ['mapay_order_type'],
  name: "Detail",
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
      // 商户账变记录表格数据
      detailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 账变类型字典
      sysOrderTypeOptions: [],
      // 创建时间时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteId: undefined,
        siteName: undefined,
        orderId: undefined,
        orderType: undefined,
        beforeMoney: undefined,
        remit: undefined,
        afterMoney: undefined,
        serviceCharge: undefined,
        createTime: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        siteId: [
          { required: true, message: "商家ID不能为空", trigger: "blur" }
        ],
        siteName: [
          { required: true, message: "商家名称不能为空", trigger: "blur" }
        ],
        orderId: [
          { required: true, message: "平台订单号不能为空", trigger: "blur" }
        ],
        beforeMoney: [
          { required: true, message: "账变前金额不能为空", trigger: "blur" }
        ],
        remit: [
          { required: true, message: "账变金额不能为空", trigger: "blur" }
        ],
        afterMoney: [
          { required: true, message: "账变后金额不能为空", trigger: "blur" }
        ],
        serviceCharge: [
          { required: true, message: "手续费不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("mapay_order_type").then(response => {
      this.sysOrderTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询商户账变记录列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      listDetail(this.queryParams).then(response => {
        this.detailList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 账变类型字典翻译
    OrderTypeFormat(row, column) {
      return this.selectDictLabel(this.dict.type.mapay_order_type, row.orderType);
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
        siteName: undefined,
        orderId: undefined,
        orderType: undefined,
        beforeMoney: undefined,
        remit: undefined,
        afterMoney: undefined,
        serviceCharge: undefined,
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
      this.daterangeCreateTime = [];
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
      this.title = "添加商户账变记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDetail(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商户账变记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDetail(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDetail(this.form).then(response => {
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
      this.$confirm('是否确认删除商户账变记录编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDetail(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有商户账变记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDetail(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
