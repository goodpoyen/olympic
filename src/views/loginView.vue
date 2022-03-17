<template>
  	<v-main :style="{'background-image':'url(/images/test2.jpg)','background-size': 'cover', 'background-repeat': 'no-repeat', 'height': '100%'}">
      	<v-card width="50%" class="mx-auto my-12">
			<validation-observer ref="observer" v-slot="{ invalid }">
			  	<form @submit.prevent="submit" style="padding: 20px;">
					<validation-provider v-slot="{ errors }" name="account" rules="required|email">
						<v-text-field v-model="account" :error-messages="errors" label="帳號" required></v-text-field>
					</validation-provider>
					<validation-provider v-slot="{ errors }" name="password" rules="required">
						<v-text-field v-model="password" :error-messages="errors" label="密碼" :type="'password'" required></v-text-field>
					</validation-provider>
                	<v-btn block class="green mr-4" :disabled="invalid"  @click="login">登入</v-btn>
            	</form>
			</validation-observer>
		</v-card>
  	</v-main>
</template>

<script>
import {required, email} from 'vee-validate/dist/rules'
import {extend, ValidationObserver, ValidationProvider} from 'vee-validate'
import axios from 'axios'
import test from '../utils/test.js'

extend('required', {
    ...required,
    message: '{_field_} 不能為空',
})

extend('email', {
    ...email,
    message: '帳號格式不對',
})

export default {
	components: {
        ValidationProvider,
        ValidationObserver,
    },
    data: () => ({
        account: '',
        password: ''
    }),

    methods: {
        login () {
            let user = new Object()
            user.account = this.account
            user.password = this.password

        //    this.test()
        //     test.log()
            axios.post('/api/login', user)
            .then(function (response) {
                console.log(response.data)

                if (response.data.code == 200){
                    location.href = "/manage"
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
}
</script>