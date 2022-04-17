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
        style="margin-left: 50px;"
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
              <el-select v-model="listQuery.projectName" placeholder="请选择项目名称" clearable style="width: 54%;" class="filter-item" @change="getModule()">
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
              <el-select v-model="listQuery.moduleName" placeholder="请选择模块名称" clearable style="width: 54%;" class="filter-item" @keyup.enter.native="handleFilter">
                <el-option
                  v-for="item in moduleOptions"
                  :key="item.moduleName"
                  :label="item.moduleName"
                  :value="item.moduleName"
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
          <div v-for="(item,i) in studentList" :key="item.content">
                <el-form-item label="前置参数 :" prop="dataType" style="width: 50%;display: inline-block;">
                  <el-input v-model="studentList[i].dataType" clearable placeholder="请选择参数类型" />
                </el-form-item>
                <el-form-item prop="dataName" style="width: 50%;display: inline-block;margin-left: -80px">
                  <el-input v-model="studentList[i].dataName" clearable placeholder="请输入参数名称" />
                </el-form-item>
                <el-button class="el-icon-plus" type="text" style="margin-left: 10px" @click="addList()" />
                <el-button v-if="i>0" class="el-icon-minus" type="text" @click="subList(i)" />
              </div>
        </el-col>

      </el-form>
    </el-card>
  </div>
</template>

<script>
import { projectList, moduleNameList } from '@/api/project'
export default {
  name: 'Add',
  data() {
    return {
      visi: false,
      apiName: '接口名称',
      projectName: '项目名称',
      moduleName: '模块名称',
      path: '请求路径',
      dataType: '前置参数类型',
      dataName: '前置参数名称',
      headers: '请求头',
      debugHeaders: '调试请求头',
      body: 'body',
      debugBody: '调试body',
      projectOptions: [],
      moduleOptions: [],
      temp: {
        id: '',
        apiName: '',
        projectName: ''
      },
      // 输入框规则校验
      rules: {
        apiName: [
          { required: true, message: '接口名称必填', trigger: 'blur' },
          { max: 30, message: '接口名称长度不能超过30位' }
        ],
        projectName: [
          { required: true, message: '项目名称必填', trigger: 'blur' },
          { max: 30, message: '项目名称长度不能超过30位' }
        ],
        moduleName: [
          { required: true, message: '模块名称必填', trigger: 'blur' },
          { max: 30, message: '模块名称长度不能超过30位' }
        ],
        path: [
          { required: true, message: '请求路径必填', trigger: 'blur' }
        ]
      },
      studentList: [
        { name: '', age: '' }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        apiName: '',
        moduleName: '',
        projectName: ''
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
      this.listQuery.moduleName = ''
      const data = {
        'projectName': this.listQuery.projectName
      }
      moduleNameList(data).then((response) => {
        this.moduleOptions = response.data.moduleNameList
      })
    },
    show() {
      this.visi = true
    },
    // 加号
    addList() {
      this.studentList.push({ name: '', age: '' })
    },
    // 减号
    subList(index) {
      this.studentList.splice(index, 1)
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
.el-card__body{
  height: 100%;
} 
.el-col {
  height: 100%;
}
.el-form {
  height: 90%;
} 
.verticalBar {
  width: 1px;
  height: 600px;
  background: #D3D3D3;
  display: inline-block;
  margin-top: 31px;
  vertical-align: top;
  margin-right: 10px;
  margin-left: 50px;
}
</style>