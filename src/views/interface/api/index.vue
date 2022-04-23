<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="display: inline-block; color:#696969; font-weight:bold">接口名称：</div>
      <el-input v-model="listQuery.apiName" placeholder="请输入接口名" clearable style="width: 200px; margin-top: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <div style="display: inline-block; margin-left: 20px; color:#696969; font-weight:bold">项目名称：</div>
      <!-- 下拉搜索框 -->
      <el-select v-model="listQuery.projectName" placeholder="请选择项目名称" clearable style="width: 200px; margin-top: 15px;" class="filter-item" @change="getModule()">
        <el-option
          v-for="item in projectOptions"
          :key="item.projectName"
          :label="item.projectName"
          :value="item.projectName"
        />
      </el-select>
      <div style="display: inline-block; margin-left: 20px; color:#696969; font-weight:bold">模块名称：</div>
      <!-- 下拉搜索框 -->
      <el-select v-model="listQuery.moduleName" placeholder="请选择模块名称" clearable style="width: 200px; margin-top: 15px;" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option
          v-for="item in moduleOptions"
          :key="item.moduleName"
          :label="item.moduleName"
          :value="item.moduleName"
        />
      </el-select>
      <el-button id="select" v-waves class="filter-item" style="margin-left: 15px;" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button id="add" class="filter-item" style="margin-left: 25px" type="primary" @click="handleCreate">新增接口</el-button>
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

      <el-table-column :label="apiName" align="center">
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.apiName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="projectName" align="center">
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.projectName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="moduleName" align="center">
        <template v-if="row != null" slot-scope="{ row }">
          <span>{{ row.moduleName }}</span>
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
        width="260"
      >
        <template slot-scope="{ row, $index }">
          <el-button id="edit" type="primary" size="mini" style="margin-right: 10px" @click="handleEdit(row)">编辑</el-button>
          <el-button type="success" size="mini" style="margin-right: 10px" @click="handleUpdate(row)">调试</el-button>
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
  </div>
</template>

<script>

import { apiList, deleteApi } from '@/api/api_info'
import { projectList, moduleNameList } from '@/api/project'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ApiList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      id: '接口ID',
      apiName: '接口名称',
      projectName: '项目名称',
      moduleName: '模块名称',
      createTime: '创建时间',
      updateTime: '更新时间',
      createUser: '创建人',
      create_user: '创建人',
      update: '更新人',
      update_time: '更新时间',
      actions: '操作',
      tableKey: 0,
      projectOptions: [],
      moduleOptions: [],
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        apiName: '',
        moduleName: '',
        projectName: ''
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
    // 调用项目模块列表接口，获取项目模块名称
    getModule() {
      this.listQuery.moduleName = ''
      const data = {
        'projectName': this.listQuery.projectName
      }
      moduleNameList(data).then((response) => {
        this.moduleOptions = response.data.moduleNameList
      })
    },
    // 调用获取基础接口列表接口，获取基础接口列表信息
    getList() {
      this.listLoading = true
      apiList(this.listQuery).then((response) => {
        this.list = response.data.apiList
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
    handleCreate() {
      document.getElementById('add').blur()
      // 跳转新增页面
      const routeData = this.$router.resolve({ path: './add' })
      window.open(routeData.href, '_blank')
    },
    handleEdit(data) {
      // 跳转编辑页面，并传递接口参数
      document.getElementById('edit').blur()
      const routeData = this.$router.resolve({ 
        path: './edit',
        query: {
        apiInfo: JSON.stringify(data)
        }
      })
      window.open(routeData.href, '_blank')
    },
    handleDelete(row, index) {
      const api_id = {
        'id': index.id
      }
      deleteApi(api_id).then(() => {
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
