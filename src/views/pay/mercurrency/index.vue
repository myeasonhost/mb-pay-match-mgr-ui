<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="协议" prop="protocol">
        <el-select
          v-model="queryParams.protocol"
          placeholder="全部"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.mbpay_currency_protocol"
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
          v-hasPermi="['pay:currency:add']"
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
                v-hasPermi="['pay:currency:edit']"
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
                v-hasPermi="['pay:currency:remove']"
              >删除</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['pay:currency:export']"
              >导出</el-button>
            </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="currencyList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center" prop="id"/>
      <el-table-column label="地址名称" align="center" prop="addrName"/>
      <el-table-column label="协议" align="center" prop="protocol"/>
      <el-table-column label="地址" align="center" prop="address"/>
      <el-table-column label="创建时间" align="center" prop="createTime" sortable="custom"
                       :sort-orders="['descending', 'ascending']" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mbpay_currency_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pay:currency:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pay:currency:remove']"
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

    <!-- 添加或修改虚拟币收款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="地址名称" prop="addrName">
          <el-input v-model="form.addrName" placeholder="请输入地址名称"/>
        </el-form-item>
        <el-form-item label="协议" prop="protocol">
          <el-select
            v-model="form.protocol"
            placeholder="请选择"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="dict in dict.type.mbpay_currency_protocol"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="form.status"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="dict in dict.type.mbpay_currency_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
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
  import {
    listCurrency,
    getCurrency,
    delCurrency,
    addCurrency,
    updateCurrency,
    exportCurrency,
    checkAddress
  } from "@/api/pay/currency";

  export default {
    name: "Currency",
    dicts: ['mbpay_currency_list', 'mbpay_currency_protocol', 'mbpay_currency_status'],
    components: {},
    data() {
      const checkAddress = (rule, value, callback) => {
        if (value) {
          if (this.form.protocol === undefined) {
            callback(new Error("请选择协议在输入地址"))
          } else {
            if (this.form.protocol.toUpperCase() === 'TRC20') {
              var reg = /^T[A-Za-z0-9]+$/
              if(reg.test(value) === false){
                callback(new Error("请输入T开头，20-50位的地址"))
              }
            }else if(this.form.protocol.toUpperCase() === 'ERC20'){
              var reg = /^0x[A-Za-z0-9]+$/
              if(reg.test(value) === false){
                callback(new Error("请输入0x开头，20-50位的地址"))
              }
            }
            this.checkAddresss(value).then(response => {
              if(response.code === 200){
                callback()
              }else{
                callback(new Error("虚拟币地址已存在，请重新输入"))
              }
            }).catch(err => {
              callback(new Error("虚拟币地址已存在，请重新输入"))
            })
            return;
          }
          callback()
        } else {
          callback()
        }
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
        // 虚拟币收款表格数据
        currencyList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          siteId: this.$store.state.user.name,
          currency: undefined,
          exchange: undefined,
          addrName: undefined,
          protocol: undefined,
          address: undefined,
          operCode: undefined,
          status: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          addrName: [
            {required: true, message: "请输入地址名称", trigger: "blur"},
            {min: 2, max: 50, message: "长度2-50个字符", trigger: "blur"}
          ],
          protocol: [
            {required: true, message: "请选择协议", trigger: "blur"}
          ],
          address: [
            {required: true, message: "请输入地址", trigger: "blur"},
            {min: 20, max: 50, message: "长度20-50个字符", trigger: "blur"},
            {required: true, trigger: "blur", validator: checkAddress}//自定义规则
          ]
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询虚拟币收款列表 */
      getList() {
        this.loading = true;
        listCurrency(this.queryParams).then(response => {
          this.currencyList = response.rows;
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
          siteId: this.$store.state.user.name,
          currency: "USDT",
          exchange: undefined,
          addrName: undefined,
          protocol: undefined,
          address: undefined,
          operCode: this.$store.state.user.name,
          status: "1",
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
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加虚拟币收款";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getCurrency(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改虚拟币收款";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateCurrency(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addCurrency(this.form).then(response => {
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
        this.$confirm('是否确认删除虚拟币收款编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delCurrency(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有虚拟币收款数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportCurrency(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      },
      //验证银行卡号是否存在
      checkAddresss(bankNum) {
        return checkAddress(bankNum)
      }
    }
  };
</script>
