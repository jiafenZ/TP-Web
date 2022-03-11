<template>
  <div class="regiest-container">
    <img class="pic-regiest" src="@/assets/login_images/login.png" width="100%" height="100%">
    <el-card class="regiest-card">
      <el-form
        ref="regiestForm"
        :model="regiestForm"
        :rules="regiestRules"
        class="regiest-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">注册账号</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="regiestForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="regiestForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            @keyup.enter.native="handleregiest"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-close'"
            />
          </span>
        </el-form-item>

        <el-form-item prop="realname">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="realname"
            v-model="regiestForm.realname"
            placeholder="Realname"
            name="realname"
            type="text"
            tabindex="3"
          />
        </el-form-item>

        <el-form-item prop="phone">
          <span class="svg-container">
            <svg-icon icon-class="example" />
          </span>
          <el-input
            ref="phone"
            v-model="regiestForm.phone"
            placeholder="Phone"
            name="phone"
            type="text"
            tabindex="4"
          />
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px" @click.native.prevent="handleregiest">提交</el-button>

        <div class="login">
          <span class="login-table" style="margin-right: 20px" @click="loginTable">已有账号，点击登录 >></span>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { register } from '@/api/user'
export default {
  name: 'Regiest',
  data() {
    return {
      regiestForm: {
        username: '',
        password: '',
        realname: '',
        phone: ''
      },
      regiestRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [
          { required: true, trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度必须为6-18位' },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,18}$/,
            message: '密码必须是“字母+数字”的形式',
            trigger: 'blur'
          }
        ],
        realname: [
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
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleregiest() {
      this.$refs.regiestForm.validate((valid) => {
        console.log(valid)
        if (!valid) return this.$message.error('请填写正确的注册信息')
        register(this.regiestForm).then((res) => {
          console.log(res)
          if (res.code === 20000) {
            this.$message.success('注册成功')
            this.$router.push('/')
          }
        })
      })
    },
    loginTable() {
      // 点击跳转到登录页面
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .regiest-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.regiest-container {
  .pic-regiest {
    z-index: -100;
    position: absolute;
    left: 0;
    top: 0;
  }

  .regiest-card {
    width: 380px;
    margin-top: 160px;
    position: absolute;
    left: 60%;
    text-align: center;
    // background: rgba(34, 34, 34, 0.4);
  }

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px rgb(138, 137, 137) inset !important;
        box-shadow: 0 0 0 1000px rgb(229, 229, 229) inset !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    // height: 10px;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$dark_gray: #889aa4;
.regiest-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  .regiest-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .login {
    font-size: 14px;
    color: #3091f2;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
        cursor: pointer;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: #464c5b;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
