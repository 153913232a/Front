import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import User from '../dbs/models/users'
import Passport from './utils/passport'
import Email from '../dbs/config'
import axios from "../interface/utils/axios";

let router = new Router({
  prefix: '/user'
})

let Store = new Redis().client

router.post('/signup', async (ctx) => {
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body
  if(code) {
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码过期'
        }
        return false
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '请填写正确的验证码'
      }
    }
  }else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }

  let user = await User.find({
    username
  })
  console.log(user)
  if(user.length) {
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return
  }
  let nuser = await User.create({
    username,
    password,
    email
  })
  if(nuser) {  //如果用户名重复
    let res = await axios.post('/user/signin', {username, password})

    if(res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功！',
        user: res.data.user
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: "注册失败"
    }
  }
})

router.post('/signin', async (ctx, next) => {
  return Passport.authenticate('local', function (err, user, info, status) {
    if(err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if(user) {
        ctx.body = {
          code: 0,
          msg: '登陆成功'
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

router.post('/verify', async (ctx, next) => {
  let username = ctx.request.body.username
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  if(saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁'
    }
    return false  // 1分钟还没结束用户多次点击无效
  }
  let transporter = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: 587,
    secure: false,
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  let ko = {
    code: Email.smtp.getCode(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }
  let mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}>`,
    to: ko.email,
    subject: '注册码',
    html: `您的注册码是${ko.code}`
  }
  await transporter.sendMail(mailOptions, (error, info) => {
    if(error) {
      return console.log('error')
    } else {
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  ctx.body = {
    code: 0,
    msg: "验证码已发送"
  }
})

router.get('/exit', async (ctx, next) => {
  await ctx.logout()
  if(!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

router.get('/getUser', async (ctx) => {
  if(ctx.isAuthenticated()) {
    const {username, email} = ctx.session.passport.user
    ctx.body = {
      user: username,
      email
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
})

export default router
