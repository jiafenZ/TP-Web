<template>
  <div class="app-container">
    <el-card  class="container-card">
      <h3 class="title">新增基础接口</h3>
      <el-button id="debug" class="button-debug" type="success" @click="debug()">调试</el-button>
      <el-button id="submit" class="button-submit" type="primary" @click="submit()">保存</el-button>
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
              :label="debugHeaders"
              prop="debugHeaders"
              placeholder="请输入调试请求头"
            >
              <el-input v-model="temp.debugHeaders" type="textarea" />
            </el-form-item>

            <el-form-item
              :label="body"
              prop="body"
              placeholder="请输入body"
            >
              <el-input v-model="temp.body" type="textarea" />
            </el-form-item>

            <el-form-item
              :label="debugBody"
              prop="debugBody"
              placeholder="请输入调试body"
            >
              <el-input v-model="temp.debugBody" type="textarea" />
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
import { addApi } from '@/api/api_info'
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
      debugHeaders: '调试请求头',
      body: 'body',
      debugBody: '调试body',
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
        debugHeaders: '',
        body: '',
        debugBody: '',
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
    submit() {
      console.log(this.temp)
      addApi(this.temp).then( () => {
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
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
.button-submit {
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
  margin-top: 31px;
  vertical-align: top;
  margin-left: 20px;
}
</style>