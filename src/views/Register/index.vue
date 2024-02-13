<template>
  <div class="register-container">
    <el-form ref="registerFormRef" :model="registerForm" :rules="rules" class="register-page">
      <h2 class="title">注册</h2>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="registerForm.username"
          placeholder="请输入用户名"
          prefix-icon="el-icon-user"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="registerForm.password"
          placeholder="请输入密码"
          prefix-icon="el-icon-lock"
          clearable
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm">
        <el-input
          v-model="registerForm.confirm"
          placeholder="请输入确认密码"
          prefix-icon="el-icon-lock"
          clearable
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="validCode" style="display: flex; flex-direction: column; align-items: flex-start;">
        <div style="display: flex; justify-content: space-between;">
          <el-input
            style="width: 60%;"
            v-model="registerForm.validCode"
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
          <el-button style="width: 45%;" type="primary" @click="register">注 册</el-button>
        <el-button style="width: 45%;" type="info" @click="reset">重 置</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="text" @click="skipLogin">已有账号，前往登录 >></el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import VerifyCode from '@/components/VerifyCode.vue'
import { userRegisterAPI } from '@/api/user'

export default {
  name: 'Register',
  components: {
    VerifyCode
  },
  data () {
    return {
      randomCode: '',
      registerForm: {
        username: '',
        password: '',
        confirm: '',
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
        confirm: [
          {
            required: true,
            message: '请输入确认密码',
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
    skipLogin () {
      this.$router.push('/login')
    },
    async sleep (t) {
      return new Promise(resolve => setTimeout(resolve, t))
    },
    async register () {
      this.$refs.registerFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning('请先输入必填项内容')
          return
        }
        if (this.registerForm.password !== this.registerForm.confirm) {
          this.switchCode()
          this.$message.warning('请检查两次输入的密码是否一致')
          return
        }
        if (this.registerForm.validCode.toLowerCase() !== this.randomCode.toLowerCase()) {
          this.$message.warning('验证码错误')
          return
        }
        const req = {
          id: Math.round(Math.random() * 9999) + 1,
          username: this.registerForm.username,
          password: this.registerForm.password,
          name: null,
          phone: null,
          email: null,
          address: null,
          role: '用户'
        }
        const res = await userRegisterAPI(req)
        if (res.code === 200) {
          this.$message.success('注册成功，3s后将自动跳转登录页~')
          this.sleep(3000).then(() => {
            this.$router.push('/login')
          })
        } else {
          this.switchCode()
          this.$message.error('注册失败，用户名重复')
        }
      })
    },
    reset () {
      this.$refs.registerFormRef.resetFields()
    }
  },
  created () {
    this.switchCode()
  }
}
</script>

<style lang="less" scoped>
.register-container {
  position: fixed;
  width: 100%;
  height: 100vh;
  background: url('../../assets/image/login/bg.png');
  background-size: cover;
  overflow: hidden;
  .register-page {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
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
