<template>
  <div class="list">
    <el-drawer
      title=""
      :visible.sync="drawer"
      :with-header="false"
    >
      <div v-loading="isLoading" class="comp-tree">
        <el-button
          id="add-top"
          class="comp-tr-top"
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
                v-model="data.case_name"
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
                width="300"
                trigger="click"
                class="more"
              >
                <!-- 按钮 -->
                <span class="comp-tr-node--btns">

                  <!-- 新增 -->
                  <el-tooltip effect="dark" content="新增用例名称" placement="bottom">
                    <el-button
                      icon="el-icon-plus"
                      size="mini"
                      circle
                      type="primary"
                      @click="handleAdd(node, data)"
                    />
                  </el-tooltip>

                  <!-- 编辑 -->
                  <el-tooltip effect="dark" content="编辑用例名称" placement="bottom">
                    <el-button
                      icon="el-icon-edit"
                      size="mini"
                      circle
                      type="success "
                      @click="handleEdit(node, data)"
                    />
                  </el-tooltip>

                  <!-- 删除 -->
                  <el-tooltip effect="dark" content="删除测试用例" placement="bottom">
                    <el-button
                      icon="el-icon-delete"
                      size="mini"
                      circle
                      type="danger"
                      @click="handleDelete(node, data)"
                    />
                  </el-tooltip>

                  <!-- 筛选 -->
                  <el-tooltip effect="dark" content="创建测试任务" placement="bottom">
                    <el-button
                      icon="el-icon-zoom-in"
                      size="mini"
                      circle
                      type="info"
                      @click="dialogFormVisible = true,task(node, data)"
                    />
                  </el-tooltip>

                  <!-- 查看进度 -->
                  <el-tooltip effect="dark" content="查看用例执行进度" placement="top">
                    <el-popover
                      placement="bottom"
                      width="300"
                      trigger="click"
                      class="progress"
                    >
                      <div class="result">
                        <span> 当前测试进度： </span><br><br>
                        <span> 有效用例数： {{ valid_case }} </span><br>
                        <span> 用例执行率： {{ executed_percent }} </span><br>
                        <span> 执行通过率： {{ pass_percent }} </span><br>
                        <span> 执行失败率： {{ fail_percent }} </span><br>
                        <span> 执行阻塞率： {{ block_percent }} </span><br>
                      </div>
                      <el-button
                        slot="reference"
                        icon="el-icon-view"
                        size="mini"
                        circle
                        type="warning"
                        @click="result(node, data)"
                      />
                    </el-popover>
                  </el-tooltip>
                </span>
                <el-button slot="reference" icon="el-icon-more" size="medium" circle type="text" />
              </el-popover>

            </template>
          </div>
        </el-tree>
        <el-dialog title="创建测试任务" :visible.sync="dialogFormVisible" :append-to-body="true">
          <el-select
            v-model="caseNameId"
            multiple
            collapse-tags
            style="margin-left: 100px;"
            placeholder="请选择用例名称"
          >
            <el-option
              v-for="item in caseOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="caselabel"
            multiple
            collapse-tags
            style="margin-left: 25px;"
            placeholder="请选择标签名称"
          >
            <el-option
              v-for="item in tagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="levellabel"
            multiple
            collapse-tags
            style="margin-left: 25px;"
            placeholder="请选择用例级别"
          >
            <el-option
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false,submitData()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-drawer>

    <!-- xmind数据展示和编辑 -->
    <div class="minmap-data">
      <!-- 空数据页面 -->
      <div v-if="initJson == 'noData'" class="empty-box" align="center">
        <img class="empty" src="@/assets/empty/empty.gif">
        <br>
        <span>暂无数据 (待办：导出、导入)</span>
      </div>
      <!-- 存在数据页面 -->
      <div v-if="initJson != 'noData'" @click="disableDblclick">
        <!--
        :initJson="initJson"  // 初始化数据，加载脑图时自动更新。同时也会监听数据变化，数据一更新就重新加载
        ref="minderEditor"    // 组件应用名称
        :allowEditPriority="true"  // 是否允许增删改优先级，实时更新状态
        :allowEditLabel="true"     // 是否允许增删改标签，实时更新状态
        :allowEditResult="true"    // 是否允许增删改测试结果，实时更新状态
        :allowEditNode="true">     // 是否允许增删改节点内容，实时更新状态
      -->
        <VueTestcaseMinderEditor
          :initJson="initJson"
          :allowEditPriority="true"
          :allowEditLabel="true"
          :allowEditResult="true"
          :allowEditNode="true"
          ref="minderEditor"
        />
      </div>
      <div class="footer">
        <div class="button">
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
            <el-button v-show="initJson != 'noData'" slot="reference" type="danger" plain size="mini">页面异常关闭？点击恢复 >></el-button>
          </el-popover>
          <el-button v-if="initJson != 'noData'" id="submit" type="primary" size="medium" class="submit" @click="submit">保存</el-button>
          <el-button v-if="initJson != 'noData'" id="edit" type="primary" size="medium" class="edit" @click="edit">编辑</el-button>
          <el-button id="open" type="primary" size="medium" class="drawer" @click="drawer = true"> 打开目录 </el-button>
          <el-button v-if="initJson == 'noData' && name_id != '' && is_name !='1'" id="create" type="primary" size="medium" class="create" @click="create"> 创建用例 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addCaseName, caseNameTree, deleteCaseName, updateCaseName, addCase, caseData, caseNameList, caseTag, addCaseSprint, sprintCaseResult } from '@/api/case'
// todo
// 1. 只有最末端用例名称才能创建用例
export default {
  name: 'Tree',
  data() {
    return {
      drawer: false,
      isLoading: true, // 是否加载
      setTree: [], // tree数据
      NODE_KEY: 'id', // id对应字段
      NODE_ID_START: 0, // 新增节点id，逐次递减
      startId: '',
      name_id: '',
      case_name: '',
      defaultProps: {
        // 默认设置
        children: 'children',
        label: 'case_name'
      },
      initParam: {
        // 新增参数
        case_name: '新增节点',
        parent_id: 0,
        children: []
      },
      // dialogTableVisible: false,
      dialogFormVisible: false,
      caseOptions: '',
      tagOptions: '',
      levelOptions: [
        {
          value: "'priority': 1",
          label: 'P0'
        },
        {
          value: "'priority': 2",
          label: 'P1'
        },
        {
          value: "'priority': 3",
          label: 'P2'
        }
      ],
      caseNameId: [],
      caselabel: [],
      levellabel: [],
      nameId: '',
      Name: '',
      // 测试执行结果
      valid_case: '',
      executed_percent: '',
      pass_percent: '',
      fail_percent: '',
      block_percent: '',
      // 测试用例数据
      initJson: {
        root: ''
      },
      is_name: '',
      tag: '',
      visible: false
    }
  },
  created() {
    this.getList()
    this.getData()
  },
  methods: {
    // 用例目录相关方法
    // 获取用例名称列表数据
    getList() {
      this.isLoading = true
      caseNameTree().then((response) => {
        this.setTree = response.data.CaseNameTree
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
              deleteCaseName(data)
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
        'case_name': obj.case_name
      }
      // 修改节点
      updateCaseName(data)
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
        'case_name': obj.case_name,
        'parent_id': obj.parent_id
      }
      addCaseName(data).then(() => {
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
        'case_name': obj.case_name,
        'parent_id': 0
      }
      addCaseName(data).then(() => {
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
      document.getElementById('add-top').blur()
    },
    resetSprintData() {
      // 重置筛选测试用例弹窗中的用例名称下拉框
      this.caseNameId = ''
      this.levellabel = ''
      this.caselabel = ''
    },
    task(_node, _data) {
      // 点击筛选测试任务按钮
      this.resetSprintData()
      // 获取用例名称和名称id
      const obj = JSON.parse(JSON.stringify(_data))
      this.nameId = obj.id
      this.Name = obj.case_name
      // 获取用例名称列表
      caseNameList().then((response) => {
        this.caseOptions = response.data.CaseNamelist
      })
      // 获取用例tag列表
      caseTag().then((response) => {
        this.tagOptions = response.data.tag
      })
    },
    resetResultData() {
      this.valid_case = ''
      this.executed_percent = ''
      this.pass_percent = ''
      this.fail_percent = ''
      this.block_percent = ''
    },
    result(_node, _data) {
      const obj = JSON.parse(JSON.stringify(_data))
      this.nameId = obj.id
      this.Name = obj.case_name
      const data = {
        'case_name_id': this.nameId
      }
      sprintCaseResult(data).then((response) => {
        this.valid_case = response.data.result[0]
        this.executed_percent = response.data.result[1]
        this.pass_percent = response.data.result[2]
        this.fail_percent = response.data.result[3]
        this.block_percent = response.data.result[4]
      })
    },
    submitData() {
      // 提交筛选版本测试用例信息
      const data = {
        'submitCaseNameId': this.caseNameId,
        'submitCaselabel': this.caselabel,
        'levelLabel': this.levellabel,
        'nameId': this.nameId,
        'Name': this.Name
      }
      addCaseSprint(data).then(() => {
        this.$notify({
          title: '成功',
          message: '筛选成功',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        console.error(error)
      })
    },
    handleNode(_node, _data) {
      const obj = JSON.parse(JSON.stringify(_data))
      this.case_name = obj.case_name
      this.name_id = obj.id
      this.getData()
    },
    // xmind相关方法
    disableDblclick() {
      if (this.tag === '1') {
        alert('请先点击 编辑 按钮后进行操作')
      }
    },
    // 获取用例数据
    getData() {
      this.isLoading = true
      const data = {
        'case_name_id': this.name_id
      }
      caseData(data).then((response) => {
        this.initJson = response.data.initJson
        this.is_name = response.data.is_name
        this.isLoading = false
      })
      // 将tag的值置为0，开启禁止编辑模式
      this.tag = '1'
    },
    create() {
      this.initJson = {
        root: ''
      }
      document.getElementById('create').blur()
    },
    logCurrentData: function(event) {
      // 获取编辑器内容
      const caseJson = this.$refs.minderEditor.getJsonData()
      return caseJson
    },
    edit() {
      // 将tag的值置为0，解除禁止编辑模式
      this.tag = '0'
      // 设置定时器
      this.timer = setInterval(() => {
        const data = this.logCurrentData()
        // 将编辑器内容保存在本地
        localStorage.caseJson = JSON.stringify(data)
        localStorage.case_name = this.case_name
        localStorage.name_id = this.name_id
      }, 5000)
      this.$once('hook:beforeDestroy', () => {
        // 页面关闭时，销毁定时器
        clearInterval(this.timer)
        this.timer = null
      })
      document.getElementById('edit').blur()
    },
    submit() {
      // 提交测试用例数据
      const case_data = {
        'text': this.logCurrentData(),
        'case_name': this.case_name,
        'name_id': this.name_id
      }
      addCase(case_data).then(() => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
      document.getElementById('submit').blur()
      // 将tag的值置为0，开启禁止编辑模式
      this.tag = '1'
      // 清除定时器
      clearInterval(this.timer)
    },
    recover() {
      if (Number(localStorage.name_id) === Number(this.name_id)) {
        const case_data = {
          'text': JSON.parse(localStorage.caseJson),
          'case_name': localStorage.case_name,
          'name_id': localStorage.name_id
        }
        console.log(case_data)
        addCase(case_data).then(() => {
          this.initJson = JSON.parse(localStorage.caseJson)
          this.isLoading = false
          this.$notify({
            title: '成功',
            message: '用例恢复成功',
            type: 'success',
            duration: 2000
          })
        })
      } else {
        this.$message.error('该用例没有本地缓存')
      }
    },
    toggleEditMode: function(event) {
      this.editMode = !this.editMode
    }
  }
}
</script>

<style>
.show-btns{
  opacity: 1;
}
.comp-tree{
  max-height: 100vh;
  padding: 2em;
}
.comp-tr-top{
  width: 150px;
  font-weight: bold;
}
.more{
  margin-left: 50px;
  opacity: 0;
  transition: opacity .1s;
  opacity: 1;
}
.progress{
  margin-left: 10px;
}
.comp-tr-node--name{
  display: inline-block;
}
.is-new{
  line-height: 60px;
}
.comp-tr-node--btns{
  margin-left: 50px;
  opacity: 0;
  transition: opacity .1s;
  opacity: 1;
}
.el-button{
  transform: scale(0.8);
  margin-left: -1px;
}
.minmap-data {
  width: 100%;
  height: 100%;
  padding-bottom: var(--footer-height);
}
.drawer{
  float: right;
  margin-top: 3px;
}
.create {
  float: right;
  margin-top: 3px;
}
.edit {
  float: right;
  margin-top: 3px;
}
.submit {
  float: right;
  margin-top: 3px;
}
.result{
  margin-left: 30px;
}
.footer{
  position: fixed;
  bottom: 15px;
  width: 85%;
  line-height: var(--footer-height);
  color: #fff;
}
.empty{
  width: 400px;
  height: 400px;
  margin-top: 10px;
}
.empty-box{
  width: 100%;
  height: 100%;
  margin-top: 100px;
}
</style>
