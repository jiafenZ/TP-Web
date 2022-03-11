<template>
  <el-container class="container">
    <el-aside class="aside">
      <h2 style="margin-left: 60px;margin-top:1cm;">目录</h2>
      <br>
      <el-button
        id="add-top"
        class="comp-tr-top"
        style="margin-left: 20px;"
        type="primary"
        @click="handleAddTop"
      >添加一级目录
      </el-button>
      <br><br><br>
      <!-- tree -->
      <el-tree
        ref="SlotTree"
        :data="setTree"
        :props="defaultProps"
        :expand-on-click-node="false"
        highlight-current
        :node-key="NODE_KEY"
      >
        <div slot-scope="{ node, data }" class="comp-tr-node">
          <!-- 编辑状态 -->
          <template v-if="node.isEdit">
            <el-input
              :ref="'slotTreeInput' + data[NODE_KEY]"
              v-model="data.file_name"
              autofocus
              size="mini"
              @keyup.enter.native="handleInput(node, data)"
            />
            <!-- 焦点离开提交数据    @blur.stop="handleInput(node, data)" -->
          </template>

          <!-- 非编辑状态 -->
          <template v-else>
            <!-- 名称： 新增节点增加class（is-new） -->
            <span
              :class="[
                data[NODE_KEY] < NODE_ID_START ? 'is-new' : '',
                'comp-tr-node--name',
              ]"
              @click="handleNode(node, data)"
            >
              {{ node.label }}
            </span>

            <el-popover
              placement="bottom"
              width="200"
              trigger="click"
              class="more"
            >
              <!-- 按钮 -->
              <span class="comp-tr-node--btns">

                <!-- 新增 -->
                <el-button
                  icon="el-icon-plus"
                  size="mini"
                  circle
                  type="primary"
                  style="margin-left: 30px;"
                  @click="handleAdd(node, data)"
                />

                <!-- 编辑 -->
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  circle
                  type="success "
                  @click="handleEdit(node, data)"
                />

                <!-- 删除 -->
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  circle
                  type="danger"
                  @click="handleDelete(node, data)"
                />
              </span>
              <el-button slot="reference" icon="el-icon-more" size="medium" circle type="text" />
            </el-popover>
          </template>
        </div>
      </el-tree>
    </el-aside>
    <div class="document">
      <el-container v-show="content != ''" class="ckeditor">
        <el-main>
          <!-- 工具栏容器 -->
          <div id="toolbar-container" class="toolbar" />
          <el-card class="editor-card">
            <!-- 编辑器容器 -->
            <div id="editor" class="editor">
              {{ content }}
            </div>
          </el-card>
        </el-main>
      </el-container>
      <!-- 空数据页面 -->
      <div v-show="content == ''" class="empty-box" align="center">
        <img class="empty" src="@/assets/empty/empty-data.png" style="width: 600px;hight: 600px;">
        <br>
        <el-button v-show="name_id != '' && read != '2' && is_name !='1'" id="add" type="primary" size="medium" class="add" @click="add()">创建文章</el-button>
        <span v-show="name_id != '' && read == '2'"> 抱歉！您没有查看该文章权限！ </span>
      </div>
    </div>
    <el-aside v-if="content != ''" class="button">
      <el-button v-show="edit == '1'" id="submit" type="primary" size="medium" class="submit">
        <a v-show="status == 1" @click="dialogVisible = true">保存</a>
        <a v-show="status == 0" @click="dialogVisible = false,startEdit()">编辑</a>
      </el-button>
      <el-dialog
        title="文章权限设置"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <div class="dialog">
          <span>请设置他人阅读该文章的权限</span><br>
          <el-radio v-model="read" label="1">公开</el-radio>
          <el-radio v-model="read" label="2">私密</el-radio><br><br>
          <span>请设置他人编辑该文章的权限</span><br>
          <el-radio v-model="edit" label="1">可编辑</el-radio>
          <el-radio v-model="edit" label="2">不可编辑</el-radio>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false,submit()">确 定</el-button>
        </span>
      </el-dialog>
      <br>
      <div class="footer">
        <el-popover
          v-model="visible"
          placement="top"
          title="注意"
          width="280"
        >
          <p>页面未发生异常关闭时，禁用此文档恢复功能</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="visible = false,recover()">确定</el-button>
          </div>
          <el-button v-show="edit == '1'" slot="reference" type="primary" size="mini">页面异常关闭？点击恢复 >></el-button>
        </el-popover>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'
import { addFileName, fileNameTree, deleteFileName, updateFileName, getFile, addFile } from '@/api/file'

export default {
  data() {
    return {
      isLoading: true, // 是否加载
      setTree: [], // tree数据
      NODE_KEY: 'id', // id对应字段
      NODE_ID_START: 0, // 新增节点id，逐次递减
      startId: '',
      name_id: '',
      file_name: '',
      defaultProps: {
        children: 'children',
        label: 'file_name'
      },
      initParam: {
        // 新增参数
        file_name: '新增节点',
        parent_id: 0,
        children: []
      },
      status: '',
      editor: null, // 编辑器实例
      content: '',
      dialogVisible: false,
      read: '',
      edit: '',
      is_name: '',
      visible: false
    }
  },
  created() {
    this.getList()
    this.getFileData()
  },
  mounted() {
    this.initCKEditor()
  },
  methods: {
    // 获取文章名称列表数据
    getList() {
      this.isLoading = true
      fileNameTree().then((response) => {
        this.setTree = response.data.FileNameTree
        this.startId = response.data.startId
        this.isLoading = false
      })
    },
    handleDelete(_node, _data) {
      // 删除节点
      const obj = JSON.parse(JSON.stringify(_data))
      const data = { 'id': obj.id }
      // 判断是否存在子节点
      if (_data.children && _data.children.length !== 0) {
        this.$message.error('此节点有子级，不可删除！')
        return false
      } else {
        // 删除操作
        const DeletOprate = () => {
          this.$nextTick(() => {
            if (this.$refs.SlotTree) {
              deleteFileName(data)
              this.$refs.SlotTree.remove(_data)
              this.$message.success('删除成功！')
            }
          })
        }

        // 二次确认
        const ConfirmFun = () => {
          this.$confirm('是否删除此节点？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              DeletOprate()
            })
            .catch(() => {})
        }
        // 判断是否新增： 新增节点直接删除，已存在的节点要二次确认
        _data[this.NODE_KEY] < this.NODE_ID_START
          ? DeletOprate()
          : ConfirmFun()
      }
    },
    handleInput(_node, _data) {
      const obj = JSON.parse(JSON.stringify(_data))
      const data = {
        'id': obj.id,
        'file_name': obj.file_name
      }
      // 修改节点
      updateFileName(data)
      // this.getList()
      this.$message.success('修改成功！')
      // 退出编辑状态
      if (_node.isEdit) {
        this.$set(_node, 'isEdit', false)
      }
    },
    handleEdit(_node, _data) {
      // 设置编辑状态
      if (!_node.isEdit) {
        this.$set(_node, 'isEdit', true)
      }
      // 输入框聚焦
      this.$nextTick(() => {
        if (this.$refs['slotTreeInput' + _data[this.NODE_KEY]]) {
          this.$refs[
            'slotTreeInput' + _data[this.NODE_KEY]
          ].$refs.input.focus()
        }
      })
    },
    handleAdd(_node, _data) {
      // 新增节点
      // 参数修改
      const obj = JSON.parse(JSON.stringify(this.initParam)) // copy参数
      obj.parent_id = _data[this.NODE_KEY] // 父id
      obj[this.NODE_KEY] = ++this.startId // 节点id：逐次递加id
      // 判断字段是否存在
      if (!_data.children) {
        this.$set(_data, 'children', [])
      }
      // 新增数据
      _data.children.push(obj)
      // 展开节点
      if (!_node.expanded) {
        _node.expanded = true
      }
      const data = {
        'file_name': obj.file_name,
        'parent_id': obj.parent_id
      }
      addFileName(data).then(() => {
        // this.getList()
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleAddTop() {
      // 添加顶部节点
      const obj = JSON.parse(JSON.stringify(this.initParam)) // copy参数
      obj[this.NODE_KEY] = ++this.startId // 节点id：逐次递加id
      this.setTree.push(obj)
      const data = {
        'file_name': obj.file_name,
        'parent_id': 0
      }
      addFileName(data).then(() => {
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
      document.getElementById('add-top').blur()
    },
    // 富文本编辑相关方法
    getFileData() {
      // 获取文章内容数据
      this.isLoading = true
      const data = {
        'name_id': this.name_id
      }
      getFile(data).then((response) => {
        this.read = response.data.read
        this.edit = response.data.edit
        this.is_name = response.data.is_name
        this.content = response.data.initJson
        this.editor.setData(this.content)
        this.editor.setData(this.editor.isReadOnly = true) // 将编辑器设置只读权限
        this.status = 0
        this.isLoading = false
      })
    },
    handleNode(_node, _data) {
      const obj = JSON.parse(JSON.stringify(_data))
      this.file_name = obj.file_name
      this.name_id = obj.id
      this.getFileData()
    },
    initCKEditor() {
      CKEditor.create(document.querySelector('#editor'), {
        language: 'zh-cn',
        ckfinder: {
          uploadUrl: '/admin/Upload/uploadUrl'
          // 后端处理上传逻辑返回json数据,包括uploaded(选项true/false)和url两个字段
        }
      }).then(editor => {
        const toolbarContainer = document.querySelector('#toolbar-container')
        toolbarContainer.appendChild(editor.ui.view.toolbar.element)
        this.editor = editor // 将编辑器保存起来，用来随时获取编辑器中的内容等，执行一些操作
      }).catch(error => {
        console.error(error)
      })
    },
    add() {
      this.content = 1
      this.edit = '1'
    },
    startEdit() {
      clearInterval(this.timer) // 清除定时器
      this.status = 1
      this.editor.setData(this.editor.isReadOnly = false) // 将编辑器设置可编辑权限
      this.timer = setInterval(() => {
        localStorage.data = this.editor.getData() // 将编辑器内容保存在本地
        localStorage.name_id = this.name_id
        localStorage.file_name = this.file_name
        localStorage.read = this.read
        localStorage.edit = this.edit
      }, 5000)
      this.$once('hook:beforeDestroy', () => {
        // 页面关闭时，销毁定时器
        clearInterval(this.timer)
        this.timer = null
      })
      document.getElementById('add').blur()
    },
    submit() {
      if (localStorage.read === 2) {
        localStorage.edit = 1
      }
      const data = {
        'content': localStorage.data,
        'file_name': localStorage.file_name,
        'name_id': localStorage.name_id,
        'is_open': localStorage.read,
        'is_edit': localStorage.edit
      }
      addFile(data).then(() => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        console.error(error)
      })
      this.status = 0
      this.editor.setData(this.editor.isReadOnly = true) // 将编辑器设置只读权限
      clearInterval(this.timer) // 清除定时器
      document.getElementById('submit').blur()
    },
    recover() {
      if (Number(localStorage.name_id) === Number(this.name_id)) {
        const data = {
          'content': localStorage.data,
          'file_name': localStorage.file_name,
          'name_id': localStorage.name_id,
          'is_open': localStorage.read,
          'is_edit': localStorage.edit
        }
        addFile(data).then(() => {
          this.$notify({
            title: '成功',
            message: '数据恢复成功',
            type: 'success',
            duration: 2000
          })
        }).catch(error => {
          console.error(error)
        })
        this.editor.setData(localStorage.data)
      } else {
        this.$message.error('该文章没有本地缓存')
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(error => {
        console.error(error)
      })
    }
  }
}
</script>

<style>
.aside {
  width: 300px;
  height: 886px;
  box-shadow: 0px 0px 1px 2px #f5f5f5;
}
.document{
  width: 100%;
  height: 886px;
  background: #F8F8F8;
}
.button{
  background: #F8F8F8;
  padding-bottom: var(--footer-height);
}
.footer{
  position: fixed;
  bottom: 15px;
  width: 100%;
  /* background: #00FF00; */
  line-height: var(--footer-height);
  color: #fff;
}
.el-main{
  padding: 0px;
}
.ckeditor{
  margin-left: 15%;
}
/* 设置富文本编辑器容器样式 */
.ck.ck-toolbar{
  /* 工具栏 */
  background: #f3f4f6;
  z-index: 1;
  box-shadow: none;
  border-bottom: none;
  border: 1px solid rgb(255 255 255 / 50%);
  width: 900px;
}
.editor-card{
  box-shadow: 5px 10px 10px #ddd;
  background: #FFFFFF;
  width: 900px;
  height: 830px;
}
.ck.ck-editor__editable_inline {
  /* 编辑栏 */
    overflow: auto;
    padding: 0 var(--ck-spacing-standard);
    letter-spacing: 1px; /* 字体间距 */
    line-height: 22px;
    background: #FFFFFF;
    width: 100%;
    height: 800px;
    overflow-y: hidden; /* 关闭滚动条 */
    overflow-x: hidden; /* 关闭滚动条 */
}
/* 去除编辑框的点击高亮边框 */
.ck.ck-editor__editable:not(.ck-editot__nested-editable).ck-focused{
  outline:none;
  border: 0px;
  box-shadow: none;
}
.ck.ck-editor__editable_inline:hover{
  overflow-y: auto;
}
.submit{
  margin-top: 42px;
}
/* 设置滚动条样式 */
::-webkit-scrollbar {
  /* 编辑器内滚动条宽度为0（隐藏滚动条） */
  width: 0px;
}
/*定义滚动条轨道 内阴影+圆角*/
/* ::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.1);
} */

/*定义滑块 内阴影+圆角*/
/* ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.1);
} */
.dialog{
  line-height: 30px;
  margin-left: 20px;
}
</style>
