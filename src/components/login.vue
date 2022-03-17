<template>
    <v-card width="50%" class="mx-auto my-12">
    <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="submit" style="padding: 20px;">
            <validation-provider v-slot="{ errors }" name="account" rules="required|email">
                <v-text-field v-model="account" :error-messages="errors" label="帳號" required></v-text-field>
            </validation-provider>

            <validation-provider v-slot="{ errors }" name="password" rules="required">
                <v-text-field v-model="password" :error-messages="errors" label="密碼" required></v-text-field>
            </validation-provider>

            <v-btn block class="green mr-4" :disabled="invalid">登入</v-btn>
            <!-- <v-btn block class="green mr-4"  @click="test">測試</v-btn> -->
        </form>
    </validation-observer>
    </v-card>
</template>

<script>
import {required, email} from 'vee-validate/dist/rules'
import {extend, ValidationObserver, ValidationProvider} from 'vee-validate'
import axios from 'axios'

extend('required', {
    ...required,
    message: '{_field_} 不能為空',
})

extend('email', {
    ...email,
    message: '帳號格式不對',
})

export default {
    name: 'login',

    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data: () => ({
        account: '',
        password: ''
    }),

    methods: {
        submit () {
            this.$refs.observer.validate()
        },

        test () {
            axios.post('/api/test', {
                firstName: 'Fred',
                lastName: 'Flintstone'
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
}
</script>
