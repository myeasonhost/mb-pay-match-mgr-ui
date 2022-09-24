<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />用户名称
                <div class="pull-right">{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />手机号码
                <div class="pull-right">{{ user.phonenumber }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />所属部门
                <div class="pull-right" v-if="user.dept">{{ user.dept.deptName }} / {{ postGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />所属角色
                <div class="pull-right">{{ roleGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建日期
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>商户信息</span>
          </div>
          <div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                商家账号
                <div class="pull-right">{{ mbpaySiteInfo.siteAccount }}</div>
              </li>
              <li class="list-group-item">
                商家ID
                <div class="pull-right">{{ mbpaySiteInfo.siteId }}</div>
              </li>
              <li class="list-group-item">
                商家名称
                <div class="pull-right">{{ mbpaySiteInfo.siteName }}</div>
              </li>
              <li class="list-group-item">
                充值费率
                <div class="pull-right">{{ mbpaySiteInfo.chargeRate }}%</div>
              </li>
              <li class="list-group-item">
                提现费率
                <div class="pull-right">{{ mbpaySiteInfo.withdrawRate }}%</div>
              </li>
              <li class="list-group-item">
                撮合充值费率
                <div class="pull-right">{{ mbpaySiteInfo.chChargeRate }}%</div>
              </li>
              <li class="list-group-item">
                撮合提现费率
                <div class="pull-right">{{ mbpaySiteInfo.chWithdrawRate }}%</div>
              </li>
              <li class="list-group-item">
                appKey
                <div class="pull-right">{{ mbpaySiteInfo.appKey }}
                  <i class="el-icon-document-copy" v-clipboard:copy="mbpaySiteInfo.appKey" v-clipboard:success="onCopy"
                     v-clipboard:error="onError"></i>
                </div>
              </li>
              <li class="list-group-item">
                appSecret
                <div class="pull-right">{{ mbpaySiteInfo.appSecret }}
                  <i class="el-icon-document-copy" v-clipboard:copy="mbpaySiteInfo.appSecret" v-clipboard:success="onCopy"
                     v-clipboard:error="onError"></i>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd />
            </el-tab-pane>
            <el-tab-pane label="修改交易密码" name="resetAcctPwd">
              <resetAcctPwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import resetAcctPwd from "./resetAcctPwd";
import { getUserProfile } from "@/api/system/user";
import {getSiteInfoProfile} from "@/api/pay/profile";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd, resetAcctPwd},
  data() {
    return {
      user: {},
      mbpaySiteInfo: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo"
    };
  },
  created() {
    this.getUser();
    this.getSiteInfo();
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
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
    },
  }
};
</script>
