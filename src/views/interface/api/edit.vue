<template>
  <div class="app-container">
    <el-card  class="container-card">
      <h3 class="title">编辑基础接口</h3>
      <el-button id="debug" class="button-debug" type="success" @click="debug()">调试</el-button>
      <el-button id="update" class="button-update" type="primary" @click="update()">保存</el-button>
      <el-divider style="margin-top: 3px;" />
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
      >
        <el-col :span="12">
          <div class="base-info">
            <el-form-item
              :label="apiName"
              prop="apiName"
              placeholder="请输入接口名称"
              style="width: 60%;"
              >
              <el-input v-model="temp.apiName" />
            </el-form-item>

            <el-form-item
              :label="projectName"
              prop="projectName"
              placeholder="请选择项目名称"
            >
              <!-- 下拉搜索框 -->
              <el-select v-model="temp.projectName" placeholder="请选择项目名称" clearable style="width: 54%;" class="filter-item" @change="getModule()">
                <el-option
                  v-for="item in projectOptions"
                  :key="item.projectName"
                  :label="item.projectName"
                  :value="item.projectName"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              :label="moduleName"
              prop="moduleName"
              placeholder="请选择模块名称"
            >
              <!-- 下拉搜索框 -->
              <el-select v-model="temp.moduleName" placeholder="请选择模块名称" clearable style="width: 54%;" class="filter-item" @keyup.enter.native="handleFilter">
                <el-option
                  v-for="item in moduleOptions"
                  :key="item.moduleName"
                  :label="item.moduleName"
                  :value="item.moduleName"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              :label="method"
              prop="method"
              placeholder="请选择请求方法"
            >
              <!-- 下拉搜索框 -->
              <el-select v-model="temp.method" placeholder="请选择请求方法" clearable style="width: 54%;" class="filter-item" @keyup.enter.native="handleFilter">
                <el-option
                  v-for="item in methodOptions"
                  :key="item.method"
                  :label="item.method"
                  :value="item.method"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              :label="path"
              prop="path"
              placeholder="请输入请求路径"
              style="width: 60%;"
            >
              <el-input v-model="temp.path" />
            </el-form-item>

            <el-form-item
              :label="headers"
              prop="headers"
              placeholder="请输入请求头"
            >
              <el-input v-model="temp.headers" type="textarea" />
            </el-form-item>

            <el-form-item
              :label="debug_headers"
              prop="debug_headers"
              placeholder="请输入调试请求头"
            >
              <el-input v-model="temp.debug_headers" type="textarea" />
            </el-form-item>

            <el-form-item
              :label="body"
              prop="body"
              placeholder="请输入body"
            >
              <el-input v-model="temp.body" type="textarea" />
            </el-form-item>

            <el-form-item
              :label="debug_body"
              prop="debug_body"
              placeholder="请输入调试body"
            >
              <el-input v-model="temp.debug_body" type="textarea" />
            </el-form-item>
          </div>
        </el-col>

        <el-col :span="2">
          <div class="verticalBar" />
        </el-col>

        <el-col :span="8">
          <div class="parameter-info">
            <div v-for="(item,i) in temp.pre_parameter" :key="i + 'parameterType'">
              <el-form-item label="前置参数 :" prop="parameterType" style="display: inline-block;">
                <!-- 下拉搜索框 -->
              <el-select v-model="temp.pre_parameter[i].parameterType" placeholder="请选择参数类型" clearable style="width: 80%;">
                <el-option
                  v-for="items in parameterTypeOptions"
                  :key="items.typeName"
                  :label="items.typeName"
                  :value="items.typeName"
                />
              </el-select>
              </el-form-item>
              <el-form-item prop="parameterName" style="width: 60%;margin-left: -130px;display: inline-block;">
                <el-input v-model="temp.pre_parameter[i].parameterName" clearable placeholder="请输入前置参数名称" />
              </el-form-item>
              <el-button class="el-icon-plus" type="text" style="margin-left: 10px" @click="preParameterAddList()" />
              <el-button v-if="i>0" class="el-icon-minus" type="text" @click="preParameterSubList(i)" />
            </div>

            <div v-for="(item,i) in temp.after_parameter" :key="i + 'dataName'">
              <el-form-item label="参数提取 :" prop="after_parameter" style="width: 88%;display: inline-block;">
                <el-input v-model="temp.after_parameter[i].dataName" clearable placeholder="请输入提取参数名称" />
              </el-form-item>
              <el-button class="el-icon-plus" type="text" style="margin-left: 10px" @click="afterParameterAddList()" />
              <el-button v-if="i>0" class="el-icon-minus" type="text" @click="afterParameterSubList(i)" />
            </div>

            <div v-for="(item,i) in temp.assert_parameter" :key="i + 'item.value'">
              <el-form-item label="响应断言 :" prop="assert_parameter" style="width: 88%;">
                <el-input v-model="temp.assert_parameter[i].name" clearable placeholder="请输入参数名称" />
              </el-form-item>
              <el-form-item prop="assertValue" style="width: 88%;display: inline-block;">
                <el-input v-model="temp.assert_parameter[i].value" type="textarea" clearable placeholder="请输入预期值" />
              </el-form-item>
              <el-button class="el-icon-plus" type="text" style="margin-left: 10px" @click="assertParameterAddList()" />
              <el-button v-if="i>0" class="el-icon-minus" type="text" @click="assertParameterSubList(i)" />
            </div>

            <div v-for="(item,i) in temp.assert_sql" :key="i + 'item.sql'">
              <el-form-item label="数据库断言" prop="assert_sql" style="width: 88%;">
                <el-input v-model="temp.assert_sql[i].sql" type="textarea" clearable placeholder="请输入执行SQL" />
              </el-form-item>
              <el-form-item prop="sqlValue" style="width: 88%;display: inline-block;">
                <el-input v-model="temp.assert_sql[i].value" clearable placeholder="请输入预期值" />
              </el-form-item>
              <el-button class="el-icon-plus" type="text" style="margin-left: 10px" @click="sqlParameterAddList()" />
              <el-button v-if="i>0" class="el-icon-minus" type="text" @click="sqlParameterSubList(i)" />
            </div>
          </div>
        </el-col>

      </el-form>
    </el-card>
  </div>
</template>

<script>
import { projectList, moduleNameList } from '@/api/project'
import { updateApi } from '@/api/api_info'
import { title } from '@/settings'
export default {
  name: 'Add',
  data() {
    return {
      visi: false,
      apiName: '接口名称',
      projectName: '项目名称',
      moduleName: '模块名称',
      projectOptions: [],
      moduleOptions: [],
      methodOptions: [{method: 'POST'}, {method: 'GET'}],
      method: '请求方法',
      path: '请求路径',
      headers: '请求头',
      debug_headers: '调试请求头',
      body: 'body',
      debug_body: '调试body',
      parameterType: '前置参数类型',
      parameterTypeOptions: [{typeName: '系统配置参数'}, {typeName: '接口返回参数'}],
      parameterName: '前置参数名称',
      after_parameter: '参数提取',
      assert_parameter: '响应断言',
      assertValue: '响应预期断言值',
      assert_sql: '数据库断言',
      sqlValue: 'sql预期断言值',
      temp: {
        id: '',
        apiName: '',
        projectName: '',
        moduleName: '',
        method: '',
        path: '',
        headers: '',
        debug_headers: '',
        body: '',
        debug_body: '',
        pre_parameter: [
          { parameterType: '', 
            parameterName: '' 
          }
        ],
        after_parameter: [
          {
            dataName: ''
          }
        ],
        assert_parameter: [
          {
            name: '',
            value : ''
          }
        ],
        assert_sql: [
          {
            sql: '',
            value : ''
          }
        ]
      },
      // 输入框规则校验
      rules: {
        apiName: [
          { required: true, message: '接口名称必填', trigger: 'blur' },
          { max: 30, message: '接口名称长度不能超过30位' }
        ],
        projectName: [
          { required: true, message: '请选择项目名称', trigger: 'blur' },
        ],
        moduleName: [
          { required: true, message: '请选择模块名称', trigger: 'blur' },
        ],
        path: [
          { required: true, message: '请求路径必填', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请选择请求方法', trigger: 'blur' }
        ]
      }
    }
  },
  show() {
    this.visi = true
  },
  created() {
    this.getApiInfo()
    this.getProject()
  },
  methods: {
    // 获取接口信息
    getApiInfo() {
      const data = this.$route.query.apiInfo
      const json_data = JSON.parse(data)

      // 将pre_parameter字符串转换成包含json的数组格式
      const jsonPreParameter = json_data.pre_parameter.split('},{')
      const preParameterLen = jsonPreParameter.length
      const listPreParameter = []
      jsonPreParameter.map(function(item, index, array) {
        if (preParameterLen == 0) {
          listPreParameter = []
        }else if (preParameterLen == 1) {
          const preData = item.slice(1)
          const newData = preData.substring(0, preData.length - 1)
          listPreParameter.push(JSON.parse(newData))
        }else if (index == 0) {
          listPreParameter.push(JSON.parse(item.slice(1) + '}'))
        }else if (index == preParameterLen-1){
          listPreParameter.push(JSON.parse('{' + item.substring(0, item.length - 1)))
        }else {
          listPreParameter.push(JSON.parse('{' + item + '}'))
        }
      })

      // 将after_parameter字符串转换成包含json的数组格式
      const jsonAfterParameter = json_data.after_parameter.split('},{')
      const AfterParameterLen = jsonAfterParameter.length
      const listAfterParameter = []
      jsonAfterParameter.map(function(item, index, array) {
        if (preParameterLen == 0) {
          listAfterParameter = []
        }else if (AfterParameterLen == 1) {
          const preData = item.slice(1)
          const newData = preData.substring(0, preData.length - 1)
          listAfterParameter.push(JSON.parse(newData))
        }else if (index == 0) {
          listAfterParameter.push(JSON.parse(item.slice(1) + '}'))
        }else if (index == AfterParameterLen-1){
          listAfterParameter.push(JSON.parse('{' + item.substring(0, item.length - 1)))
        }else {
          listAfterParameter.push(JSON.parse('{' + item + '}'))
        }
      })

      // 将after_parameter字符串转换成包含json的数组格式
      const jsonAssertParameter = json_data.assert_parameter.split('},{')
      const AssertParameterLen = jsonAssertParameter.length
      const listAssertParameter = []
      jsonAssertParameter.map(function(item, index, array) {
        if (preParameterLen == 0) {
          listAssertParameter = []
        }else if (AssertParameterLen == 1) {
          const preData = item.slice(1)
          const newData = preData.substring(0, preData.length - 1)
          listAssertParameter.push(JSON.parse(newData))
        }else if (index == 0) {
          listAssertParameter.push(JSON.parse(item.slice(1) + '}'))
        }else if (index == AssertParameterLen-1){
          listAssertParameter.push(JSON.parse('{' + item.substring(0, item.length - 1)))
        }else {
          listAssertParameter.push(JSON.parse('{' + item + '}'))
        }
      })

      // 将after_parameter字符串转换成包含json的数组格式
      const jsonAssertSql = json_data.assert_sql.split('},{')
      const AssertSqlLen = jsonAssertSql.length
      const listAssertSql = []
      jsonAssertSql.map(function(item, index, array) {
        if (preParameterLen == 0) {
          listAssertSql = []
        }else if (AssertSqlLen == 1) {
          const preData = item.slice(1)
          const newData = preData.substring(0, preData.length - 1)
          listAssertSql.push(JSON.parse(newData))
        }else if (index == 0) {
          listAssertSql.push(JSON.parse(item.slice(1) + '}'))
        }else if (index == AssertSqlLen-1){
          listAssertSql.push(JSON.parse('{' + item.substring(0, item.length - 1)))
        }else {
          listAssertSql.push(JSON.parse('{' + item + '}'))
        }
      })

      const api_data = {
        'id': json_data.id,
        'apiName': json_data.apiName,
        'projectName': json_data.projectName,
        'moduleName': json_data.moduleName,
        'method': json_data.method,
        'path': json_data.path,
        'headers': json_data.headers,
        'debug_headers': json_data.debug_headers,
        'body': json_data.body,
        'debug_body': json_data.debug_body,
        'pre_parameter': listPreParameter,
        'after_parameter': listAfterParameter,
        'assert_parameter': listAssertParameter,
        'assert_sql': listAssertSql
      }
      this.temp = api_data
    },
    // 调用项目列表接口，获取项目名称
    getProject() {
      projectList().then((response) => {
        this.projectOptions = response.data.projectList
      })
    },
    // 调用项目模块列表接口，获取项目模块名称
    getModule() {
      this.temp.moduleName = ''
      const data = {
        'projectName': this.temp.projectName
      }
      moduleNameList(data).then((response) => {
        this.moduleOptions = response.data.moduleNameList
      })
    },
    show() {
      this.visi = true
    },
    // 前置参数加号
    preParameterAddList() {
      this.temp.pre_parameter.push({ parameterType: '', parameterName: '' })
    },
    // 前置参数减号
    preParameterSubList(index) {
      this.temp.pre_parameter.splice(index, 1)
    },
    // 参数提取加号
    afterParameterAddList() {
      this.temp.after_parameter.push({ dataName: '' })
    },
    // 参数提取减号
    afterParameterSubList(index) {
      this.temp.after_parameter.splice(index, 1)
    },
    // 响应断言加号
    assertParameterAddList() {
      this.temp.assert_parameter.push({ name: '', value : '' })
    },
    // 响应断言减号
    assertParameterSubList(index) {
      this.temp.assert_parameter.splice(index, 1)
    },
    // 响应断言加号
    sqlParameterAddList() {
      this.temp.assert_sql.push({ sql: '', value : '' })
    },
    // 响应断言减号
    sqlParameterSubList(index) {
      this.temp.assert_sql.splice(index, 1)
    },
    update() {
      const api_data = {
        'id': this.temp.id,
        'apiName': this.temp.apiName,
        'projectName': this.temp.projectName,
        'moduleName': this.temp.moduleName,
        'method': this.temp.method,
        'path': this.temp.path,
        'headers': this.temp.headers,
        'debug_headers': this.temp.debug_headers,
        'body': this.temp.body,
        'debug_body': this.temp.debug_body,
        'pre_parameter': JSON.stringify(this.temp.pre_parameter),
        'after_parameter': JSON.stringify(this.temp.after_parameter),
        'assert_parameter': JSON.stringify(this.temp.assert_parameter),
        'assert_sql': JSON.stringify(this.temp.assert_sql)
      }
      updateApi(api_data).then( () => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        document.getElementById('update').blur()
      })
    }
  }
}
</script>

<style>
.app-container {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  display: flex;
  background-color: #f5f5f5;
}
.container-card {
  height: 100%;
  width: 100%;
}
.title {
  margin-left: 15px;
  margin-top: 5px;
  display: inline-block;
}
.button-debug {
  float: right;
  margin-left: 15px;
  display: inline-block;
}
.button-update {
  float: right;
  display: inline-block;
}
.el-divider--horizontal {
  margin-top: 8px;
}
.base-info {
  height: 100%;
  width: 100%;
  overflow-y: auto;
}
.el-col-12 {
  width: 50%;
  margin-left: 20px;
}
.el-card__body{
  height: 100%;
} 
.el-col {
  height: 100%;
}
.el-col-2 {
  width: 30px;
}
.el-col-8 {
  width: 40%;
}
.el-form {
  height: 90%;
} 
.parameter-info {
  height: 100%;
  width: 100%;
  margin-left: 20px;
  overflow-y: auto;
}
.verticalBar {
  width: 1px;
  height: 600px;
  background: #D3D3D3;
  display: inline-block;
  margin-top: 5px;
  vertical-align: top;
  margin-left: 20px;
}
</style>