<template>
  <div>
    <van-nav-bar title="登入" />
    <van-cell-group>
      <van-field
        v-model="user.mobile"
        label="手机号"
        left-icon="phone-o"
        placeholder="请输入手机号"
        clearable
        :error-message="errors.first('mobile')"
        v-validate="{
          required: true,
          digits: 11,
          regex: /^1[3-9]\d{9}$/
        }"
        name="mobile"
      />
      <van-field
        v-model="user.code"
        label="验证码"
        left-icon="comment-o"
        placeholder="请输入验证码"
        clearable
        v-validate="'required|digits:6'"
        name="code"
        :error-message="errors.first('code')"
      >
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="login-btn">
      <van-button
        type="info"
        class="btn"
        @click="handleLogin"
        :loading="loading"
        loading-type="spinner"
        loading-text="登入中..."
      >登入</van-button>
    </div>
  </div>
</template>

<script>
// 导入login请求的api
import { login } from '@/api/user.js'
import { Toast } from 'vant'
export default {
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      // 定义一个控制按钮加载的属性
      loading: false
    }
  },
  methods: {
    async handleLogin () {
      this.loading = true
      try {
        // 定义一个验证表单信息
        const valid = await this.$validator.validate()
        if (!valid) {
          return
        }
        // 将服务器返回的token信息保存到vuex中
        const res = await login(this.user)
        this.$store.commit('setUser', res)
        Toast.success('登入成功')
        // 登入成功后将按钮的状态改为默认值

        // 实现跳转到后台首页
        this.$router.push({
          // name: 'home',
          path: this.$route.query.redirect || '/home'

        })
      } catch (err) {
        Toast.fail('登入失败')
      }
      this.loading = false
    }
  },
  // 当页面数据渲染完成后使用自定义验证提示信息
  created () {
    const dict = {
      custom: {
        mobile: {
          required: '手机号不能为空',
          digits: '手机号必须是11位有效数字',
          regex: '手机号格式不正确'

        },
        code: {
          required: '验证码不能为空',
          digits: '验证码必须是6位有效数字'
        }
      }
    }

    // or use the instance method
    this.$validator.localize('en', dict)
  }
}
</script>
<style lang='less' scoped>
.login-btn {
  padding: 40px;
  .btn {
    width: 100%;
  }
}
</style>
