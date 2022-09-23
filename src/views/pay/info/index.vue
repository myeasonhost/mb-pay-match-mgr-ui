<template xmlns="http://www.w3.org/1999/html">
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
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="协议" prop="protocol">
        <el-select v-model="queryParams.protocol" placeholder="全部" clearable size="small">
          <el-option
            v-for="dict in protocolOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
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
          size="mini"
          @click="handleFiatCharge"
          v-hasPermi="['pay:info:add']"
        >法币充值
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          size="mini"
          @click="handleUsdtCharge"
          v-hasPermi="['pay:info:add']"
        >USDT充值
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center" prop="id"/>
      <el-table-column label="商户信息" align="center" prop="siteId" width="200">
        <template slot-scope="scope">
          <div style="color: #13ce66;font-weight: bold;font-size: 13px;">商家ID:{{ scope.row.siteId }}</div>
          <div style="color: #f4516c;font-weight: bold;font-size: 13px;">商家名称:{{ scope.row.siteName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center" prop="orderId" width="200"/>
      <el-table-column label="币种" align="center" prop="currency"/>
      <el-table-column label="充值明细" align="center" prop="chargeAmount" width="130">
        <template slot-scope="scope">
          <div style="color: #1890ff;font-family: 'Arial Black';font-size: small;">
            充值金额：{{ scope.row.chargeAmount == null ? "0.00" : scope.row.chargeAmount }}
          </div>
          <div style="color: #f8ac59;font-style: italic;font-size: small;">
            汇率：{{ scope.row.currencyRate == null ? "0.00" : scope.row.currencyRate }}
            / {{ scope.row.currency == null ? "0.00" : scope.row.currency }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="银行卡明细" align="left" prop="bankName" width="200">
        <template slot-scope="scope">
          <div style="color: #666666;font-family: 'Arial Black';font-size: small;">
            姓名：{{ scope.row.userName }}
          </div>
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
            银行编码：{{ scope.row.bankCode }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="USDT数量" align="center" prop="usdtCount" width="200"/>
      <el-table-column label="虚拟币明细" align="left" prop="addrName" width="200">
        <template slot-scope="scope">
          <div style="color: #666666;font-family: 'Arial Black';font-size: small;">
            地址名称：{{ scope.row.addrName }}
          </div>
          <div style="color: #666666;font-family: 'Arial Black';font-size: small;">
            协议：{{ scope.row.protocol }}
          </div>
          <div style="color: #666666;font-family: 'Arial Black';font-size: small;">
            地址：{{ scope.row.address }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="转账截图地址" align="center" prop="payimageUrl" width="200">
        <template slot-scope="scope">
          <el-popover placement="top-start" trigger="click">
            <a :href="scope.row.payimageUrl" target="_blank" title="查看最大化图片">
              <img :src="scope.row.payimageUrl" style="width: 300px;height: 500px"/>
            </a>
            <img slot="reference" :src="scope.row.payimageUrl" style="width: 80px;height: 80px;cursor: pointer">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mbpay_charge_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="创建时间" align="center" prop="createTime" sortable="custom"
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
            v-hasPermi="['pay:info:edit']"
          >审批
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

    <!-- 法币充值对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="充值金额" prop="chargeAmount" v-if="['fiatCharge'].includes(type)">
          <el-input v-model="form.chargeAmount" placeholder="请输入充值金额"/>
        </el-form-item>
        <el-form-item label="银行卡信息:" prop="bankName" v-if="['nextFiatCharge'].includes(type)">
          <div><br/></div>
          <div>
            银行卡名称: {{ form.bankName }}
            &nbsp;
            <i class="el-icon-document-copy" v-clipboard:copy="form.bankName" v-clipboard:success="onCopy"
               v-clipboard:error="onError"></i>
          </div>
          <div>
            姓名: {{ form.userName }}
            &nbsp;
            <i class="el-icon-document-copy" v-clipboard:copy="form.userName" v-clipboard:success="onCopy"
               v-clipboard:error="onError"></i>
          </div>
          <div>
            银行账户: {{ form.bankNum }}
            &nbsp;
            <i class="el-icon-document-copy" v-clipboard:copy="form.bankNum" v-clipboard:success="onCopy"
               v-clipboard:error="onError"></i>
          </div>
          <div>
            支行名称: {{ form.branchName }}
            &nbsp;
            <i class="el-icon-document-copy" v-clipboard:copy="form.branchName" v-clipboard:success="onCopy"
               v-clipboard:error="onError"></i>
          </div>
          <div>
            银行编码: {{ form.bankCode }}
            &nbsp;
            <i class="el-icon-document-copy" v-clipboard:copy="form.bankCode" v-clipboard:success="onCopy"
               v-clipboard:error="onError"></i>
          </div>
        </el-form-item>
        <el-form-item label="转账截图" prop="payimageUrl" v-if="['nextFiatCharge'].includes(type)" width="300px">
          <el-upload
            multiple
            :action="uploadImgUrl"
            list-type="picture-card"
            :on-success="handleUploadSuccess"
            :before-upload="handleBeforeUpload"
            :limit="limit"
            :on-error="handleUploadError"
            :on-exceed="handleExceed"
            ref="imageUpload"
            :on-remove="handleDelete"
            :show-file-list="true"
            :headers="headers"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :class="{hide: this.fileList.length >= this.limit}"
          >
            <i class="el-icon-plus"></i>
          </el-upload>

          <!-- 上传提示 -->
          <div class="el-upload__tip" slot="tip" v-if="showTip">
            请上传
            <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b></template>
            <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b></template>
            的文件
          </div>
          <el-dialog
            :visible.sync="dialogVisible"
            title="预览"
            width="800"
            append-to-body
          >
            <img
              :src="dialogImageUrl"
              style="display: block; max-width: 100%; margin: 0 auto"
            />
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleNextFiatCharge" v-if="['fiatCharge'].includes(type)">下一步</el-button>
        <el-button @click="cancel(1)" v-if="['nextFiatCharge'].includes(type)">取 消</el-button>
        <el-button type="primary" @click="submitForm(0,1)" v-if="['nextFiatCharge'].includes(type)">提交申请</el-button>
      </div>
    </el-dialog>

    <!-- USDT充值对话框 -->
    <el-dialog :title="title" :visible.sync="usdtOpen" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="usdtRules" label-width="120px">
        <el-form-item label="USDT地址信息:" prop="bankName" v-if="['nextUsdtCharge'].includes(type)">
          <div><br/></div>
          <div>
            地址名称: {{ form.addrName }}
          </div>
          <div>
            协议: {{ form.protocol }}
          </div>
          <div>
            地址: {{ form.address }}
            &nbsp;
            <i class="el-icon-document-copy" v-clipboard:copy="form.address" v-clipboard:success="onCopy"
               v-clipboard:error="onError"></i>
          </div>

          <div class="qrcode" id="qrcode" ref="qrcode" style="margin-left:10%"/>
        </el-form-item>
        <el-form-item label="转账截图" prop="payimageUrl" v-if="['nextUsdtCharge'].includes(type)" width="300px">
          <el-upload
            multiple
            :action="uploadImgUrl"
            list-type="picture-card"
            :on-success="handleUploadSuccess"
            :before-upload="handleBeforeUpload"
            :limit="limit"
            :on-error="handleUploadError"
            :on-exceed="handleExceed"
            ref="imageUpload"
            :on-remove="handleDelete"
            :show-file-list="true"
            :headers="headers"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :class="{hide: this.fileList.length >= this.limit}"
          >
            <i class="el-icon-plus"></i>
          </el-upload>

          <!-- 上传提示 -->
          <div class="el-upload__tip" slot="tip" v-if="showTip">
            请上传
            <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b></template>
            <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b></template>
            的文件
          </div>
          <el-dialog
            :visible.sync="dialogVisible"
            title="预览"
            width="800"
            append-to-body
          >
            <img
              :src="dialogImageUrl"
              style="display: block; max-width: 100%; margin: 0 auto"
            />
          </el-dialog>
        </el-form-item>
        <el-form-item label="协议" prop="protocol" v-if="['usdtCharge'].includes(type)">
          <el-radio-group v-model="form.protocol">
            <el-radio v-for="dict in protocolOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="USDT数量" prop="usdtCount" v-if="['usdtCharge'].includes(type)">
          <el-input v-model="form.usdtCount" placeholder="请输入USDT数量" @change="calculateAmount"/>
        </el-form-item>
        <el-form-item label="到账金额" prop="chargeAmount" v-if="['usdtCharge'].includes(type)">
          <el-input v-model="form.chargeAmount" disabled/>
          <div style="color: #f4516c;font-family: 'Arial Black';font-size: 10px;">
            1USDT={{form.currencyRate}}CNY
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleNextUsdtCharge" v-if="['usdtCharge'].includes(type)">下一步</el-button>
        <el-button @click="cancel(2)" v-if="['nextUsdtCharge'].includes(type)">取 消</el-button>
        <el-button type="primary" @click="submitForm(0,2)" v-if="['nextUsdtCharge'].includes(type)">提交申请</el-button>
      </div>
    </el-dialog>

    <!-- 审批对话框 -->
    <el-dialog :title="title" :visible.sync="updOpen" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="updRules" label-width="120px">
        <el-form-item label="状态" prop="status">
          <dict-tag :options="dict.type.mbpay_charge_status" :value="form.status"/>
        </el-form-item>
        <el-form-item label="转账截图" prop="payimageUrl" width="300px">
          <el-image :src="form.payimageUrl"></el-image>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitForm(1,3)">审批通过</el-button>
        <el-button type="danger" @click="submitForm(2,3)">审批失败</el-button>
        <el-button @click="cancel(3)">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
  .hide .el-upload--picture-card {
    display: none;
  }
</style>

<script>
  import {listInfo, getInfo, getCurrencys, addInfo, updateInfo, exportInfo, getSiteBanks} from "@/api/pay/info";
  import QRCode from "qrcodejs2";
  import {getToken} from "@/utils/auth";
  import {getSiteInfoProfile} from "@/api/pay/profile";

  export default {
    name: "Info",
    dicts: ['mbpay_charge_status'],
    components: {},
    props: {
      value: [String, Object, Array],
      // 图片数量限制
      limit: {
        type: Number,
        default: 1,
      },
      // 大小限制(MB)
      fileSize: {
        type: Number,
        default: 2,
      },
      // 文件类型, 例如['png', 'jpg', 'jpeg']
      fileType: {
        type: Array,
        default: () => ["png", "jpg", "jpeg"],
      },
      // 是否显示提示
      isShowTip: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        number: 0,
        uploadList: [],
        dialogImageUrl: "",
        dialogVisible: false,
        hideUpload: false,
        baseUrl: process.env.VUE_APP_BASE_API,
        uploadImgUrl: process.env.VUE_APP_BASE_API + "/pay/info/picture", // 上传的图片服务器地址
        headers: {
          Authorization: "Bearer " + getToken(),
        },
        // 定义商户列表对象
        mbpaySiteInfo: {},
        fileList: [],
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
        // 充值管理表格数据
        infoList: [],
        // 日期范围
        dateRange: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // usdt是否显示弹出层
        usdtOpen: false,
        // 审批是否显示弹出层
        updOpen: false,
        // 币种 USDT/RMB字典
        currencyOptions: [],
        // 协议字典
        protocolOptions: [],
        // 状态字典
        statusOptions: [],
        // 弹出框显示类型
        type: "",
        //银行卡参数
        siteBank: "",
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          orderId: undefined,
          bankNum: undefined,
          protocol: undefined,
          status: undefined,
          createTime: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          payimageUrl: [
            {required: true, message: "请上传图片", trigger: "blur"}
          ],
          chargeAmount: [
            {required: true, message: "请输入充值金额", trigger: "blur"},
          ]
        },
        // usdt表单校验
        usdtRules: {
          payimageUrl: [
            {required: true, message: "请上传图片", trigger: "blur"}
          ],
          usdtCount: [
            {required: true, message: "请输入USDT数量", trigger: "blur"},
          ]
        },
        // 审批表单校验
        updRules: {
          remark: [
            {required: true, message: "请填写备注", trigger: "blur"}
          ]
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("mbpay_currency").then(response => {
        this.currencyOptions = response.data;
      });
      this.getDicts("mbpay_currency_protocol").then(response => {
        this.protocolOptions = response.data;
      });
      this.getDicts("mbpay_charge_status").then(response => {
        this.statusOptions = response.data;
      });
    },
    watch: {
      value: {
        handler(val) {
          if (val) {
            // 首先将值转为数组
            const list = Array.isArray(val) ? val : this.value.split(',');
            // 然后将数组转为对象数组
            this.fileList = list.map(item => {
              if (typeof item === "string") {
                if (item.indexOf(this.baseUrl) === -1) {
                  item = {name: this.baseUrl + item, url: this.baseUrl + item};
                } else {
                  item = {name: item, url: item};
                }
              }
              return item;
            });
          } else {
            this.fileList = [];
            return [];
          }
        },
        deep: true,
        immediate: true
      }
    },
    computed: {
      // 是否显示提示
      showTip() {
        return this.isShowTip && (this.fileType || this.fileSize);
      },
    },
    methods: {
      /** 查询充值管理列表 */
      getList() {
        this.loading = true;
        listInfo(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.infoList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 币种 USDT/RMB字典翻译
      currencyFormat(row, column) {
        return this.selectDictLabel(this.currencyOptions, row.currency);
      },
      // 取消按钮
      cancel(type) {
        if (type === 1) {//法币充值
          this.open = false;
        } else if (type === 2) {//usdt充值
          this.usdtOpen = false;
          this.cleanCode();
        } else {//审批
          this.updOpen = false;
        }
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
          currencyRate: undefined,
          chargeAmount: undefined,
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
          status: "0",
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
      /** 法币充值按钮操作 */
      handleFiatCharge() {
        this.getSiteInfo();
        if (this.mbpaySiteInfo === undefined) {
          this.$message.error("该账号未绑定商户!");
          return;
        }
        this.reset();
        this.open = true;
        this.type = "fiatCharge";
        this.title = "充值";
      },
      /** 法币充值下一步操作 */
      handleNextFiatCharge() {
        var reg = /^[1-9]{1}[0-9]{0,15}$/
        if (reg.test(this.form.chargeAmount) === false) {
          this.$message.error('请输入整数充值金额!')
          return;
        }
        this.getSiteBanks();
        this.open = true;
        this.type = "nextFiatCharge";
        this.title = "充值";
      },
      /** USDT充值按钮操作 */
      handleUsdtCharge() {
        this.getSiteInfo();
        if (this.mbpaySiteInfo === undefined) {
          this.$message.error("该账号未绑定商户!");
          return;
        }
        this.reset();
        //获取汇率
        this.getConfigKey("mbpay-currency-exchange-rate").then(response => {
          this.form.currencyRate = JSON.parse(response.msg).USDT;
        });
        this.usdtOpen = true;
        this.type = "usdtCharge";
        this.title = "充值";
      },
      /** USDT充值下一步操作 */
      handleNextUsdtCharge() {
        var reg = /^[1-9]{1}[0-9]{0,15}$/
        if (reg.test(this.form.usdtCount) === false) {
          this.$message.error('请输入整数USDT数量!')
          return;
        }
        this.getUsdtList();
        this.usdtOpen = true;
        this.type = "nextUsdtCharge";
        this.title = "充值";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getInfo(id).then(response => {
          this.form = response.data;
          this.updOpen = true;
          this.title = "审批";
        });
      },
      /** 提交按钮 */
      submitForm(status, type) {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              this.form.status = status;
              updateInfo(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.updOpen = false;
                this.getList();
              });
            } else {
              addInfo(this.form).then(response => {
                this.msgSuccess("新增成功");
                if (type === 1) {
                  this.open = false;
                } else {
                  this.usdtOpen = false;
                  this.cleanCode();
                }
                this.getList();
              });
            }
          }
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有充值管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      },
      /** 获取银行卡信息 */
      getSiteBanks() {
        let params = {
          site_id: 'admin',
          currency: 'RMB',
          amount: this.form.chargeAmount,
          type: '1'
        };
        getSiteBanks(params).then((response) => {
          if (response.rows.length > 0) {
            //获取汇率
            this.getConfigKey("mbpay-currency-exchange-rate").then(response => {
              this.form.currencyRate = JSON.parse(response.msg).CNY;
            });
            this.form = {
              currency: 'CNY',
              chargeAmount: this.form.chargeAmount,
              userName: response.rows[0].userName,
              bankName: response.rows[0].bankName,
              bankNum: response.rows[0].bankNum,
              branchName: response.rows[0].branchName,
              bankCode: response.rows[0].bankCode
            };
          } else {
            this.open = false;
            this.reset();
            this.$message.error("银行卡不存在或额度不足,请联系客服!");
          }
        })
      },
      onCopy() {
        this.$message.success("内容已复制到剪切板")
      },
      onError() {
        this.$message.error('抱歉，复制失败！')
      },
      // 上传前loading加载
      handleBeforeUpload(file) {
        let isImg = false;
        if (this.fileType.length) {
          let fileExtension = "";
          if (file.name.lastIndexOf(".") > -1) {
            fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
          }
          isImg = this.fileType.some(type => {
            if (file.type.indexOf(type) > -1) return true;
            if (fileExtension && fileExtension.indexOf(type) > -1) return true;
            return false;
          });
        } else {
          isImg = file.type.indexOf("image") > -1;
        }

        if (!isImg) {
          this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}图片格式文件!`);
          return false;
        }
        if (this.fileSize) {
          const isLt = file.size / 1024 / 1024 < this.fileSize;
          if (!isLt) {
            this.$modal.msgError(`上传头像图片大小不能超过 ${this.fileSize} MB!`);
            return false;
          }
        }
        this.$modal.loading("正在上传图片，请稍候...");
        this.number++;
      },
      // 文件个数超出
      handleExceed() {
        this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
      },
      // 上传成功回调
      handleUploadSuccess(res, file) {
        if (res.code === 200) {
          this.uploadList.push({name: res.fileName, url: res.url});
          this.form.payimageUrl = res.url;
          this.uploadedSuccessfully();
        } else {
          this.number--;
          this.$modal.closeLoading();
          this.$modal.msgError(res.msg);
          this.$refs.imageUpload.handleRemove(file);
          this.uploadedSuccessfully();
        }
      },
      // 删除图片
      handleDelete(file) {
        const findex = this.fileList.map(f => f.name).indexOf(file.name);
        if (findex > -1) {
          this.fileList.splice(findex, 1);
          this.$emit("input", this.listToString(this.fileList));
        }
      },
      // 上传失败
      handleUploadError() {
        this.$modal.msgError("上传图片失败，请重试");
        this.$modal.closeLoading();
      },
      // 上传结束处理
      uploadedSuccessfully() {
        if (this.number > 0 && this.uploadList.length === this.number) {
          this.fileList = this.fileList.concat(this.uploadList);
          this.uploadList = [];
          this.number = 0;
          this.$emit("input", this.listToString(this.fileList));
          this.$modal.closeLoading();
        }
      },
      // 预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 对象转成指定字符串分隔
      listToString(list, separator) {
        let strs = "";
        separator = separator || ",";
        for (let i in list) {
          if (list[i].url) {
            strs += list[i].url.replace(this.baseUrl, "") + separator;
          }
        }
        return strs != '' ? strs.substr(0, strs.length - 1) : '';
      },
      /** USDT充值计算到账金额 */
      calculateAmount() {
        //usdt数量 * 汇率
        let amount = this.form.usdtCount * 6.9;
        this.form.chargeAmount = amount.toFixed(2);
      },
      /** 查询虚拟币收款列表 */
      getUsdtList() {
        let params = {
          site_id: 'admin',
          currency: 'USDT',
          protocol: this.form.protocol,
          status:1
        };
        getCurrencys(params).then((response) => {
          if (response.rows.length > 0) {
            this.form = {
              currency: 'USDT',
              chargeAmount: this.form.chargeAmount,
              currencyRate: this.form.currencyRate,
              usdtCount: this.form.usdtCount,
              addrName: response.rows[0].addrName,
              protocol: response.rows[0].protocol,
              address: response.rows[0].address
            };
            this.createQrcode();
          } else {
            this.usdtOpen = false;
            this.reset();
            this.$message.error("银行卡不存在或额度不足,请联系客服!");
          }
        })
      },
      createQrcode() {//生成二维码
        let qrcode = new QRCode('qrcode', {
          width: 100,  // 二维码宽度
          height: 100, // 二维码高度
          text: this.form.address
        })
      },
      //清除二维码
      cleanCode() {
        this.$refs.qrcode.innerHTML = "";
      },
      getSiteInfo() {
        getSiteInfoProfile().then(response => {
          this.mbpaySiteInfo = response.data;
        });
      }
    }
  };
</script>
