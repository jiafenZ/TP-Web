<template>
  <div class="app-container">
    <div v-if="authority == 1">
      <div class="filter-container">
        <el-input v-model="listQuery.userName" placeholder="请输入参数名" clearable style="width: 200px; margin-top: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
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

        <el-table-column :label="userName" align="center">
          <template v-if="row != null" slot-scope="{ row }">
            <span>{{ row.userName }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="realName" align="center">
          <template v-if="row != null" slot-scope="{ row }">
            <span>{{ row.realName }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="phone" align="center">
          <template v-if="row != null" slot-scope="{ row }">
            <span>{{ row.phone }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="roles" align="center">
          <template v-if="row != null" slot-scope="{ row }">
            <span>{{ row.roles }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="status" align="center">
          <template v-if="row != null" slot-scope="{ row }">
            <span>{{ row.status }}</span>
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

        <el-table-column :label="lastLoginTime" align="center">
          <template slot-scope="{ row }">
            <span v-if="row.lastLogin_time != null">{{
              row.lastLogin_time
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
            :label="userName"
            prop="userName"
            placeholder="请输入账号"
          >
            <el-input v-model="temp.userName" />
          </el-form-item>
          <el-form-item
            :label="password"
            prop="password"
            placeholder="请输入密码"
          >
            <el-input v-model="temp.password" />
          </el-form-item>
          <el-form-item
            :label="realName"
            prop="realName"
            placeholder="请输入真名"
          >
            <el-input v-model="temp.realName" />
          </el-form-item>
          <el-form-item :label="phone" prop="phone" placeholder="请输入手机号">
            <el-input v-model="temp.phone" />
          </el-form-item>
          <el-form-item :label="roles" prop="roles">
            <el-select
              v-model="temp.roles"
              class="filter-item"
              placeholder="请选择角色"
            >
              <el-option
                v-for="item in rolesOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="status" prop="status">
            <el-select
              v-model="temp.status"
              class="filter-item"
              placeholder="请选择状态"
            >
              <el-option
                v-for="item in statusOptions"
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
    <div v-if="authority == 2" align="center">
      <img class="empty" src="@/assets/empty/user.jpg">
      <br>
      <span style="text-align: center;"> 抱歉！ 您没有访问权限！ </span>
    </div>
  </div>
</template>

<script>
import { userList, addUser, updateUser, deleteUser } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'UserList',
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
        userName: ''
      },
      id: '用户ID',
      userName: '登录账号',
      realName: '真实姓名',
      phone: '手机号码',
      roles: '账号角色',
      status: '账号状态',
      createTime: '创建时间',
      updateTime: '更新时间',
      lastLoginTime: '最后登录时间',
      update: '更新人',
      update_time: '更新时间',
      actions: '操作',
      password: '_登录密码',
      lastLogin_time: '最后登录时间',
      update_user: '更新人',

      statusOptions: ['启用', '禁用'],
      rolesOptions: ['admin', 'editor'],
      temp: {
        id: '',
        userName: '',
        password: '',
        realName: '',
        phone: '',
        status: '启用',
        roles: 'editor'
      },
      dialogFormVisible: false,
      dialogstatus: '',
      textMap: {
        update: '编辑用户',
        create: '添加用户'
      },
      // 输入框规则校验
      rules: {
        userName: [
          { required: true, message: '账号名称必填', trigger: 'blur' },
          { max: 30, message: '账号名称长度不能超过30位' }
        ],
        password: [
          { required: false, message: '登录密码必填', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度必须为6-18位' },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,18}$/,
            message: '密码必须是“字母+数字”的形式',
            trigger: 'blur'
          }
        ],
        realName: [
          { required: true, message: '真实姓名必填', trigger: 'blur' },
          { max: 15, message: '真实姓氏长度不能超过15位' }
        ],
        phone: [
          { required: true, message: '手机号不能为空' },
          {
            type: 'number',
            message: '手机号格式不正确',
            trigger: 'blur',
            transform(value) {
              var phonereg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
              if (!phonereg.test(value)) {
                return false
              } else {
                return Number(value)
              }
            }
          }
        ],
        // 下拉框规则校验
        status: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        roles: [{ required: true, message: '请选择角色', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 调用用户列表接口，获取用户列表信息
    getList() {
      this.listLoading = true
      userList(this.listQuery).then((response) => {
        this.authority = response.data.authority
        this.list = response.data.userList
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      // 查询用户
      this.listQuery.page = 1
      this.getList()
      document.getElementById('select').blur()
    },
    resetTemp() {
      this.temp = {
        id: '',
        userName: '',
        password: '',
        realName: '',
        phone: '',
        status: '启用',
        roles: 'editor'
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
    // 新增用户
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          addUser(tempData).then(() => {
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

    // 编辑用户信息
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
          updateUser(tempData).then(() => {
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
    // 删除用户信息
    handleDelete(row, index) {
      const userName = { userName: index.userName }
      deleteUser(userName).then(() => {
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
