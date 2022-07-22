<template>
  <v-main
    :style="{
      'background-image': 'url(/images/loginBackground.png)',
      'background-size': '100% 100%',
      'background-repeat': 'no-repeat',
      height: '100%',
    }"
  >
    <div style="width: 30%; margin: 40px auto">
      <span
        style="
          display: flex;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;
          color: #3041d6;
        "
        >奧林匹亞選訓支援系統</span
      >
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form style="padding: 20px">
          <validation-provider
            v-slot="{ errors }"
            name="帳號"
            rules="required|email"
          >
            <v-text-field
              v-model="account"
              :error-messages="errors"
              label="帳號"
              @keyup.enter="login"
              prepend-icon="mdi-account-circle-outline"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="密碼" rules="required">
            <v-text-field
              v-model="password"
              :error-messages="errors"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show1 = !show1"
              label="密碼"
              :type="show1 ? 'text' : 'password'"
              prepend-icon="mdi-key"
              required
              @keyup.enter="login"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="驗證碼"
            rules="required|max:4"
          >
            <v-text-field
              v-model="verifycode"
              :error-messages="errors"
              :counter="4"
              label="驗證碼"
              :type="'verifycode'"
              @keyup.enter="login"
              prepend-icon="mdi-lastpass"
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
            {{ errorMsg }}
          </v-alert>

          <v-btn
            block
            depressed
            class="mr-4 white--text"
            color="#2D5BFF"
            :disabled="invalid"
            @click="login()"
            >登入</v-btn
          >
          <v-alert
            v-show="dialog"
            border="left"
            colored-border
            type="error"
            elevation="2"
            style="margin-top: 20px"
          >
            {{ dialogMsg }}
          </v-alert>
        </form>
      </validation-observer>
    </div>
    <div
      class="py-8 white--text text-center"
      style="
        font-size: 5px;
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 60px;
      "
    >
      @ {{ new Date().getFullYear() }} ALL Rights Reserved.
    </div>
  </v-main>
</template>

<script>
import { required, email, max } from 'vee-validate/dist/rules'
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

extend('max', {
  ...max,
  message: '{_field_} 不能超過 {length} 字元'
})

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    SIdentify
  },
  data: () => ({
    invalid: false,
    account: '',
    password: '',
    verifycode: '',
    identifyCode: '',
    identifyCodes: '3456789ABCDEFGHGKMNPQRSTUVWXY',
    alertShow: false,
    errorMsg: '',
    dialogMsg: '',
    dialog: false,
    show1: false
  }),

  watch: {
    verifycode: function () {
      if (this.verifycode !== '') {
        this.errorMsg = ''
        this.alertShow = false
        this.dialogMsg = ''
        this.dialog = false
      }
    },
    account: function () {
      if (this.account !== '') {
        this.dialogMsg = ''
        this.dialog = false
      }
    },
    password: function () {
      if (this.password !== '') {
        this.dialogMsg = ''
        this.dialog = false
      }
    }
  },
  computed: {
    test8 () {
      // console.log(1)
      this.$store.dispatch('test', 'balabala')
      // console.log(this.$store.dispatch('test', 'balabala'))
      // console.log(this.$store.state.test)
      return this.$store.state.test
    },
    id () {
      return this.$route.params.id
    }
  },

  methods: {
    async login () {
      // eslint-disable-next-line prefer-const
      let emailRule = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/

      if (this.password === '' || this.verifycode === '' || !emailRule.test(this.account)) {
        return false
      }

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
          if (response.data.code === 200) {
            console.log(response.data)
            this.store('act', response.data.resultData.act, '1800000')
            this.store('ret', response.data.resultData.ret, '1800000')
            this.store('level', response.data.resultData.level, '1800000')
            this.store('olympic', response.data.resultData.olympic, '1800000')
            location.href = '/manage'
          } else if (response.data.code === 201 || response.data.code === 501) {
            this.dialogMsg = '帳號密碼有誤'
            this.dialog = true
            this.account = ''
            this.password = ''
            this.verifycode = ''
            this.refreshCode()
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
  },

  mounted () {
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
    // console.log(this.test8)
    console.log(this.id)
    // console.log(4)
  }
}
</script>
