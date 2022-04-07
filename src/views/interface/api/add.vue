<template>
  <div class="app-container">
    <el-card class="container-card">

      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <h3 style="margin-left: 15px;">新增基础接口</h3>
          <el-divider />
          <div class="add-area">
            <el-form
              ref="dataForm"
              :rules="rules"
              :model="temp"
              label-position="left"
              label-width="90px"
              style="margin-left: 50px;"
            >

              <el-form-item
                :label="apiName"
                prop="apiName"
                placeholder="请输入接口名称"
                style="width: 320px;display: inline-block;"
              >
                <el-input v-model="temp.apiName" />
              </el-form-item>

              <el-form-item
                :label="projectName"
                prop="projectName"
                placeholder="请选择项目名称"
                style="width: 320px;display: inline-block;margin-left: 80px"
              >
                <el-input v-model="temp.projectName" />
              </el-form-item>

              <el-form-item
                :label="moduleName"
                prop="moduleName"
                placeholder="请选择模块名称"
                style="width: 320px;display: inline-block;"
              >
                <el-input v-model="temp.moduleName" />
              </el-form-item>

              <el-form-item
                :label="path"
                prop="path"
                placeholder="请输入请求路径"
                style="width: 320px;display: inline-block;margin-left: 80px"
              >
                <el-input v-model="temp.path" />
              </el-form-item>

              <div v-for="(item,i) in studentList">
                <el-form-item label="前置参数 :" prop="dataType" style="width: 50%;display: inline-block;">
                  <el-input v-model="studentList[i].dataType" clearable placeholder="请选择参数类型" />
                </el-form-item>
                <el-form-item prop="dataName" style="width: 50%;display: inline-block;margin-left: -80px">
                  <el-input v-model="studentList[i].dataName" clearable placeholder="请输入参数名称" />
                </el-form-item>
                <el-button class="el-icon-plus" type="text" style="margin-left: 10px" @click="addList()" />
                <el-button v-if="i>0" class="el-icon-minus" type="text" @click="subList(i)" />
              </div>

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

              <div v-for="(item,i) in studentList">
                <el-form-item label="参数提取 :" prop="dataType" style="width: 50%;display: inline-block;">
                  <el-input v-model="studentList[i].dataType" clearable placeholder="请输入参数名称" />
                </el-form-item>
                <el-button class="el-icon-plus" type="text" style="margin-left: 10px" @click="addList()" />
                <el-button v-if="i>0" class="el-icon-minus" type="text" @click="subList(i)" />
              </div>

              <div v-for="(item,i) in studentList">
                <el-form-item label="响应断言 :" prop="dataType" style="width: 50%;display: inline-block;">
                  <el-input v-model="studentList[i].dataType" clearable placeholder="请输入参数名称" />
                </el-form-item>
                <el-form-item prop="dataName" style="width: 50%;display: inline-block;margin-left: -80px">
                  <el-input v-model="studentList[i].dataName" clearable placeholder="请输入预期值" />
                </el-form-item>
                <el-button class="el-icon-plus" type="text" style="margin-left: 10px" @click="addList()" />
                <el-button v-if="i>0" class="el-icon-minus" type="text" @click="subList(i)" />
              </div>

              <div v-for="(item,i) in studentList">
                <el-form-item label="数据库断言" prop="dataType" style="width: 50%;display: inline-block;">
                  <el-input v-model="studentList[i].dataType" clearable placeholder="请输入执行SQL" />
                </el-form-item>
                <el-form-item prop="dataName" style="width: 50%;display: inline-block;margin-left: -80px">
                  <el-input v-model="studentList[i].dataName" clearable placeholder="请输入预期值" />
                </el-form-item>
                <el-button class="el-icon-plus" type="text" style="margin-left: 10px" @click="addList()" />
                <el-button v-if="i>0" class="el-icon-minus" type="text" @click="subList(i)" />
              </div>

            </el-form>
          </div>
        </div>
      </el-col>

      <el-col :span="2">
        <div class="verticalBar" />
      </el-col>

      <el-col :span="8">
        <div class="grid-content bg-purple" style="display: inline-block;width: 500px">
          <h3 style="text-align:center;">接口调试</h3>
          <br><br><br>
          <el-input placeholder="请输入环境名" style="width: 150px" @keyup.enter.native="handleFilter" />
          <el-button style="margin-left: 15px;" type="primary" @click="handleFilter">
            运行
          </el-button>
          <br><br>
          <el-card>
            接口返回结果<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
          </el-card>
        </div>
      </el-col>
    </el-card>
  </div>
</template>
<script>
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
      ]
    }
  },
  show() {
    this.visi = true
  },
  methods: {
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
.app-container{
  height:100%;
  width:100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* align-items: center; // 垂直居中 */
  justify-content: center;
  display: flex;
  background-color: #F5F5F5;
}
.container-card{
  height:100%;
  width:100%;
  overflow: auto;
}
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
.verticalBar {
        width: 1px;
        height: 780px;
        background: #D3D3D3;
        display: inline-block;
        margin-top: 31px;
        vertical-align: top;
        margin-right: 10px;
        margin-left: 50px;
    }
.el-col-6 {
    width: 8%;
}
</style>
