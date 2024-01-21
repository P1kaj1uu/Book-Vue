<template>
  <div class="login-container">
    <div class="welcome">欢迎访问图书借阅平台~</div>
    <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-page">
      <h2 class="title">登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
          prefix-icon="el-icon-user"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          placeholder="请输入密码"
          prefix-icon="el-icon-lock"
          clearable
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="validCode" style="display: flex; flex-direction: column; align-items: flex-start;">
        <div style="display: flex; justify-content: space-between;">
          <el-input
            style="width: 60%;"
            v-model="loginForm.validCode"
            placeholder="请输入验证码"
            prefix-icon="el-icon-key"
            maxlength="4"
            clearable
          ></el-input>
          <div style="display: flex; cursor: pointer; user-select: none" @click="switchCode">
            <VerifyCode ref="codeRef" :identifyCode="randomCode" />
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
          <el-button style="width: 45%;" type="primary" @click="login">登 录</el-button>
        <el-button style="width: 45%;" type="info" @click="reset">重 置</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="text" @click="skipRegister">暂无账号，前往注册 >></el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import VerifyCode from '@/components/VerifyCode.vue'
import { userLoginAPI } from '@/api/index'
import { setToken } from '@/utils/token'
import { startSakura } from '@/plugins/sakura'

export default {
  name: 'Login',
  components: {
    VerifyCode
  },
  data () {
    return {
      randomCode: '',
      loginForm: {
        username: '',
        password: '',
        validCode: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        validCode: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 随机生成验证码
    switchCode () {
      const str = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ]
      let res = ''
      for (let i = 0; i < 4; i++) {
        const id = Math.ceil(Math.random() * 35)
        res += str[id]
      }
      this.randomCode = res
      this.$refs.codeRef?.identifyCode && this.$set(this.$refs.codeRef, 'SIdentify', this.randomCode)
    },
    skipRegister () {
      this.$router.push('/register')
    },
    async login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        // 如果校验不通过，阻止后续代码继续执行
        if (!valid) {
          this.$message.warning('请先输入必填项内容')
          return
        }
        if (this.loginForm.validCode.toLowerCase() !== this.randomCode.toLowerCase()) {
          this.$message.warning('验证码错误')
          return
        }
        // 发起网络请求
        const res = await userLoginAPI(this.loginForm)
        if (!res.data) {
          this.$message.error(res.msg)
          this.switchCode()
        } else {
          setToken(res.data.token)
          this.$router.push('/layout')
          this.$message.success('登录成功')
        }
      })
    },
    reset () {
      this.$refs.loginFormRef.resetFields()
    }
  },
  created () {
    this.switchCode()
    startSakura()
  }
}
</script>

<style lang="less" scoped>
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: #666;
  }
}
.login-container {
  position: fixed;
  width: 100%;
  height: 100vh;
  background: url('../../assets/image/login/bg.png');
  background-size: cover;
  overflow: hidden;
  .welcome {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 100px;
    font-size: 30px;
    font-weight: 600;
    color: #fff;
    user-select: none;
    max-width: 480px;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
    letter-spacing: .15em;
    animation: typing 4s steps(30, end) infinite, blink-caret 2s step-end infinite;
  }
  .login-page {
    border-radius: 5px;
    margin: 180px auto;
    width: 350px;
    padding: 24px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    cursor: pointer;
    .title {
      margin-bottom: 20px;
      text-align: center;
    }
  }
}
.el-form-item {
  margin-bottom: 10px;
}
</style>
