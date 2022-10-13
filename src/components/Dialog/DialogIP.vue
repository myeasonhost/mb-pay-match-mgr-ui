<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="600px">
      <el-table
        border
        :data="list"
        style="width: 100%">
        <el-table-column
          label="IP">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.ip" placeholder="请输入IP"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200px">
          <template slot-scope="scope">
            <div style="font-size:24px">
              <i v-if="list.length > 1" style="color:#ff4949;margin-left: 10px;" @click="removeIp(scope.$index)" class="el-icon-remove"></i>
              <i v-if="list.length - 1 === scope.$index" style="color:#1890ff;margin-left: 10px;" @click="addIp" class="el-icon-circle-plus"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
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
 * <Dialog ref="xxx" @success="successFn"><Dialog
 * 
*/
export default {
  data () {
    return {
      list: [{}],
      loading: false,
      dialogVisible: true
    }
  },
  methods: {
    // this.$refs.xxx.open 传入一个list[{ ip: xxx }, { ip: xx }]
    open (list) {
      this.dialogVisible = true
      this.list = list
    },
    // 移除列表上的某个ip
    removeIp (index) {
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
      this.$emit('success', this.list)
    },
    // 在父组建中执行提交逻辑的时候可通过 this.$refs.xxx.setCommitState() 设置确认按钮的状态，传入 true为提交中 按钮会禁用，false为可以点击
    setCommitState (state) {
      this.loading = state
    },
    // 关闭弹窗  this.$refs.xxx.closeFn()
    closeFn () {
      this.dialogVisible = false
    }
  },
}
</script>
