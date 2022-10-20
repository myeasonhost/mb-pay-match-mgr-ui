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

    <el-table ref="table" v-loading="loading" :data="withdrawList"
              @sort-change="changeSort"
              @expand-change="expandChange" border
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
                  v-if="scope.row.matchStatus==0 || scope.row.matchStatus==4"
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
                <el-button
                  v-if="scope.row.matchStatus==0 || scope.row.matchStatus==4"
                  size="small"
                  type="text"
                  icon="el-icon-s-unfold"
                  @click="handleUnFold(scope.row)"
                  v-hasPermi="['mbpay:recharge:edit']"
                >手动拆单
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
      <el-table-column label="提现时间" align="center" prop="withdrawTime" width="90" sortable="custom">
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
      <el-table-column label="审核时间" align="center" prop="applyTime" width="90" sortable="custom">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applyTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status==1"
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mbpay:recharge:edit']"
          >审批
          </el-button>
          <br>
          <el-button
            size="small"
            type="text"
            icon="el-icon-thumb"
            @click="toogleExpand(scope.row)"
            v-hasPermi="['mbpay:recharge:query']"
          >拆单详情
          </el-button>
          <br>
          <el-button
            v-if="scope.row.status==3"
            size="small"
            type="text"
            icon="el-icon-s-custom"
            @click="handleAdminAll(scope.row)"
            v-hasPermi="['mbpay:recharge:edit']"
          >合并代付
          </el-button>
          <el-button
            size="small"
            type="text"
            icon="el-icon-s-fold"
            @click="handleFold(scope.row)"
            v-hasPermi="['mbpay:recharge:edit']"
          >合并拆单
          </el-button>
          <el-button
            v-if="scope.row.status==3"
            size="small"
            type="text"
            icon="el-icon-delete"
            @click="handleCancel(scope.row)"
            v-hasPermi="['mbpay:recharge:edit']"
          >合并取消
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
        <el-form-item label="图片凭证1" prop="payimageUrl" width="300px" v-if="form.payimageUrl!=null">
          <el-image :src="form.payimageUrl"></el-image>
        </el-form-item>
        <el-form-item label="图片凭证2" prop="payimageUrl2" width="300px" v-if="form.payimageUrl2!=null">
          <el-image :src="form.payimageUrl2"></el-image>
        </el-form-item>
        <el-form-item label="图片凭证3" prop="payimageUrl3" width="300px" v-if="form.payimageUrl3!=null">
          <el-image :src="form.payimageUrl3"></el-image>
        </el-form-item>
        <el-form-item label="图片凭证4" prop="payimageUrl4" width="300px" v-if="form.payimageUrl4!=null">
          <el-image :src="form.payimageUrl4"></el-image>
        </el-form-item>
        <el-form-item label="图片凭证5" prop="payimageUrl5" width="300px" v-if="form.payimageUrl5!=null">
          <el-image :src="form.payimageUrl5"></el-image>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitForm(6)" v-if="form.status==5">审批通过</el-button>
        <el-button type="danger" @click="submitForm(7)" v-if="form.status==5">取消支付</el-button>
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
          <div style="color: red;font-size: 20px;font-family: 'Arial Black';">&nbsp;&nbsp;&nbsp;{{
              formAdmin.amount
            }}
          </div>
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
        <el-button type="primary" @click="submitAdminForm(3)">完成转账</el-button>
      </div>
    </el-dialog>

    <!-- 代付合并对话框 -->
    <el-dialog :title="title" :visible.sync="openAdminAll" width="500px" append-to-body>
      <div style="color: green;font-weight: bold;font-size: 10px;margin-bottom: 20px;">
        <div>
          <i class="el-icon-warning"></i>
          <span>&nbsp;&nbsp;&nbsp;温馨提示：此功能是将所有【撮合超时】的子单，一致性通过合并代付完成转账</span>
        </div>
        <div style="color: #f4516c;font-size: 8px;">&nbsp;&nbsp;&nbsp;（1）如果信息匹配，线下转账，上传转账凭证；</div>
        <div style="color: #f4516c;font-size: 8px;">&nbsp;&nbsp;&nbsp;（2）如果商户金额不足，请不要转账；</div>
      </div>
      <div/>
      <el-form ref="formAdminAll" :model="formAdminAll" :rules="rules" label-width="90px">
        <el-form-item label="待付总金额" prop="amount">
          <span style="color: red;font-size: 20px;font-family: 'Arial Black';">&nbsp;&nbsp;&nbsp;{{
              formAdminAll.subAmountSum
            }}</span>
          <span style="color: red;font-size: 10px;font-family: 'Arial Black';">&nbsp;&nbsp;&nbsp;{{
              formAdminAll.subAmountShow
            }}</span>

        </el-form-item>
        <el-form-item label="银行卡信息" prop="bankName">
          <div><br/></div>
          <div>
            姓名: {{ formAdminAll.userName }}
            &nbsp;
            <i class="el-icon-document-copy" v-clipboard:copy="formAdminAll.userName" v-clipboard:success="onCopy"
               v-clipboard:error="onError"></i>
          </div>
          <div>
            银行卡名称: {{ formAdminAll.userBankName }}
            &nbsp;
            <i class="el-icon-document-copy" v-clipboard:copy="formAdminAll.userBankName" v-clipboard:success="onCopy"
               v-clipboard:error="onError"></i>
          </div>
          <div>
            银行账户: {{ formAdminAll.userBankCard }}
            &nbsp;
            <i class="el-icon-document-copy" v-clipboard:copy="formAdminAll.userBankCard" v-clipboard:success="onCopy"
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
        <el-button type="primary" @click="submitAdminAllForm(3)">完成转账</el-button>
      </div>
    </el-dialog>
    <!-- 拆单合并对话框 -->
    <el-dialog :title="title" :visible.sync="openFold" width="500px" append-to-body>
      <div style="color: green;font-weight: bold;font-size: 10px;margin-bottom: 20px;">
        <div>
          <i class="el-icon-warning"></i>
          <span>&nbsp;&nbsp;&nbsp;温馨提示：此功能是将所有【等待撮合】【撮合超时】的子单，多单合并拼成一单</span>
        </div>
      </div>
      <div/>
      <el-form ref="formFold" :model="formFold" :rules="rules" label-width="90px">
        <el-form-item label="合并总金额" prop="amount">
          <span style="color: red;font-size: 20px;font-family: 'Arial Black';">&nbsp;&nbsp;&nbsp;{{
              formFold.subAmountSum
            }}</span>
        </el-form-item>
        <el-form-item label="合并总明细" prop="subAmount">
          <div>
            <div style="color: gray;font-size: 10px;font-family: 'Arial Black';">&nbsp;笔数：{{ formFold.subAmountNum }}
            </div>
            <div style="color: gray;font-size: 10px;font-family: 'Arial Black';">&nbsp;子金额：{{
                formFold.subAmountShow
              }}
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel(1)">取 消</el-button>
        <el-button type="primary" @click="submitFoldForm()">确认合并</el-button>
      </div>
    </el-dialog>

    <!-- 手动拆单对话框 -->
    <el-dialog :title="title" :visible.sync="openUnFold" width="500px" append-to-body>
      <div style="color: green;font-weight: bold;font-size: 10px;margin-bottom: 20px;">
        <div>
          <i class="el-icon-warning"></i>
          <span>&nbsp;&nbsp;&nbsp;温馨提示：此功能是将所有【等待撮合】【撮合超时】的单，一单拆分成多单</span>
        </div>
      </div>
      <div/>
      <el-form ref="formUnFold" :model="formUnFold" :rules="rules" label-width="90px">
        <el-form-item label="拆单总金额" prop="amount">
          <span style="color: red;font-size: 20px;font-family: 'Arial Black';">&nbsp;&nbsp;&nbsp;{{
              formUnFold.matchAmount
            }}</span>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="15">
            <el-form-item label="拆分金额1" prop="subAmount">
              <el-input v-model="formUnFold.subAmount" width="50px" size="mini"
                        type='number' min="0" onkeyup="value=value.replace(/^0{1,}/g,'')"
                        placeholder="请输入拆分金额"/>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="padding-left: 5px;">
            <el-button size="mini" type="primary" icon="el-icon-plus" round @click="addInput"/>
          </el-col>
        </el-row>
        <div v-for="(item,index) in dynamicItemArr" :key="index">
          <el-row :gutter="20">
            <el-col :span="15">
              <el-form-item :label="'拆分金额'+(index+2)" prop="subAmount">
                <el-input v-model="item.subAmount" width="50px" size="mini" type='number' min="0"
                          onkeyup="value=value.replace(/^0{1,}/g,'')"
                          placeholder="请输入拆分金额"/>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="padding: 5px;">
              <el-button size="small" type="danger" icon="el-icon-delete" round @click="deleteInput(item,index)"/>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel(1)">取 消</el-button>
        <el-button type="primary" @click="submitUnFoldForm()">确认拆分</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getWithdraw, getWithdraw2, listWithdraw2, notifyCancel} from "@/api/mbpay/withdraw";
import {getRecharge, updateRecharge} from "@/api/mbpay/recharge";
import {listPool, getPool, daifu, daifuAll, fold, unfold} from "@/api/mbpay/pool";
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
      openAdminAll: false,
      openFold: false,
      openUnFold: false,
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
      formAdminAll: {},
      formFold: {},
      dynamicItemArr: [],
      formUnFold: {
        subAmount: undefined,
        dynamicItemArr: []
      },
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
        subAmount: [
          {required: true, message: "拆分金额不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    addInput() {
      this.dynamicItemArr.push({
        subAmount: ""
      });
    },
    deleteInput(item, index) {
      this.dynamicItemArr.splice(index, 1);
    },
    changeSort(column) {
      Object.assign(
        this.queryParams,
        {
          'orderProp': column.prop,
          'orderBy': column.order
        }
      )
      this.getList();
    },
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
      this.openAdminAll = false;
      this.openFold = false;
      this.openUnFold = false;
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

      this.formAdmin = {};
      this.resetForm("formAdmin");

      this.formAdminAll = {};
      this.resetForm("formAdminAll");

      this.formFold = {};
      this.resetForm("formFold");

      this.formUnFold = {};
      this.resetForm("formUnFold");

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
      const matchId = row.matchId;
      getWithdraw2(id,matchId).then(response => {
        this.formAdmin = response.data;
        this.formAdmin.amount = row.matchAmount;  //row.amount=父类金额， row.matchAmount=拆分金额
        this.formAdmin.notifyTimes = row.matchId; //借用字段

        this.openAdmin = true;
        this.title = "代付转账明细";

        if (this.$refs.imageUpload) {
          this.$refs.imageUpload.clearFiles();
        }
      });
    },
    /**合并代付*/
    handleAdminAll(row) {
      this.reset();
      this.queryRechargeParams.parentId = row.id;
      listPool(this.queryRechargeParams).then(response => {
        let subAmountSum = 0;
        let subAmountShow = new Array();
        response.rows.map(m => {
          if (m.matchStatus == 4 || m.matchStatus == 0) {
            subAmountSum += m.matchAmount;
            subAmountShow.push(m.matchAmount);
          }
        });
        if (!subAmountSum) {
          this.msgError("只有等待撮合或者超时的金额，才能代付合并");
          return;
        }
        this.formAdminAll = row;
        this.formAdminAll.subAmountSum = subAmountSum;
        if (subAmountShow.length) {
          this.formAdminAll.subAmountShow = subAmountShow;
        } else {
          this.formAdminAll.subAmountShow = "";
        }
        this.openAdminAll = true;
        this.title = "代付合并明细";

        if (this.$refs.imageUpload) {
          this.$refs.imageUpload.clearFiles();
        }
      });
    },
    /** 取消提现按钮操作 */
    handleCancel(row) {
      this.reset();
      const id = row.id;
      this.$confirm('此操作将所有未匹配的单全部进行取消提现操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        notifyCancel(id).then(response => {
          this.getList();
          this.msgSuccess('取消提现已经通知');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消通知'
        });
      });
      this.open = false;
    },
    /**合并拆单**/
    handleFold(row) {
      this.reset();
      this.queryRechargeParams.parentId = row.id;
      listPool(this.queryRechargeParams).then(response => {
        let subAmountSum = 0;
        let subAmountShow = new Array();
        let subAmountNum = 0;
        response.rows.map(m => {
          if (m.matchStatus == 4 || m.matchStatus == 0) {
            subAmountSum += m.matchAmount;
            subAmountShow.push(m.matchAmount);
            subAmountNum++;
          }
        });
        if (!subAmountSum) {
          this.msgError("只有未匹配或者超时的金额，才能拆单合并");
          return;
        }
        this.formFold = row;
        this.formFold.subAmountSum = subAmountSum;
        this.formFold.subAmountNum = subAmountNum;
        if (subAmountShow.length) {
          this.formFold.subAmountShow = subAmountShow;
        } else {
          this.formFold.subAmountShow = "";
        }
        this.openFold = true;
        this.title = "合并拆单明细";

      });
    },
    /**手动拆单**/
    handleUnFold(row) {
      this.reset();
      this.formUnFold.row = row;
      this.dynamicItemArr = [];
      getPool(row.matchId).then(response => {
        this.formUnFold = response.data;
        this.openUnFold = true;
        this.title = "手动拆单明细";
      })
    },
    /** 提交按钮 */
    submitForm(status) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.form.status = status; //借用字段，使用撮合池状态
            updateRecharge(this.form).then(response => {
              this.msgSuccess("审批处理完成");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    submitAdminForm(matchStatus) {
      this.formAdmin.status = matchStatus;
      daifu(this.formAdmin).then(response => {
        this.msgSuccess("代付成功");
        this.openAdmin = false;
        this.getList();
      });
    },
    submitAdminAllForm(matchStatus) {
      this.formAdminAll.status = matchStatus;
      if (this.formAdminAll.subAmountSum) {
        daifuAll(this.formAdminAll).then(response => {
          this.msgSuccess("代付合并成功");
          this.openAdminAll = false;
          this.getList();
        });
      } else {
        this.msgError("没有合并的拆单金额");
      }

    },
    submitFoldForm() {
      fold(this.formFold).then(response => {
        this.msgSuccess("合并拆分成功");
        this.openFold = false;
        this.getList();
        // this.expandChange(this.formFold, 1);
      });
    },
    submitUnFoldForm() {
      let subAmountList = new Array();
      let subAmount1 = this.formUnFold.subAmount ? this.formUnFold.subAmount : 0;
      if (subAmount1) {
        subAmountList.push(subAmount1);
      }
      if (this.dynamicItemArr.length > 0) {
        this.dynamicItemArr.map(item => {
          if (item.subAmount) {
            subAmount1 = Number(subAmount1) + Number(item.subAmount);
            subAmountList.push(item.subAmount);
          }
        })
      }
      if (subAmountList.length == 0) {
        this.$message.error('输入金额大于0！');
        return;
      }
      if (this.formUnFold.matchAmount != subAmount1) {
        this.$message.error('拆分金额=' + subAmount1 + "不等于总金额=" + this.formUnFold.matchAmount);
        return;
      }
      this.formUnFold.subAmountList = subAmountList.join(",");
      unfold(this.formUnFold).then(response => {
        this.msgSuccess("手动拆分成功");
        this.openUnFold = false;
        this.getList();
        // this.expandChange(this.formUnFold.row, 1);
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
      if (file) {
        this.loading = false;
        this.upload.dialogImageUrl = file.url;
        this.upload.dialogVisible = true;
        this.formAdmin.withdrawUrl = file.response.url; //借用字段
        this.formAdminAll.withdrawUrl = file.response.url; //借用字段

      }
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
      this.formAdminAll.withdrawUrl = response.url; //借用字段
    }
  }
};
</script>
