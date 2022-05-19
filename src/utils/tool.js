import Vue from 'vue'

Vue.mixin({
  data: () => ({
    year: '',
    month: '',
    day: '',
    hours: '',
    seconds: '',
    minutes: ''
  }),

  methods: {
    getNowDataTime () {
      const today = new Date()

      this.year = today.getFullYear()

      this.month = today.getMonth() + 1

      if (this.month < 10) {
        this.month = '0' + this.month
      }

      this.day = today.getDay()

      if (this.day < 10) {
        this.day = '0' + this.day
      }

      this.hours = today.getHours()
      this.minutes = today.getMinutes()
      this.seconds = today.getSeconds()

      return this.year + '-' + this.month + '-' + this.day + ' ' + this.hours + ':' + this.minutes + ':' + this.seconds
    },

    changeOlympicData (word) {
      if (word === 'TMO') {
        return '數學奧林匹亞  (TMO)'
      }

      if (word === 'IPHO') {
        return '物理奧林匹亞  (IPHO)'
      }

      if (word === 'TWICHO') {
        return '化學奧林匹亞  (TWICHO)'
      }

      if (word === 'CTBO') {
        return '生物奧林匹亞  (CTBO)'
      }

      if (word === 'IESO') {
        return '地科奧林匹亞  (IESO)'
      }

      if (word === 'TWIJSO') {
        return '國中奧林匹亞  (TWIJSO)'
      }

      if (word === 'TOI') {
        return '資訊奧林匹亞  (TOI)'
      }
    },
    changeOlympicMsg (level) {
      if (level === '1') {
        return '系統管理者介面'
      }

      if (level === '2') {
        return '專任助理管理介面'
      }
    }
  },

  mounted () {
  }
})
