<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="地区" prop="area">
        <el-select v-model="queryParams.area" placeholder="请选择地区">
          <el-option
            v-for="item in areaList"
            :key="item.id"
            :label="item.areaName"
            :value="item.id">
          </el-option>
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
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['vpn:connection:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="connectionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" align="center" prop="id" v-if="false"/>
      <el-table-column label="线路id" align="center" prop="lineId"/>
      <el-table-column label="线路链接账户" align="center" prop="account"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.vpn_conn_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="地区" align="center" prop="area"/>
      <el-table-column label="链接时间" align="center" prop="updateTime" width="150">
        <template slot-scope="scope">
          <span style="color: #1ab394;">{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['vpn:connection:remove']"
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

    <!-- 添加或修改链接管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="线路id" prop="lineId">
          <el-input v-model="form.lineId" placeholder="请输入线路id"/>
        </el-form-item>
        <el-form-item label="线路链接账户" prop="account">
          <el-input v-model="form.account" placeholder="请输入线路链接账户"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账户IP地址" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入账户IP地址"/>
        </el-form-item>
        <el-form-item label="地区" prop="area">
          <el-input v-model="form.area" placeholder="请输入地区"/>
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
  addConnection,
  delConnection,
  exportConnection,
  getConnection,
  listConnection,
  updateConnection
} from "@/api/vpn/connection";

import {listArea} from "@/api/vpn/area";


export default {
  name: "Connection",
  dicts: ['vpn_conn_status'],
  components: {},
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
      // 链接管理表格数据
      connectionList: [],
      areaList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        lineId: undefined,
        account: undefined,
        status: undefined,
        area: undefined,
      },
      queryParams2: {
        pageNum: 1,
        pageSize: 100,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        lineId: [
          {required: true, message: "线路id不能为空", trigger: "blur"}
        ],
        account: [
          {required: true, message: "线路链接账户不能为空", trigger: "blur"}
        ],
        ip: [
          {required: true, message: "账户IP地址不能为空", trigger: "blur"}
        ],
        createTime: [
          {required: true, message: "创建时间不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
    //复选框加载
    listArea(this.queryParams2).then(response => {
      this.areaList = response.rows;
      this.total = response.total;
    });
  },
  methods: {
    /** 查询链接管理列表 */
    getList() {
      this.loading = true;
      listConnection(this.queryParams).then(response => {
        this.connectionList = response.rows;
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
        lineId: undefined,
        account: undefined,
        status: "0",
        ip: undefined,
        area: undefined,
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
      this.title = "添加链接管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getConnection(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改链接管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateConnection(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addConnection(this.form).then(response => {
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
      this.$confirm('是否确认删除链接管理编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delConnection(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有链接管理数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportConnection(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>
