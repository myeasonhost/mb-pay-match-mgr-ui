<template>
  <div>
    <el-dialog
      title="IP白名单"
      :visible.sync="dialogVisible"
      width="600px">
      <el-table
        border
        :data="list.filter(data => !search || data.ip.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%">
        <el-table-column
          label="IP">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入IP搜索"/>
          </template>
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.ip" placeholder="请输入IP"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200px">
          <template slot-scope="scope">
            <div style="font-size:24px">
              <i v-if="list.length > 1" style="color:#ff4949;margin-left: 10px;" @click="removeIp(scope.row.ip)" class="el-icon-remove"></i>
              <i v-if="list.length - 1 === scope.$index" style="color:#1890ff;margin-left: 10px;" @click="addIp" class="el-icon-circle-plus"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFn">取消</el-button>
        <el-button :disabled="loading" type="primary" @click="comfirmFn">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 父组建中使用方式
 * 一、引入 import Dialog from './components/Dialog/Dialog.vue'
 * 二、注册
 * components: {
 *   Dialog,
 * },
 *
 * <Dialog ref="xxx" @success="successFn"></Dialog>
 *
*/
export default {
  data () {
    return {
      list: [],
      id:'',
      loading: false,
      dialogVisible: false,
      search: '',
    }
  },
  methods: {
    // this.$refs.xxx.open 传入一个list[{ ip: xxx }, { ip: xx }]
    open (id,ip) {
      this.search='';
      this.dialogVisible = true;
      this.id = id;
      var str = ip.split(',');
      for (var i = 0, len = str.length; i < len; i++) {
        this.list.push({'ip':str[i]})
      }
    },
    // 移除列表上的某个ip
    removeIp (ip) {
      const index = this.list.findIndex(e => e.ip === ip)
      this.list.splice(index, 1)
    },
    // 增加ip输入框
    addIp () {
      this.list.push({
        ip: ''
      })
    },
    // 在父组建中写个方法 successFn，然后通过 @success="successFn"  来接收点击确认后的list
    comfirmFn () {
      if (this.loading) {
        return
      }
      var ip = '';
      for (var i = 0, len = this.list.length; i < len; i++) {
        ip += this.list[i].ip + ',';
      }
      this.$emit('success', this.id,ip.substring(0,ip.length-1))
    },
    // 在父组建中执行提交逻辑的时候可通过 this.$refs.xxx.setCommitState() 设置确认按钮的状态，传入 true为提交中 按钮会禁用，false为可以点击
    setCommitState (state) {
      this.loading = state
    },
    // 关闭弹窗  this.$refs.xxx.closeFn()
    closeFn () {
      this.dialogVisible = false;
      this.list=[];
      this.id='';
    }
  },
}
</script>
