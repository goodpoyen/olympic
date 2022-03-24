import Vue from 'vue'

Vue.mixin({
  methods: {
    test () {
      console.log(123)
    },

    store (key, value, expire) {
      const obj = {
        time: new Date().getTime(),
        value: value,
        expire: expire
      }

      const objStr = JSON.stringify(obj)
      localStorage.setItem(key, objStr)
    },

    checkT () {
      const item = localStorage.getItem('ret')

      if (item) {
        const itemObj = JSON.parse(item)

        if (new Date().getTime() - itemObj.time >= itemObj.expire) {
          localStorage.removeItem('ret')
          localStorage.removeItem('act')
          location.href = '/login'
        } else {
          this.store('ret', itemObj.value, '1800000')
          return true
        }
      } else {
        return false
      }
    },

    checkLogin () {
      const item = localStorage.getItem('ret')

      if (item) {
        const itemObj = JSON.parse(item)

        if (new Date().getTime() - itemObj.time >= itemObj.expire) {
          localStorage.removeItem('ret')
          localStorage.removeItem('act')
          return false
        } else {
          this.store('ret', itemObj.value, '1800000')
          return true
        }
      } else {
        return false
      }
    }
  }
})
