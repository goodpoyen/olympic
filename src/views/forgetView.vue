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
      <validation-observer ref="observer" v-slot="{ invalid }" v-show="verify">
        <div class="teal lighten-4 darken-2 text-center">
          <span class="white--text">忘記密碼</span>
        </div>
        <form @submit.prevent="submit" style="padding: 20px">
          <validation-provider
            v-slot="{ errors }"
            name="信箱"
            rules="required|email"
          >
            <v-text-field
              v-model="account"
              :error-messages="errors"
              label="信箱"
              required
            ></v-text-field>
          </validation-provider>
          <v-btn block class="green mr-4" :disabled="invalid" @click="send"
            >領取驗證碼</v-btn
          >
        </form>
      </validation-observer>
      <validation-observer
        ref="observer"
        v-slot="{ invalid2 }"
        v-show="!verify"
      >
        <div class="teal lighten-4 darken-2 text-center">
          <span class="white--text">忘記密碼</span>
        </div>
        <form @submit.prevent="submit" style="padding: 20px">
          <validation-provider
            v-slot="{ errors }"
            name="驗證碼"
            rules="required"
          >
            <v-text-field
              v-model="token"
              :error-messages="errors"
              label="驗證碼"
              required
            ></v-text-field>
          </validation-provider>
          <v-btn block class="green mr-4" :disabled="invalid2" @click="goChange"
            >變更密碼</v-btn
          >
        </form>
      </validation-observer>
      <v-alert dense type="info" v-show="status">
        <strong>驗證碼信件已送出 並輸入驗證碼</strong>
      </v-alert>
    </v-card>
  </v-main>
</template>

<script>
import { required, email } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate'
// import axios from 'axios'

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
    ValidationObserver
  },
  data: () => ({
    account: '',
    token: '',
    status: false,
    verify: true
  }),

  methods: {
    send () {
      const user = {}
      user.account = this.account

      // axios.post('/api/login', user)
      // .then(function (response) {
      //     console.log(response.data)

      //     if (response.data.code == 200){
      //         location.href = "/manage"
      //     }
      // })
      // .catch(function (error) {
      //     console.log(error);
      // });
      this.verify = false
      this.status = true
    },

    goChange () {
      const user = {}
      user.account = this.account

      // axios.post('/api/login', user)
      // .then(function (response) {
      //     console.log(response.data)

      //     if (response.data.code == 200){
      //         location.href = "/manage"
      //     }
      // })
      // .catch(function (error) {
      //     console.log(error);
      // });

      // location.href = "/manage?t=" + this.token
      location.href = '/manage?t=' + 'cb0JKq8WO3jLlT8oxlbVCg=='
    }
  }
}
</script>
