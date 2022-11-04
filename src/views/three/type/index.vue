<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="渠道号" prop="channelId">
        <el-input
          v-model="queryParams.channelId"
          placeholder="请输入渠道号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="中文名" prop="channelNameCn">
        <el-input
          v-model="queryParams.channelNameCn"
          placeholder="请输入渠道中文名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="英文名" prop="channelNameEn">
        <el-input
          v-model="queryParams.channelNameEn"
          placeholder="请输入渠道英文名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="代收" value="代收"/>
          <el-option label="代付" value="代付"/>
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
          v-hasPermi="['three:info:add']"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table ref="table" v-loading="loading" :data="infoList"
              @expand-change="expandChange" border>
      <!-- 展开部分 -->
      <el-table-column type="expand" width="50%">
        <template slot-scope="scope">
          <el-table v-loading="scope.row.loadingChild" :row-key="scope.row.child.id" :data="scope.row.child"
                    border size="mini" style="width:90%;margin:auto;"
                    :header-cell-style="{
                      background: '#99a9bf!important',
                      fontWeight: '600',
                      fontSize: '10px',
                    }"
                    :row-style="{
                      fontSize: '5px',
                    }">
            <el-table-column label="ID" align="center" prop="id" v-if="false"/>
            <el-table-column label="站点ID" align="center" prop="siteId"/>
            <el-table-column label="脚本ID" align="center" prop="scriptId"/>
            <el-table-column label="支付名" align="center" prop="payName"/>
            <el-table-column label="支付方式" align="center" prop="payType"/>
            <el-table-column label="三方费率" align="center" prop="threeRate"/>
            <el-table-column label="优先级" align="center" prop="priority"/>
            <el-table-column label="状态" align="center" prop="status"/>
            <el-table-column label="客户端类型" align="center" prop="clientType"/>
            <el-table-column label="当前额度" align="center" prop="currentLimit"/>
            <el-table-column label="最大限额" align="center" prop="maxLimit"/>
            <el-table-column label="单笔最小限额" align="center" prop="singleMinLimit"/>
            <el-table-column label="单笔最大限额" align="center" prop="singleMaxLimit"/>
            <el-table-column label="备注" align="center" prop="remark"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdateChild(scope.row)"
                  v-hasPermi="['three:type:edit']"
                >修改
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDeleteChild(scope.row)"
                  v-hasPermi="['three:type:remove']"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" prop="id" v-if="false"/>
      <el-table-column label="站点ID" align="center" prop="siteId"/>
      <el-table-column label="渠道号" align="center" prop="channelId"/>
      <el-table-column label="渠道中文名" align="center" prop="channelNameCn"/>
      <el-table-column label="渠道英文名" align="center" prop="channelNameEn"/>
      <el-table-column label="渠道类型" align="center" prop="channelType"/>
      <el-table-column label="状态" align="center" prop="status"/>
      <el-table-column label="最大限额" align="center" prop="maxLimit"/>
      <el-table-column label="IP白名单" align="center" prop="whiteIp"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-thumb"
            @click="toogleExpand(scope.row)"
            v-hasPermi="['three:info:query']"
          >通道详情
          </el-button>
          <el-button
            size="small"
            type="text"
            icon="el-icon-thumb"
            @click="handleAddChild(scope.row)"
            v-hasPermi="['three:info:query']"
          >新增通道
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['three:info:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['three:info:remove']"
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

    <!-- 添加或修改三方支付脚本对话框 -->
    <el-dialog :title="titleChild" :visible.sync="openChild" width="700px" append-to-body>
      <el-form ref="formChild" :model="formChild" :rules="rulesChild" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="脚本ID" prop="scriptId">
              <el-input v-model="formChild.scriptId" placeholder="请输入脚本ID"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级" prop="priority">
              <el-input v-model="formChild.priority" placeholder="请输入优先级"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="支付名" prop="payName">
              <el-input v-model="formChild.payName" placeholder="请输入支付名"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付方式" prop="payType">
              <el-input v-model="formChild.payType" placeholder="请输入支付方式"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="三方费率" prop="threeRate">
              <el-input v-model="formChild.threeRate" placeholder="请输入三方费率"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户端" prop="clientType">
              <el-select v-model="formChild.clientType" placeholder="请选择客户端类型">
                <el-option label="请选择字典生成" value=""/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="当前额度" prop="currentLimit">
              <el-input v-model="formChild.currentLimit" placeholder="请输入当前额度"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大限额" prop="maxLimit">
              <el-input v-model="formChild.maxLimit" placeholder="请输入最大限额"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单笔最小" prop="singleMinLimit">
              <el-input v-model="formChild.singleMinLimit" placeholder="请输入单笔最小限额"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单笔最大" prop="singleMaxLimit">
              <el-input v-model="formChild.singleMaxLimit" placeholder="请输入单笔最大限额"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态">
          <el-radio-group v-model="formChild.status">
            <el-radio label="1">禁用</el-radio>
            <el-radio label="2">启用</el-radio>
            <el-radio label="0">新增</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formChild.remark" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormChild">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改三方渠道对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="渠道号" prop="channelId">
              <el-input v-model="form.channelId" placeholder="请输入渠道号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="渠道类型" prop="channelType">
              <el-select v-model="form.channelType" placeholder="请选择渠道类型">
                <el-option label="代收" value="代收"/>
                <el-option label="代付" value="代付"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="中文名" prop="channelNameCn">
              <el-input v-model="form.channelNameCn" placeholder="请输入渠道中文名"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="英文名" prop="channelNameEn">
              <el-input v-model="form.channelNameEn" placeholder="请输入渠道英文名"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最大限额" prop="maxLimit">
              <el-input v-model="form.maxLimit" placeholder="请输入最大限额"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio label="1">禁用</el-radio>
                <el-radio label="2">启用</el-radio>
                <el-radio label="0">新增</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="接口地址" prop="threeUrl">
          <el-input v-model="form.threeUrl" placeholder="请输入三方接口地址"/>
        </el-form-item>
        <el-form-item label="回调地址" prop="notifyUrl">
          <el-input v-model="form.notifyUrl" placeholder="请输入回调地址"/>
        </el-form-item>

        <el-form-item label="IP白名单" prop="whiteIp">
          <el-input v-model="form.whiteIp" placeholder="请输入IP白名单"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
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
import {addInfo, delInfo, getInfo, listInfo, updateInfo} from "@/api/three/info";
import {addType, delType, getType, listType, updateType} from "@/api/three/type";

export default {
  name: "Info",
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
      // 三方渠道表格数据
      infoList: [],
      dataRow: [], // 当前行的数据列表(由于子表格是内嵌的，所以也有子表格的所有数据)
      // 弹出层标题
      title: "",
      titleChild: "",
      // 是否显示弹出层
      open: false,
      openChild: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        channelId: undefined,
        channelNameCn: undefined,
        channelNameEn: undefined,
        status: undefined,
      },
      // 查询参数2
      queryParamsParent: {
        pageNum: 1,
        pageSize: 10,
        parentId: undefined,
      },
      // 表单参数
      form: {},
      formChild: {},
      // 表单校验
      rules: {
        channelId: [
          {required: true, message: "渠道号不能为空", trigger: "blur"}
        ],
        channelNameCn: [
          {required: true, message: "渠道中文名不能为空", trigger: "blur"}
        ],
        channelNameEn: [
          {required: true, message: "渠道英文名不能为空", trigger: "blur"}
        ],
        channelType: [
          {required: true, message: "渠道类型不能为空", trigger: "change"}
        ],
        status: [
          {required: true, message: "状态不能为空", trigger: "blur"}
        ],
        createTime: [
          {required: true, message: "状态不能为空", trigger: "blur"}
        ],
      },
      rulesChild: {
        apiName: [
          {required: true, message: "接口名称不能为空", trigger: "blur"}
        ],
        apiUrl: [
          {required: true, message: "请求地址不能为空", trigger: "blur"}
        ],
        apiMethod: [
          {required: true, message: "请求方式不能为空", trigger: "blur"}
        ],
        script: [
          {required: true, message: "三方脚本不能为空", trigger: "blur"}
        ],
        status: [
          {required: true, message: "状态不能为空", trigger: "blur"}
        ],
        payWayName: [
          {required: true, message: "支付通道名称不能为空", trigger: "blur"}
        ],
        payWayCode: [
          {required: true, message: "支付通道编码不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询三方渠道列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        response.rows.map(row => {
          row.child = [];
          row.loadingChild = true;
        });
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 展开行效果
    expandChange(row, expandedRows) {
      this.dataRow = row;
      if (expandedRows.length) {
        this.dataRow.loadingChild = true;
        this.queryParamsParent.parentId = row.id;
        listType(this.queryParamsParent).then(response => {
          this.dataRow.child = response.rows;
          this.dataRow.child.push({});
          this.dataRow.child.pop();
          this.dataRow.loadingChild = false;
        });
      }
    },
    toogleExpand(row) {
      this.$refs.table.toggleRowExpansion(row, row.expanded) // 点击button展开
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openChild = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        channelId: undefined,
        channelNameCn: undefined,
        channelNameEn: undefined,
        channelType: undefined,
        status: "0",
        threeUrl: undefined,
        notifyUrl: undefined,
        maxLimit: undefined,
        whiteIp: undefined,
        remark: undefined,
        createTime: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
      this.formChild = {
        id: undefined,
        parentId: undefined,
        apiName: undefined,
        apiUrl: undefined,
        apiMethod: undefined,
        script: undefined,
        status: "0",
        payWayName: undefined,
        payWayCode: undefined,
        remark: undefined,
        createTime: undefined,
        updateTime: undefined
      };
      this.resetForm("formChild");
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加三方渠道";
    },
    handleAddChild(row) {
      this.reset();
      this.openChild = true;
      this.titleChild = "添加支付通道";
      this.formChild.parentId = row.id; //父类id
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改三方渠道";
      });
    },
    /** 子类修改按钮操作 */
    handleUpdateChild(row) {
      this.reset();
      const id = row.id;
      getType(id).then(response => {
        this.formChild = response.data;
        this.openChild = true;
        this.titleChild = "修改脚本信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInfo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 子类提交按钮 */
    submitFormChild() {
      this.$refs["formChild"].validate(valid => {
        if (valid) {
          if (this.formChild.id != null) {
            updateType(this.formChild).then(response => {
              this.msgSuccess("通道修改成功");
              this.openChild = false;
              this.getList();
            });
          } else {
            addType(this.formChild).then(response => {
              this.msgSuccess("通道新增成功");
              this.openChild = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除三方渠道编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delInfo(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    handleDeleteChild(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除三方脚本编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delType(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    }
  }
};
</script>
