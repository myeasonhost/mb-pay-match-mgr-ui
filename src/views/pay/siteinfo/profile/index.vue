<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-card class="box-card">

          <el-descriptions class="margin-top" title="账号信息" :column="3" border>
            <el-descriptions-item>
              <template slot="label">
                商家账号
              </template>
              <el-input :disabled="true" v-model="mbpaySiteInfo.siteAccount"/>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                商家ID
              </template>
              <el-input :disabled="true" v-model="mbpaySiteInfo.siteId"/>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                商家名称
              </template>
              <el-input :disabled="true" v-model="mbpaySiteInfo.siteName"/>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                充值费率
              </template>
              <el-input :disabled="true" v-model="mbpaySiteInfo.chargeRate"/>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                提现费率
              </template>
              <el-input :disabled="true" v-model="mbpaySiteInfo.withdrawRate"/>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                注册时间
              </template>
              <el-input :disabled="true" v-model="mbpaySiteInfo.createTime"/>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                撮合充值费率
              </template>
              <el-input :disabled="true" v-model="mbpaySiteInfo.chChargeRate"/>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                撮合提现费率
              </template>
              <el-input :disabled="true" v-model="mbpaySiteInfo.chWithdrawRate"/>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                API KEY
              </template>
              <el-input :disabled="true" v-model="mbpaySiteInfo.apiKey">
                <template slot="append">
                  <el-button type="success" style="background-color: #1ab394;color: #f4f4f5"
                             v-clipboard:copy="mbpaySiteInfo.apiKey" v-clipboard:success="onCopy"
                             v-clipboard:error="onError" plain>复制
                  </el-button>
                </template>
              </el-input>

            </el-descriptions-item>

          </el-descriptions>

        </el-card>

        <el-card class="box-card">
          <el-form ref="form" :model="mbpaySiteInfo" :rules="rules" label-width="110px">
            <el-descriptions class="margin-top" title="" :column="2" border :colon="false">
              <template slot=title>
                个人资料 <span style="color: red">（谨慎修改用户信息，胡乱填写将封号处理）</span>
              </template>
              <el-descriptions-item>
                <template slot="label">
                  姓
                </template>
                <el-input v-model="mbpaySiteInfo.surname" placeholder="请输入姓" maxlength="50"/>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  名
                </template>
                <el-input v-model="mbpaySiteInfo.name" placeholder="请输入名" maxlength="50"/>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  证件类型
                </template>
                <el-select v-model="mbpaySiteInfo.documentType" placeholder="请选择证件类型">
                  <el-option
                    v-for="dict in dict.type.mbpay_document_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="Number(dict.value)"
                  >{{dict.label}}
                  </el-option>
                </el-select>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  证件号
                </template>
                <el-input v-model="mbpaySiteInfo.idNo" placeholder="请输入证件号"/>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  性别
                </template>
                <el-select v-model="mbpaySiteInfo.gender" placeholder="请选择性别">
                  <el-option
                    v-for="dict in dict.type.sys_user_sex"
                    :key="dict.value"
                    :label="dict.label"
                    :value="Number(dict.value)"
                  >{{dict.label}}
                  </el-option>
                </el-select>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  手机号
                </template>
                <el-input v-model="mbpaySiteInfo.phone" placeholder="请输入手机号" maxlength="11"/>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  邮箱
                </template>
                <el-input v-model="mbpaySiteInfo.email" placeholder="请输入邮箱" maxlength="32"/>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  联系地址
                </template>
                <el-input v-model="mbpaySiteInfo.address" placeholder="请输入联系地址" maxlength="200"/>
              </el-descriptions-item>

            </el-descriptions>
            <el-descriptions  :colon="false" style="
    padding-top: 10px;">
              <el-descriptions-item>
                <template slot="label">
                  <el-button style="background-color: rgb(26, 179, 148);" type="primary"
                             size="max" @click="submit"> 保存
                  </el-button>
                </template>
              </el-descriptions-item>
            </el-descriptions>
          </el-form>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import {getSiteInfoProfile, updateMemberProfile} from "@/api/pay/profile";

  export default {
    dicts: ['sys_user_sex', 'mbpay_document_type'],
    name: "Profile",
    components: {},
    data() {
      return {
        mbpaySiteInfo: {} // 表单校验
        , rules: {
          email: [
            {required: true, message: "邮箱地址不能为空", trigger: "blur"},
            {
              type: "email",
              message: "请输入正确的邮箱地址",
              trigger: ["blur", "change"]
            }
          ],
          phone: [
            {required: true, message: "手机号码不能为空", trigger: "blur"},
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
          ]
        }
      };
    },
    created() {
      this.getSiteInfo();
    }, // 表单参数
    form: {},
    methods: {
      submit() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            updateMemberProfile(this.mbpaySiteInfo).then(response => {
              this.$modal.msgSuccess("修改成功");
            });
          }
        });
      },
      getSiteInfo() {
        getSiteInfoProfile().then(response => {
          this.mbpaySiteInfo = response.data;
        });
      },
      onCopy() {
        this.$message.success("内容已复制到剪切板")
      },
      onError() {
        this.$message.error('抱歉，复制失败！')
      }
    }
  };
</script>
