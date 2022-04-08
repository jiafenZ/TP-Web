<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="display: inline-block; color:#696969; font-weight:bold">配置名称：</div>
      <el-input v-model="listQuery.configName" placeholder="请输入配置名称" clearable style="width: 200px; margin-top: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <div style="display: inline-block; margin-left: 20px; color:#696969; font-weight:bold">项目名称：</div>
      <!-- 下拉搜索框 -->
      <el-select v-model="listQuery.projectName" placeholder="请选择项目名称" clearable style="width: 200px; margin-top: 15px;" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option
          v-for="item in projectOptions"
          :key="item.projectName"
          :label="item.projectName"
          :value="item.projectName"
        />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 15px;" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 15px" type="primary" @click="handleCreate">新增配置</el-button>
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
        width="100"
      >
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="configName" align="center">
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.configName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="projectName" align="center">
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.projectName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="environment" align="center">
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.environment }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="base_url" align="center">
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.base_url }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="createTime" align="center" width="100">
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

      <el-table-column :label="updateTime" align="center" width="100">
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
        width="150"
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

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 新增&编辑弹窗 -->
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
          :label="configName"
          prop="configName"
          placeholder="请输入配置名称"
        >
          <el-input v-model="temp.configName" />
        </el-form-item>

        <el-form-item
          :label="base_url"
          prop="base_url"
          placeholder="请输入base_url"
        >
          <el-input v-model="temp.base_url" />
        </el-form-item>

        <el-form-item :label="projectName" prop="projectName">
          <el-select
            v-model="temp.projectName"
            class="filter-item"
            placeholder="请选择项目名称"
          >
            <el-option
              v-for="item in projectOptions"
              :key="item.projectName"
              :label="item.projectName"
              :value="item.projectName + '/' + item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="environment" prop="environment">
          <el-select
            v-model="temp.environment"
            class="filter-item"
            placeholder="请选择运行环境"
          >
            <el-option
              v-for="item in environmentOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
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
import { projectList, addUrl, urlList, updateUrl, deleteUrl } from '@/api/project'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'UrlList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      projectOptions: [],
      environmentOptions: ['test', 'release', 'develop'],
      total: 0,
      listLoading: true,
      // 默认请求参数
      listQuery: {
        page: 1,
        limit: 10,
        configName: '',
        projectName: ''
      },
      id: '配置ID',
      configName: '配置名称',
      projectName: '项目名称',
      environment: '运行环境',
      base_url: 'base URL',
      createTime: '创建时间',
      createUser: '创建人',
      updateTime: '更新时间',
      update: '更新人',
      update_time: '更新时间',
      actions: '操作',
      update_user: '更新人',

      temp: {
        id: '',
        configName: '',
        projectName: '',
        environment: '',
        base_url: ''
      },
      dialogFormVisible: false,
      dialogstatus: '',
      textMap: {
        update: '编辑baseURL配置信息',
        create: '新增baseURL配置信息'
      },
      // 输入框规则校验
      rules: {
        configName: [
          { required: true, message: '配置名称必填', trigger: 'blur' },
          { max: 30, message: '配置名称长度不能超过30位' }
        ],
        projectName: [
          { required: true, message: '请选择项目名称', trigger: 'change' }
        ],
        environment: [
          { required: true, message: '请选择运行环境', trigger: 'change' }
        ],
        base_url: [
          { required: true, message: '连接地址必填', trigger: 'blur' },
          { max: 120, message: '连接地址长度不能超过120位' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getProject()
  },
  methods: {
    // 调用项目列表接口，获取项目名称
    getProject() {
      projectList().then((response) => {
        this.projectOptions = response.data.projectList
      })
    },
    // 调用数据库配置列表接口，获取数据库配置信息列表
    getList() {
      this.listLoading = true
      urlList(this.listQuery).then((response) => {
        this.list = response.data.UrlList
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: '',
        configName: '',
        projectName: '',
        environment: '',
        base_url: ''
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

    // 新增数据库配置信息
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          addUrl(tempData).then(() => {
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

    // 编辑数据库配置信息
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
          updateUrl(tempData).then(() => {
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
    // 删除数据库配置信息
    handleDelete(row, index) {
      const configName = { configName: index.configName }
      deleteUrl(configName).then(() => {
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
