<template>
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
        <el-select
          v-model="queryParams.currency"
          placeholder="全部"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.mbpay_charge_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="协议" prop="protocol">
        <el-select
          v-model="queryParams.currency"
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
          @click="handleFB"
          v-hasPermi="['pay:withdrawInfo:add']"
        >法币提现
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          size="mini"
          @click="handleUSDT"
          v-hasPermi="['pay:withdrawInfo:add']"
        >USDT提现
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="withdrawInfoList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center" prop="id"/>
      <el-table-column label="商户信息" align="center" prop="siteId" width="200">
        <template slot-scope="scope">
          <div style="color: #13ce66;font-weight: bold;font-size: 13px;">商家ID:{{ scope.row.siteId }}</div>
          <div style="color: #f4516c;font-weight: bold;font-size: 13px;">商家名称:{{ scope.row.siteName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center" prop="orderId" width="200"/>
      <el-table-column label="币种" align="center" prop="currency"/>
      <el-table-column label="提现明细" align="center" prop="withdrawAmount" width="180">
        <template slot-scope="scope">
          <div style="color: #1890ff;font-family: 'Arial Black';font-size: small;">
            提现金额：{{ scope.row.withdrawAmount == null ? "0.00" : scope.row.withdrawAmount }}
          </div>
          <div style="color: #ff6600;font-family: 'Arial Black';font-size: small;">
            手续费率：{{ scope.row.rate == null ? "0.00" : scope.row.rate }}%
          </div>
          <div style="color: #cc0000;font-family: 'Arial Black';font-size: small;">
            手续费：{{ scope.row.rateAmount == null ? "0.00" : scope.row.rateAmount }}
          </div>
          <div style="color: red;font-family: 'Arial Black';font-size: small;">
            实际到账金额：{{ scope.row.actualAmount == null ? "0.00" : scope.row.actualAmount }}
          </div>
          <div style="color: #f8ac59;font-family: 'Arial Black';font-style: italic;font-size: small;">
            汇率：{{ scope.row.currencyRate == null ? "0.00" : scope.row.currencyRate }}
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
      <el-table-column label="操作人" align="center" prop="operCode"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mbpay_charge_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
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
            v-hasPermi="['pay:withdrawInfo:edit']"
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

    <!-- 审批对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="updRules" label-width="120px">
        <el-form-item label="银行卡信息:" prop="bankName" v-if="form.currency=='RMB'">
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
        <el-form-item label="USDT地址信息:" prop="bankName" v-if="form.currency=='USDT'">
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
            &nbsp;
            <el-button size="mini" @click="createQrcode" round>{{!QRButton ? '展示':'隐藏'}}二维码</el-button>
          </div>
          <div class="qrcode" id="qrcode" ref="qrcode" style="margin-left:10%"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商家ID" prop="siteId">
              <el-input v-model="form.siteId" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商家名称" prop="siteName">
              <el-input v-model="form.siteName" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单号" prop="orderId">
              <el-input v-model="form.orderId" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提现金额" prop="withdrawAmount">
              <el-input v-model="form.withdrawAmount" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="币种" prop="currency" v-if="form.currency=='RMB'">
              <el-input v-model="form.currency" disabled/>
            </el-form-item>
            <el-form-item label="USDT数量" prop="usdtCount" v-if="form.currency=='USDT'">
              <el-input v-model="form.usdtCount" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <dict-tag :options="dict.type.mbpay_charge_status" :value="form.status"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitForm(0,1)">审批通过</el-button>
        <el-button type="danger" @click="submitForm(0,2)">审批失败</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 法币提现对话框 -->
    <el-dialog title="法币提现" :visible.sync="openFB" width="1000px" append-to-body>
      <div style="display:flex;justify-content: center;">
        <div style="width:500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="余额:" prop="balance">
              <div>{{ form.balance == null ? "0.00" : form.balance }} RMB</div>
            </el-form-item>
            <el-row>
              <el-col :span="17">
                <el-form-item label="提现金额:" prop="withdrawAmount">
                  <el-input v-model="form.withdrawAmount" placeholder="请输入提现金额" @change="calculateAmount(1)"/>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="(手续费率:" prop="rate">
                  <div>
                    {{ form.rate == null ? "0.00" : form.rate }}%)
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="实际到账金额:" prop="actualAmount">
              <el-input v-model="form.actualAmount" placeholder="实际到账金额" disabled/>
            </el-form-item>
            <el-form-item label="交易密码:" prop="password">
              <el-input type="password" v-model="form.password" placeholder="请输入交易密码" show-password/>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div style="color: green;font-weight: bold;font-size: 10px;">
        <div>
          <i class="el-icon-warning"></i>
          <span>&nbsp;&nbsp;&nbsp;温馨提示：如果提现到其他银行卡,请到收款银行卡管理添加!</span>
        </div>
      </div>
      <el-table v-loading="loading" ref="sitebankTable" :data="siteBankList" @selection-change="handleSelectionChange"
                class="single-select-table">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="银行名称" align="center" prop="bankName"/>
        <el-table-column label="银行账户" align="center" prop="bankNum"/>
        <el-table-column label="姓名" align="center" prop="userName"/>
        <el-table-column label="分行名称" align="center" prop="branchName"/>
        <el-table-column label="银行编码" align="center" prop="bankCode"/>
        <el-table-column label="币种" align="center" prop="currency"/>
        <el-table-column label="单笔限额" align="center" prop="singleLimit"/>
        <el-table-column label="单日限额" align="center" prop="dayLimit"/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm(1,0)">提交申请</el-button>
        <el-button @click="cancelFB">取 消</el-button>
      </div>
    </el-dialog>

    <!-- USDT提现对话框 -->
    <el-dialog title="USDT提现" :visible.sync="openUSDT" width="1000px" append-to-body>
      <div style="display:flex;justify-content: center;">
        <div style="width:500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="余额:" prop="balance">
              <div>{{ form.balance == null ? "0.00" : form.balance }} RMB</div>
            </el-form-item>
            <el-row>
              <el-col :span="17">
                <el-form-item label="提现金额:" prop="withdrawAmount">
                  <el-input v-model="form.withdrawAmount" placeholder="请输入提现金额" @change="calculateAmount(2)"/>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="(手续费率:" prop="rate">
                  <div>
                    {{ form.rate == null ? "0.00" : form.rate }}%)
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="实际到账金额:" prop="actualAmount">
              <el-input v-model="form.actualAmount" placeholder="实际到账金额" disabled/>
            </el-form-item>
            <el-row>
              <el-col :span="14">
                <el-form-item label="USDT数量:" prop="usdtCount">
                  <el-input v-model="form.usdtCount" placeholder="USDT数量" disabled/>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="1USDT" prop="rate">
                  <div>
                    = {{ form.currencyRate }}CNY
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="交易密码:" prop="password">
              <el-input type="password" v-model="form.password" placeholder="请输入交易密码" show-password/>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div style="color: green;font-weight: bold;font-size: 10px;">
        <div>
          <i class="el-icon-warning"></i>
          <span>&nbsp;&nbsp;&nbsp;温馨提示：如果提现到其他钱包,请到虚拟币收款管理添加!</span>
        </div>
      </div>
      <el-table v-loading="loading" ref="sitebankTable" :data="siteBankList" @selection-change="handleSelectionChange"
                class="single-select-table">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="地址名称" align="center" prop="addrName"/>
        <el-table-column label="协议" align="center" prop="protocol"/>
        <el-table-column label="地址" align="center" prop="address"/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm(2,0)">提交申请</el-button>
        <el-button @click="cancelUSDT">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 设置交易密码对话框 -->
    <el-dialog title="设置交易密码" :visible.sync="openPassword" width="450px" append-to-body>
      <el-form ref="formPassword" :model="formPassword" :rules="passwordRules" label-width="80px">
        <el-form-item label="交易密码" prop="password">
          <el-input type="password" v-model="formPassword.password" placeholder="请输入交易密码" show-password/>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input type="password" v-model="formPassword.repassword" placeholder="请输入交易密码" show-password/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormPassword">确 定</el-button>
        <el-button @click="cancelPassword">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
  .single-select-table thead .el-table-column--selection .cell {
    display: none;
  }
</style>
<script>
  import {
    listWithdrawInfo,
    getWithdrawInfo,
    delWithdrawInfo,
    addWithdrawInfo,
    updateWithdrawInfo,
    exportWithdrawInfo
  } from "@/api/pay/withdrawInfo";
  import {getSiteInfoProfile} from "@/api/pay/profile";
  import {updAcctPwd, checkPassword} from "@/api/pay/siteinfo";
  import {getSiteBanks, getCurrencys} from "@/api/pay/info";
  import QRCode from "qrcodejs2";

  export default {
    name: "WithdrawInfo",
    dicts: ['mbpay_charge_status', 'mbpay_currency_protocol', 'mbpay_currency'],
    components: {},
    data() {
      const checkAmount = (rule, value, callback) => {
        if (value) {
          var reg = /^[1-9]{1}[0-9]{0,16}$/
          if (reg.test(value) === false) {
            callback(new Error("只能输入整数"))
          } else {
            if (value > this.form.balance) {
              callback(new Error("余额不足"))
            }
            callback()
          }
        } else {
          callback()
        }
      };
      const checkPassword = (rule, value, callback) => {
        if (value) {
          let params = {
            password: value,
            id: this.mbpaySiteInfo.id
          };
          this.checkPassword(params).then(response => {
            if (response.code === 200) {
              callback()
            } else {
              callback(new Error("交易密码错误,请重新输入!"))
            }
          }).catch(err => {
            callback(new Error("交易密码错误,请重新输入!"))
          })
          return;
        }
        callback();
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }
        var reg = /^[\dA-Za-z]{6,16}$/
        if (reg.test(value) === false) {
          callback(new Error("请输入6-16位密码,不支持特殊字符"))
        }
        callback();
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formPassword.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        // 定义商户列表对象
        mbpaySiteInfo: {},
        // 遮罩层
        loading: true,
        // 展示二维码按钮
        QRButton: false,
        // 选中数组
        ids: [],
        // 提现选中银行卡或虚拟币数数据
        checkedData: {},
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 提现管理表格数据
        withdrawInfoList: [],
        // 银行卡数据
        siteBankList: [],
        // 日期范围
        dateRange: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 是否显示弹出层
        openFB: false,
        // 是否显示弹出层
        openUSDT: false,
        openPassword: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          orderId: undefined,
          bankNum: undefined,
          status: undefined,
        },
        // 表单参数
        form: {},
        formFB: {},
        formPassword: {},
        // 表单校验
        rules: {
          withdrawAmount: [
            {required: true, message: "请输入提现金额", trigger: "blur"},
            {trigger: "blur", validator: checkAmount}//自定义规则
          ],
          password: [
            {required: true, message: "请输入交易密码", trigger: "blur"},
            {trigger: "blur", validator: checkPassword}//自定义规则
          ],
        },
        passwordRules: {
          password: [
            {required: true, validator: validatePass, trigger: 'blur'}
          ],
          repassword: [
            {required: true, validator: validatePass2, trigger: 'blur'}
          ],
        },
        // 审批表单校验
        updRules: {
          remark: [
            {required: true, message: "请填写备注", trigger: "blur"}
          ]
        },
      };
    },

    created() {
      this.getList();
      this.getSiteInfo();
    },
    methods: {
      /** 查询提现管理列表 */
      getList() {
        this.loading = true;
        listWithdrawInfo(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.withdrawInfoList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        if(this.QRButton){
          this.cleanCode();
        }
        this.open = false;
        this.reset();
      },
      // 取消按钮
      cancelFB() {
        this.openFB = false;
        this.reset();
      },
      // 取消按钮
      cancelUSDT() {
        this.openUSDT = false;
        this.reset();
      },
      // 取消按钮
      cancelPassword() {
        this.openPassword = false;
        this.resetPassword();
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          balance: this.mbpaySiteInfo.balance,
          rate: this.mbpaySiteInfo.withdrawRate,
          userId: undefined,
          siteId: undefined,
          siteName: undefined,
          orderId: undefined,
          currency: undefined,
          currencyRate: undefined,
          rateAmount: undefined,
          withdrawAmount: undefined,
          actualAmount: undefined,
          userName: undefined,
          bankName: undefined,
          bankNum: undefined,
          branchName: undefined,
          bankCode: undefined,
          usdtCount: undefined,
          addrName: undefined,
          protocol: undefined,
          address: undefined,
          operCode: undefined,
          remark: undefined,
          status: 0,
          createTime: undefined,
          updateTime: undefined,
        };
        this.resetForm("formFB");
      },
      // 表单重置
      resetPassword() {
        this.formPassword = {
          password: undefined,
          repassword: undefined
        };
        this.resetForm("formPassword");
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
      handleSelectionChange(rows) {
        if (rows.length > 1) {
          this.$refs.sitebankTable.clearSelection();
          this.$refs.sitebankTable.toggleRowSelection(rows[rows.length - 1]);
        } else if (rows.length === 1) {
          this.sitebankTable = rows[rows.length - 1];
          this.checkedData = rows[rows.length - 1];
        } else {
          this.sitebankTable = [];
          this.checkedData = {};
        }
        /* this.ids = selection.map(item => item.id)
         this.single = selection.length !== 1
         this.multiple = !selection.length*/
      },
      /** FB按钮操作 */
      handleFB() {
        this.getSiteInfo();
        if (this.mbpaySiteInfo === undefined) {
          this.$message.error("该账号未绑定商户!");
          return;
        }
        this.getSiteBanks();
        const hasPassword = (this.mbpaySiteInfo.siteTransactionPwd !== '' && this.mbpaySiteInfo.siteTransactionPwd !== 'undefined');
        if (hasPassword) {
          this.reset();
          this.openFB = true;
          //获取汇率
          this.getConfigKey("mbpay-currency-exchange-rate").then(response => {
            this.form.currencyRate = JSON.parse(response.msg).CNY;
          });
        } else {
          this.resetPassword();
          this.openPassword = true;
        }
      },
      /** USDT按钮操作 */
      handleUSDT() {
        this.getSiteInfo();
        if (this.mbpaySiteInfo === undefined) {
          this.$message.error("该账号未绑定商户!");
          return;
        }
        this.getUsdtList();
        const hasPassword = (this.mbpaySiteInfo.siteTransactionPwd !== '' && this.mbpaySiteInfo.siteTransactionPwd !== 'undefined');
        if (hasPassword) {
          this.reset();
          this.openUSDT = true;
          //获取汇率
          this.getConfigKey("mbpay-currency-exchange-rate").then(response => {
            this.form.currencyRate = JSON.parse(response.msg).USDT;
          });
        } else {
          this.resetPassword();
          this.openPassword = true;
        }
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getWithdrawInfo(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "审批";
        });
      },
      /** 提交按钮 */
      submitForm(type,status) {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              this.form.status = status;
              updateWithdrawInfo(this.form).then(response => {
                if(this.QRButton){
                  this.cleanCode();
                }
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              if (Object.keys(this.checkedData).length === 0) {
                this.$message.error("请选择银行卡!");
                return;
              }
              if (type === 1) {
                this.form.userName = this.checkedData.userName;
                this.form.bankName = this.checkedData.bankName;
                this.form.bankNum = this.checkedData.bankNum;
                this.form.branchName = this.checkedData.branchName;
                this.form.bankCode = this.checkedData.bankCode;
                this.form.currency = this.checkedData.currency;
              } else {
                this.form.addrName = this.checkedData.addrName;
                this.form.protocol = this.checkedData.protocol;
                this.form.address = this.checkedData.address;
                this.form.currency = this.checkedData.currency;
              }
              addWithdrawInfo(this.form).then(response => {
                this.msgSuccess("新增成功");
                if (type === 1) {
                  this.openFB = false;
                } else {
                  this.openUSDT = false;
                }
                this.getList();
              });
            }
          }
        });
      },
      submitFormPassword() {
        let params = {
          password: this.formPassword.password,
          id: this.mbpaySiteInfo.id
        };
        this.$refs["formPassword"].validate(valid => {
          if (valid) {
            updAcctPwd(params).then(response => {
              // 成功以后
              this.cancelPassword();
              this.openFB = true;
              this.getSiteInfo();
            });
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除提现管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delWithdrawInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有提现管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportWithdrawInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      },
      //商户信息
      getSiteInfo() {
        getSiteInfoProfile().then(response => {
          this.mbpaySiteInfo = response.data;
        });
      },
      /** 获取银行卡信息 */
      getSiteBanks() {
        let params = {
          site_id: this.mbpaySiteInfo.siteId,
          currency: 'CNY',
          type: '2'
        };
        getSiteBanks(params).then((response) => {
          this.siteBankList = response.rows;
          this.total = response.total;
        })
      },
      /** 查询虚拟币收款列表 */
      getUsdtList() {
        let params = {
          site_id: this.mbpaySiteInfo.siteId,
          currency: 'USDT',
          status: 1
        };
        getCurrencys(params).then((response) => {
          this.siteBankList = response.rows;
          this.total = response.total;
        })
      },
      //验证交易密码是否正确
      checkPassword(params) {
        return checkPassword(params)
      },
      /** 实际到账金额 */
      calculateAmount(type) {
        //手续费
        this.form.rateAmount = (this.form.withdrawAmount * (this.form.rate / 100)).toFixed(2);
        //实际到账金额
        this.form.actualAmount = (this.form.withdrawAmount - this.form.withdrawAmount * (this.form.rate / 100)).toFixed(2);
        if (type === 2) {//usdt
          this.form.usdtCount = (this.form.actualAmount / this.form.currencyRate).toFixed(2);
        }
      },
      onCopy() {
        this.$message.success("内容已复制到剪切板")
      },
      onError() {
        this.$message.error('抱歉，复制失败！')
      },
      createQrcode() {//生成二维码
        if(!this.QRButton){
          this.QRButton = true;
          let qrcode = new QRCode('qrcode', {
            width: 100,  // 二维码宽度
            height: 100, // 二维码高度
            text: this.form.address
          })
        }else{
          this.cleanCode();
          this.QRButton = false;
        }
      },
      //清除二维码
      cleanCode() {
        this.$refs.qrcode.innerHTML = "";
      },
    }
  };
</script>
