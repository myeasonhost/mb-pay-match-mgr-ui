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
      <el-form-item label="商户提单号" prop="withdrawId" label-width="100px">
        <el-input
          v-model="queryParams.withdrawId"
          placeholder="请输入商户提单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="玩家ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入玩家ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="提现状态" clearable>
          <el-option
            v-for="dict in dict.type.mbpay_withdraw_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间" prop="createTime">
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

    <el-table ref="table" v-loading="loading" :data="withdrawList" @expand-change="expandChange" border
              border-color="#ff0000"
              :row-style="{
                      fontWeight: '600',
                      fontSize: '12px',
                    }">
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
            <el-table-column label="拆分订单号" align="center" prop="matchId"/>
            <el-table-column label="拆单时间" align="center" prop="createTime" width="90">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="提现用户明细" align="left" prop="aSiteId" width="150">
              <template slot-scope="scope">
                <div style="color: #666666;">商户ID：{{ scope.row.asiteId }}</div>
                <div style="color: #666666;">玩家ID：{{ scope.row.asiteUserId }}</div>
                <div style="color: #666666;">提单ID：{{ scope.row.asiteWithdrawId }}</div>
              </template>
            </el-table-column>
            <el-table-column label="拆分金额" align="center" prop="matchAmount"/>
            <el-table-column label="匹配状态" align="center" prop="matchStatus">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.mbpay_match_status" :value="scope.row.matchStatus"/>
              </template>
            </el-table-column>
            <el-table-column label="充值用户明细" align="left" prop="aSiteId" width="150">
              <template slot-scope="scope">
                <div style="color: #4AB7BD;">{{ scope.row.bsiteId == null ? "" : "商户ID：" + scope.row.bsiteId }}</div>
                <div style="color: #4AB7BD;">{{
                    scope.row.bsiteUserId == null ? "" : "玩家ID：" + scope.row.bsiteUserId
                  }}
                </div>
                <div style="color: #4AB7BD;">{{
                    scope.row.bsiteOrderId == null ? "" : "订单ID：" + scope.row.bsiteOrderId
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="匹配时间" align="center" prop="bpayTime" width="90">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.bpayTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="支付状态" align="center" prop="matchStatus">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.mbpay_recharge_status" :value="scope.row.rechargeStatus"/>
              </template>
            </el-table-column>
            <el-table-column label="审核人" align="center" prop="applyBy"/>
            <el-table-column label="审核时间" align="center" prop="applyTime" width="90">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.applyTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.rechargeStatus==6 || scope.row.rechargeStatus==8"
                  size="mini"
                  type="text"
                  icon="el-icon-search"
                  @click="handleUpdateChild(scope.row)"
                  v-hasPermi="['mbpay:pool:query']"
                >查看凭证
                </el-button>
                <el-button
                  v-if="scope.row.rechargeStatus==4"
                  size="mini"
                  type="text"
                  icon="el-icon-s-custom"
                  @click="handleAdminChild(scope.row)"
                  v-hasPermi="['mbpay:recharge:edit']"
                >转代付
                </el-button>
                <el-button
                  v-if="scope.row.matchStatus==0"
                  size="mini"
                  type="text"
                  icon="el-icon-s-custom"
                  @click="handleAdminChild(scope.row)"
                  v-hasPermi="['mbpay:recharge:edit']"
                >转代付
                </el-button>
                <el-button
                  v-if="scope.row.rechargeStatus==5"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdateChild(scope.row)"
                  v-hasPermi="['mbpay:recharge:edit']"
                >审批
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="提现订单号" align="center" prop="id"/>
      <el-table-column label="商户ID/玩家ID" align="center" prop="siteId" width="120">
        <template slot-scope="scope">
          <div style="color: #13ce66;font-weight: bold;font-size: 13px;">{{ scope.row.siteId }}</div>
          <div style="color: #f4516c;font-weight: bold;font-size: 13px;">{{ scope.row.userId }}</div>
        </template>
      </el-table-column>
      <el-table-column label="商户提单号" align="center" prop="withdrawId"/>
      <el-table-column label="提款明细" align="left" prop="amount" width="130">
        <template slot-scope="scope">
          <div style="color: #1890ff;font-family: 'Arial Black';font-size: small;">
            提现金额：{{ scope.row.amount == null ? "0.00" : scope.row.amount }}
          </div>
          <div style="color: red;font-family: 'Arial Black';font-size: small;">
            换算金额：{{ scope.row.coinAmount == null ? "0.00" : scope.row.coinAmount }}
          </div>
          <div style="color: #f8ac59;font-style: italic;font-size: small;">
            汇率：{{ scope.row.currency == null ? "--" : scope.row.currency }}
            / {{ scope.row.coinCode == null ? "--" : scope.row.coinCode }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="提现状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mbpay_withdraw_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="提现时间" align="center" prop="withdrawTime" width="90">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.withdrawTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提款人明细" align="left" prop="amount" width="200">
        <template slot-scope="scope">
          <div style="color: #666666;font-size: small;">
            提款姓名：{{ scope.row.userName }}
          </div>
          <div style="color: #666666;font-size: small;">
            提款卡号：{{ scope.row.userBankCard }}
          </div>
          <div style="color: #666666;font-size: small;">
            提款银行：{{ scope.row.userBankName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="applyBy"/>
      <el-table-column label="审核时间" align="center" prop="applyTime" width="90">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applyTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status==1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mbpay:recharge:edit']"
          >审批
          </el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-thumb"
            @click="toogleExpand(scope.row)"
            v-hasPermi="['mbpay:recharge:query']"
          >拆单详情
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

    <!-- 查看凭证对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <div style="color: green;font-weight: bold;font-size: 10px;" v-if="form.status==5">
        <div>
          <i class="el-icon-warning"></i>
          <span>&nbsp;&nbsp;&nbsp;温馨提示：请仔细核对收款信息与转账截图凭证一致，确保用户充值交易成功</span>
        </div>
        <div style="color: #f4516c;font-size: 8px;">&nbsp;&nbsp;&nbsp;（1）如果信息匹配，点击按钮【评审通过】，代表用户支付成功；</div>
        <div style="color: #f4516c;font-size: 8px;">&nbsp;&nbsp;&nbsp;（2）如果信息不匹配，点击按钮【评审失败】，代表用户支付失败；</div>
      </div>
      <div/>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商家账号" prop="siteId">
              <el-input v-model="form.siteId" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="玩家ID" prop="userId" v-if="form.userId">
              <el-input v-model="form.userId" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="充值金额" prop="amount">
              <el-input v-model="form.amount" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际收款" prop="coinAmount">
              <el-input v-model="form.coinAmount" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="支付状态" prop="status">
              <dict-tag :options="dict.type.mbpay_recharge_status" :value="form.status"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手续费" prop="currency">
              <el-input v-model="form.currency" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="收款户主" prop="productName">
          <el-input v-model="form.userName" :disabled="true"/>
        </el-form-item>
        <el-form-item label="收款卡号" prop="userBankCard">
          <el-input v-model="form.userBankCard" :disabled="true"/>
        </el-form-item>
        <el-form-item label="收款银行" prop="userBankName">
          <el-input v-model="form.userBankName" :disabled="true"/>
        </el-form-item>
        <el-form-item label="评审意见" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入评审意见"/>
        </el-form-item>
        <el-form-item label="图片凭证" prop="payimageUrl" width="300px">
          <el-image :src="form.payimageUrl"></el-image>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitForm(6)" v-if="form.status==5">审批通过</el-button>
        <el-button type="danger" @click="submitForm(7)" v-if="form.status==5">审批失败</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 代付对话框 -->
    <el-dialog :title="title" :visible.sync="openAdmin" width="500px" append-to-body>
      <div style="color: green;font-weight: bold;font-size: 10px;margin-bottom: 20px;">
        <div>
          <i class="el-icon-warning"></i>
          <span>&nbsp;&nbsp;&nbsp;温馨提示：请仔细核对商户余额，确保转账成功</span>
        </div>
        <div style="color: #f4516c;font-size: 8px;">&nbsp;&nbsp;&nbsp;（1）如果信息匹配，线下转账，上传转账凭证；</div>
        <div style="color: #f4516c;font-size: 8px;">&nbsp;&nbsp;&nbsp;（2）如果商户金额不足，请不要转账；</div>
      </div>
      <div/>
      <el-form ref="formAdmin" :model="formAdmin" :rules="rules" label-width="90px">
        <el-form-item label="待付金额" prop="amount">
          <el-input v-model="formAdmin.amount" disabled/>
        </el-form-item>
        <el-form-item label="银行卡信息" prop="bankName">
          <div><br/></div>
          <div>
            姓名: {{ formAdmin.userName }}
            &nbsp;
            <i class="el-icon-document-copy" v-clipboard:copy="formAdmin.userName" v-clipboard:success="onCopy"
               v-clipboard:error="onError"></i>
          </div>
          <div>
            银行卡名称: {{ formAdmin.userBankName }}
            &nbsp;
            <i class="el-icon-document-copy" v-clipboard:copy="formAdmin.bankName" v-clipboard:success="onCopy"
               v-clipboard:error="onError"></i>
          </div>
          <div>
            银行账户: {{ formAdmin.userBankCard }}
            &nbsp;
            <i class="el-icon-document-copy" v-clipboard:copy="formAdmin.bankNum" v-clipboard:success="onCopy"
               v-clipboard:error="onError"></i>
          </div>
        </el-form-item>
        <el-form-item label="转账截图" prop="payimageUrl" width="300px">
          <el-upload
            list-type="picture-card"
            accept=".jpg, .png"
            ref="imageUpload"
            :action="upload.url"
            :headers="upload.headers"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :limit="1"
            :auto-upload="true">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <el-dialog :visible.sync="upload.dialogVisible">
            <img width="100%" :src="upload.dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel(1)">取 消</el-button>
        <el-button type="primary" @click="submitAdminForm()">完成转账</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {getWithdraw, listWithdraw2} from "@/api/mbpay/withdraw";
import {getRecharge, updateRecharge} from "@/api/mbpay/recharge";
import {listPool, daifu} from "@/api/mbpay/pool";
import {getToken} from "@/utils/auth";

export default {
  name: "pool",
  dicts: ['mbpay_withdraw_status', 'mbpay_recharge_status', 'mbpay_match_status'],
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
      // 提现订单表格数据
      withdrawList: [],
      //图片属性
      // 上传参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        disabled: false,
        dialogImageUrl: '',
        dialogVisible: false,
        // 设置上传的请求头部
        headers: {Authorization: "Bearer " + getToken()},
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/pay/info/picture",
        // 上传的文件列表
        fileList: []
      },
      // 充值订单表格数据
      dataRow: [], // 当前行的数据列表(由于子表格是内嵌的，所以也有子表格的所有数据)
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openAdmin: false,
      // 查询参数1
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteId: undefined,
        withdrawId: undefined,
        userId: undefined,
      },
      // 查询参数2
      queryRechargeParams: {
        pageNum: 1,
        pageSize: 10,
        siteId: undefined,
        orderId: undefined,
        userId: undefined,
        parentId: undefined,
      },
      // 表单参数
      form: {},
      formAdmin: {},
      // 表单校验
      rules: {
        siteId: [
          {required: true, message: "商户ID不能为空", trigger: "blur"}
        ],
        withdrawId: [
          {required: true, message: "商户提单号不能为空", trigger: "blur"}
        ],
        userId: [
          {required: true, message: "用户ID不能为空", trigger: "blur"}
        ],
        remark: [
          {required: true, message: "评审意见不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询提现订单列表 */
    getList() {
      this.loading = true;
      // this.queryParams.status = 3, //默认获取 待撮合的状态列表
      listWithdraw2(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        response.rows.map(row => {
          row.child = [];
          row.loadingChild = true;
        });
        this.withdrawList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    expandChange(row, expandedRows) {
      this.dataRow = row;
      if (expandedRows.length) {
        this.dataRow.loadingChild = true;
        this.queryRechargeParams.parentId = row.id;
        listPool(this.queryRechargeParams).then(response => {
          this.dataRow.child = response.rows;
          this.dataRow.child.push({});
          this.dataRow.child.pop();
          this.dataRow.loadingChild = false;
        });
      }
    },
    // 展开行效果
    toogleExpand(row) {
      this.$refs.table.toggleRowExpansion(row, row.expanded) // 点击button展开
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openAdmin = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        siteId: undefined,
        withdrawId: undefined,
        userId: undefined,
        status: "0",
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
    /** 修改按钮操作 */
    handleUpdateChild(row) {
      this.reset();
      const id = row.brechargeId;
      getRecharge(id).then(response => {
        this.form = response.data;
        this.open = true;
        if (this.form.status == 5) {
          this.title = "审核订单";
        } else {
          this.title = "订单凭证详情";
        }

      });
    },
    handleAdminChild(row) {
      this.reset();
      const id = row.parentId;
      getWithdraw(id).then(response => {
        this.formAdmin = response.data;
        this.formAdmin.amount = row.matchAmount;  //row.amount=父类金额， row.matchAmount=拆分金额
        this.formAdmin.notifyTimes = row.matchId; //借用字段

        this.openAdmin = true;
        this.title = "代付转账明细";
      });
    },
    /** 提交按钮 */
    submitForm(status) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.form.status = status;
            updateRecharge(this.form).then(response => {
              this.msgSuccess("审批处理完成");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    submitAdminForm() {
      daifu(this.formAdmin).then(response => {
        this.msgSuccess("代付成功");
        this.openAdmin = false;
        this.getList();
      });
    },
    onCopy() {
      this.$message.success("内容已复制到剪切板")
    },
    onError() {
      this.$message.error('抱歉，复制失败！')
    },
    handleRemove(file) {
      // this.$refs.imageUpload.handleRemove(file);
    },
    handlePictureCardPreview(file) {
      this.loading = false;
      this.upload.dialogImageUrl = file.url;
      this.upload.dialogVisible = true;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      console.info(response);
      this.upload.isUploading = false;
      this.formAdmin.withdrawUrl = response.url; //借用字段

    }
  }
};
</script>
