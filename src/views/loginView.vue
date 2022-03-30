<template>
  <v-main
    :style="{
      'background-image': 'url(/images/test.jpg)',
      'background-size': 'cover',
      'background-repeat': 'no-repeat',
      height: '100%',
    }"
  >
    <v-card width="50%" class="mx-auto my-12">
      <validation-observer ref="observer" v-slot="{ invalid }">
        <div class="teal lighten-4 darken-2 text-center">
          <span class="white--text">登入</span>
        </div>
        <form @submit.prevent="submit" style="padding: 20px">
          <validation-provider
            v-slot="{ errors }"
            name="帳號"
            rules="required|email"
          >
            <v-text-field
              v-model="account"
              :error-messages="errors"
              label="帳號"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="密碼" rules="required">
            <v-text-field
              v-model="password"
              :error-messages="errors"
              label="密碼"
              :type="'password'"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="驗證碼"
            rules="required"
          >
            <v-text-field
              v-model="verifycode"
              :error-messages="errors"
              label="驗證碼"
              :type="'verifycode'"
              required
            ></v-text-field>
            <s-identify
              :identifyCode="identifyCode"
              style="display: inline"
            ></s-identify>
            <v-btn icon color="green" @click="refreshCode">
              <v-icon>mdi-cached</v-icon>
            </v-btn>
          </validation-provider>
          <v-alert
            v-show="alertShow"
            outlined
            type="warning"
            prominent
            border="left"
          >
            {{errorMsg}}
          </v-alert>

          <v-btn block class="green mr-4" :disabled="invalid" @click="login"
            >登入</v-btn
          >
          <!-- <v-btn block class="green mr-4"  @click="test">登入</v-btn> -->
        </form>
        <!-- <a href="/forget" target="_blank" style="padding: 20px">? 忘記密碼</a> -->
      </validation-observer>
    </v-card>
  </v-main>
</template>

<script>
import { required, email } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate'
import SIdentify from '../components/identify.vue'
// import test from '../utils/test.js'

extend('required', {
  ...required,
  message: '{_field_} 不能為空'
})

extend('email', {
  ...email,
  message: '帳號格式不對'
})

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    SIdentify
  },
  data: () => ({
    account: '',
    password: '',
    verifycode: '',
    identifyCode: '',
    identifyCodes: '3456789ABCDEFGHGKMNPQRSTUVWXY',
    alertShow: false,
    errorMsg: ''
  }),

  methods: {
    async login () {
      const user = {}
      user.account = this.account
      user.password = this.password

      if (this.verifycode.toLowerCase() !== this.identifyCode.toLowerCase()) {
        this.alertShow = true
        this.errorMsg = '驗證碼錯誤'
        this.verifycode = ''
        return false
      }

      await this.axios
        .post(this.GLOBAL.APISERVERURL + '/login', user)
        .then((response) => {
          console.log(response.data)

          if (response.data.code === 200) {
            this.store('act', response.data.resultData.act, '1800000')
            this.store('ret', response.data.resultData.ret, '1800000')
            // // location.href = "/manage"
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },

    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },

    refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },

    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode +=
          this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
    }

    // async test () {
    //   await this.axios
    //     .post(this.GLOBAL.APISERVERURL + '/test', {})
    //     .then((response) => {
    //       console.log(response.data)

    //       if (response.data.code === 400) {
    //         const status = this.getAT()
    //         if (status) {
    //           console.log(5555)
    //         }
    //       }
    //     })
    //     .catch(function (error) {
    //       console.log(error)
    //     })
    // }
  },

  mounted () {
    if (this.checkLogin()) {
      // location.href = '/manage'
    }

    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  }
}
</script>
