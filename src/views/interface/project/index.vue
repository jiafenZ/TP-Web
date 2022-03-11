<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 25px" type="primary" @click="handleCreate">新增项目</el-button>
    </div>
    <br><br>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        :label="id"
        prop="id"
        align="center"
        width="120"
      >
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="projectName" align="center">
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.projectName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="describe" align="center">
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.describe }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="createTime" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.create_time != null">{{
            row.create_time
              .toString()
              .replace("T", " ")
              .replace("Z", "")
              .substring(0, 19)
          }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="createUser" align="center">
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.create_user }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="updateTime" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.update_time != null">{{
            row.update_time
              .toString()
              .replace("T", " ")
              .replace("Z", "")
              .substring(0, 19)
          }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="update" align="center">
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.update_user }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="actions"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" style="margin-right: 10px" @click="handleUpdate(row)">编辑</el-button>
          <el-popover v-model="row.visible" placement="top" width="200">
            <p>确定删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button type="text" @click="row.visible = false">取消</el-button>
              <el-button type="text" @click="handleDelete($index, row)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    /> -->

    <el-dialog
      :title="textMap[dialogstatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item
          :label="projectName"
          prop="projectName"
          placeholder="请输入项目名称"
        >
          <el-input v-model="temp.projectName" />
        </el-form-item>
        <el-form-item
          :label="describe"
          prop="describe"
          placeholder="请输入项目描述"
        >
          <el-input v-model="temp.describe" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogstatus === 'create' ? createData() : updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addProject, projectList, updateProject, deleteProject } from '@/api/project'
import waves from '@/directive/waves' // waves directive
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ProjectList',
  // components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      // total: 0,
      listLoading: true,
      // 默认请求参数
      listQuery: {
        // page: 1,
        // limit: 10,
        // projectName: ''
      },
      id: '项目ID',
      projectName: '项目名称',
      describe: '项目描述',
      createTime: '创建时间',
      createUser: '创建人',
      updateTime: '更新时间',
      update: '更新人',
      update_time: '更新时间',
      actions: '操作',
      update_user: '更新人',

      temp: {
        id: '',
        projectName: '',
        describe: ''
      },
      dialogFormVisible: false,
      dialogstatus: '',
      textMap: {
        update: '编辑项目信息',
        create: '新增项目信息'
      },
      // 输入框规则校验
      rules: {
        projectName: [
          { required: true, message: '项目名称必填', trigger: 'blur' },
          { max: 30, message: '项目名称长度不能超过30位' }
        ],
        describe: [
          { max: 120, message: '项目描述输入长度不能超过120个字符' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 调用项目信息列表接口，获取项目信息列表
    getList() {
      this.listLoading = true
      projectList(this.listQuery).then((response) => {
        this.list = response.data.projectList
        // this.total = response.data.total
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: '',
        projectName: '',
        describe: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogstatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增项目
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          addProject(tempData).then(() => {
            this.list.unshift(this.temp)
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 编辑项目信息
    handleUpdate(row) {
      // 编辑弹窗信息回显
      this.temp = Object.assign({}, row) // copy obj
      this.temp.password = ''
      this.dialogstatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateProject(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除项目信息
    handleDelete(row, index) {
      const projectName = { projectName: index.projectName }
      deleteProject(projectName).then(() => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    }
  }
}
</script>
