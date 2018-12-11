<template>
    <div class="page-register">
      <article class="header">
        <header>
          <a
          href="/"
          class="site-logo"/>
          <span class="login">
            <em class="bold">已有美团账号</em>
            <a href="/login">
              <el-button type="primary" size="small">登录</el-button>
            </a>
          </span>
        </header>
      </article>
      <section>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm">
          <el-form-item
            label="昵称"
            prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
          <el-form-item
            label="邮箱"
            prop="email">
            <el-input v-model="ruleForm.email" />
            <el-button
              size="mini"
              round
              @click="sendMsg">发送验证码</el-button>
            <span class="status">{{ statusMsg }}</span>
          </el-form-item>
          <el-form-item
            label="验证码"
            prop="code">
            <el-input
              v-model="ruleForm.code"
              maxlength="4" />
          </el-form-item>
          <el-form-item
            label="密码"
            prop="pwd">
            <el-input
              v-model="ruleForm.pwd"
              type="password" />
          </el-form-item>
          <el-form-item
            label="确认密码"
            prop="cpwd">
            <el-input
              v-model="ruleForm.cpwd"
              type="password" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="register">同意以下协议并注册</el-button>
            <div class="error">{{ error }}</div>
          </el-form-item>
          <el-form-item>
            <a
              class="f1"
              href="http://www.meituan.com/about/terms"
              target="_blank">《美团网用户协议》</a>
          </el-form-item>
        </el-form>
      </section>
    </div>
</template>

<script>
  import CryptoJS from 'crypto-js'
  export default {
    layout: 'blank',
    data() {
      return {
        statusMsg: '',
        error: '',
        ruleForm: {
          name: '',
          code: '',
          pwd: '',
          cpwd: '',
          email: ''
        },
        rules: {
          name: [{
            required: true, type: 'string', message: '请输入昵称', trigger: 'blur'
          },
            {
              validator: (rule, value, callback) => {  // 动态的关注
                if (value === '') {
                  callback(new Error('不能为空！'))
                } else {
                  callback()
                }
              }
            }
          ],
          email: [{
            required: true, type: 'email', message: '请输入邮箱', trigger: 'blur'
          }],
          pwd: [{
            required: true, message: '创建密码', trigger: 'blur'
          }],
          cpwd: [{
            required: true, message: '确认密码', trigger: 'blur'
          }, {
              validator: (rule, value, callback) => {
              if(value === '') {
                callback(new Error('确认密码不能为空'))
              } else if(value != this.ruleForm.pwd) {
                callback(new Error('两次输入密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
          ]
        }
      }
    },
    methods: {
      sendMsg() {
        const seft = this;
        let namePass
        let emailPass
        if(seft.timerid) {
          return false
        }
        this.$refs['ruleForm'].validateField('name', (valid) => {
          namePass = valid
        })
        seft.statusMsg = ''
        if(namePass)
          return false
        this.$refs['ruleForm'].validateField('email',(valid) => {
          emailPass = valid
        })
        if(!namePass && !emailPass) {
          seft.$axios.post('/user/verify', {
            username: encodeURIComponent(seft.ruleForm.name),
            email: seft.ruleForm.email
          }).then(({status, data}) => {
            if(status === 200 && data && data.code === 0) {
              console.log('ok', this)
              let count = 60
              seft.statusMsg = `验证码已发送，剩余${count--}秒`
              seft.timerid = setInterval(() => {
                seft.statusMsg = `验证码已发送，剩余${count--}秒`
                if(count === 0) {
                  clearInterval(seft.timerid)
                  seft.timerid = null
                  seft.statusMsg = ''
                }
              }, 1000)
            } else {
              seft.statusMsg = data.msg
            }
          })
        }
      },
      register() {
        let seft = this
        this.$refs['ruleForm'].validate((valid) => {

          if(valid) {
            seft.$axios.post('/user/signup', {
              username: window.encodeURIComponent(seft.ruleForm.name),
              password: CryptoJS.MD5(seft.ruleForm.pwd).toString(),
              email: seft.ruleForm.email,
              code: seft.ruleForm.code
            }).then(({status, data}) => {
              if (status === 200) {
                if(data && data.code === 0) {
                  location.href = '/login'
                } else {
                  seft.error = data.msg
                }
              } else {
                seft.error = `服务器出错，错误码：${staus}`
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "../assets/css/register/index.scss";
</style>
