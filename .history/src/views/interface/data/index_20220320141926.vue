<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.data_name" placeholder="请输入参数名" clearable style="width: 200px; margin-top: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button id="select" v-waves class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 25px" type="primary" @click="handleCreate">添加参数</el-button>
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

      <el-table-column :label="data_name" align="center">
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.data_name }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="data_value" align="center">
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.data_value }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="create_user" align="center">
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.create_user }}</span>
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

      <el-table-column :label="update" align="center">
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.update_user }}</span>
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

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

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
          :label="data_name"
          prop="data_name"
          placeholder="请输入参数名称"
        >
          <el-input v-model="temp.data_name" />
        </el-form-item>
        <el-form-item
          :label="data_value"
          prop="data_value"
          placeholder="请输入参数值"
        >
          <el-input v-model="temp.data_value" type="textarea" />
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
import { addCaseData, updateCaseData, deleteCaseData, caseDataList, getCaseData } from '@/api/data'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'DataList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      authority: '',
      listLoading: true,
      // 默认请求参数
      listQuery: {
        page: 1,
        limit: 10,
        data_name: ''
      },
      id: '参数ID',
      data_name: '参数名称',
      data_value: '参数值',
      createTime: '创建时间',
      updateTime: '更新时间',
      create_user: '创建人',
      update: '更新人',
      update_time: '更新时间',
      actions: '操作',
      temp: {
        id: '',
        data_name: '',
        data_value: ''
      },
      dialogFormVisible: false,
      dialogstatus: '',
      textMap: {
        update: '编辑参数',
        create: '添加参数'
      },
      // 输入框规则校验
      rules: {
        data_name: [
          { required: true, message: '参数名称必填', trigger: 'blur' },
          { max: 30, message: '参数名称长度不能超过30位' }
        ],
        data_value: [
          { required: true, message: '参数值必填', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 调用获取参数列表接口，获取用户列表信息
    getList() {
      this.listLoading = true
      caseDataList(this.listQuery).then((response) => {
        this.list = response.data.dataList
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      // 查询参数
      this.listQuery.page = 1
      this.getList()
      document.getElementById('select').blur()
    },
    resetTemp() {
      this.temp = {
        id: '',
        data_name: '',
        data_value: ''
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
    // 新增参数
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          addCaseData(tempData).then(() => {
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

    // 编辑参数信息
    handleUpdate(row) {
      // 编辑弹窗信息回显
      this.temp = Object.assign({}, row) // copy obj
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
          updateCaseData(tempData).then(() => {
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
    // 删除参数信息
    handleDelete(row, index) {
      const data_name = { data_name: index.data_name }
      deleteCaseData(data_name).then(() => {
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

<style>
.empty{
  width: 400px;
  height: 400px;
  margin-top: 100px;
}
</style>
