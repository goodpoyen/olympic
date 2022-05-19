import Vue from 'vue'
import axios from 'axios'

Vue.mixin({
  data: () => ({
    AT: {},
    RT: {},
    level: '',
    olympic: ''
  }),

  methods: {
    store (key, value, expire) {
      const obj = {
        time: new Date().getTime(),
        value: value,
        expire: expire
      }

      const objStr = JSON.stringify(obj)
      localStorage.setItem(key, objStr)
    },

    renewLT () {
      const item = localStorage.getItem('ret')
      const item2 = localStorage.getItem('act')

      if (item && item2) {
        const itemObj = JSON.parse(item)

        if (new Date().getTime() - itemObj.time >= itemObj.expire) {
          localStorage.removeItem('ret')
          localStorage.removeItem('act')
          localStorage.removeItem('level')
          localStorage.removeItem('olympic')
          location.href = '/login'
        } else {
          this.store('ret', itemObj.value, '1800000')
          return true
        }
      } else {
        localStorage.removeItem('ret')
        localStorage.removeItem('act')
        return false
      }
    },

    async checkLogin () {
      const item = localStorage.getItem('ret')
      const item2 = localStorage.getItem('act')

      if (item && item2) {
        const itemObj = JSON.parse(item)

        if (new Date().getTime() - itemObj.time >= itemObj.expire) {
          localStorage.removeItem('ret')
          localStorage.removeItem('act')
          localStorage.removeItem('level')
          localStorage.removeItem('olympic')
          return false
        } else {
          this.store('ret', itemObj.value, '1800000')
          const status = await this.checkRT(itemObj.value)
          if (!status) {
            localStorage.removeItem('ret')
            localStorage.removeItem('act')
            localStorage.removeItem('level')
            localStorage.removeItem('olympic')
            return false
          }

          return true
        }
      } else {
        return false
      }
    },

    async checkRT (T) {
      const checkData = {}
      checkData.T = T
      let status = false

      await axios
        .post(this.GLOBAL.APISERVERURL + '/checkRT', checkData)
        .then((response) => {
          if (response.data.code === 200) {
            status = true
          } else if (response.data.code === 400) {
            status = false
          } else if (response.data.code === 401) {
            this.store('ret', response.data.resultData.ret, '1800000')
            this.RT = JSON.parse(localStorage.getItem('ret'))
            this.store('level', response.data.resultData.level, '1800000')
            this.level = JSON.parse(localStorage.getItem('level'))
            this.store('olympic', response.data.resultData.olympic, '1800000')
            this.olympic = JSON.parse(localStorage.getItem('olympic'))
            this.store('act', response.data.resultData.act, '1800000')
            this.act = JSON.parse(localStorage.getItem('act'))

            status = true
          }
        })
        .catch((err) => {
          return err
        })

      return status
    },

    async getAT () {
      let status = false
      const checkData = {}
      const item = localStorage.getItem('ret')
      const itemObj = JSON.parse(item)
      checkData.T = itemObj.value

      await axios
        .post(this.GLOBAL.APISERVERURL + '/getAT', checkData)
        .then((response) => {
          if (response.data.code === 200) {
            this.store('act', response.data.resultData.act, '1800000')
            this.AT = JSON.parse(localStorage.getItem('act'))
            status = true
          } else {
            localStorage.removeItem('ret')
            localStorage.removeItem('act')
            localStorage.removeItem('level')
            localStorage.removeItem('olympic')
            location.href = '/login'
          }
        })
        .catch((err) => {
          return err
        })

      return status
    }
  },

  mounted () {
    this.level = JSON.parse(localStorage.getItem('level'))
    this.olympic = JSON.parse(localStorage.getItem('olympic'))
    this.AT = JSON.parse(localStorage.getItem('act'))
    this.RT = JSON.parse(localStorage.getItem('ret'))
  }
})
