import Vue from 'vue'

Vue.mixin({
    methods: {
        test () {
            console.log(123)
        },

        store (key, value, expire) {
            let obj = {
                time:new Date().getTime(),
                value:value,
                expire:expire,
            }
            
            let objStr = JSON.stringify(obj);
            localStorage.setItem(key,objStr);
        },

        checkT (){
            let item = localStorage.getItem('ret');

            if (item) {
                let itemObj = JSON.parse(item);

                if(new Date().getTime() - itemObj.time >= itemObj.expire){
                    localStorage.removeItem('ret')
                    localStorage.removeItem('act')
                    location.href = "/login"
                }else{
                    this.store('ret', itemObj.value, '1800000')
                    return true
                }
            }else{
                return false
            }
        },

        checkLogin (){
            let item = localStorage.getItem('ret');

            if (item) {
                let itemObj = JSON.parse(item);

                if(new Date().getTime() - itemObj.time >= itemObj.expire){
                    localStorage.removeItem('ret')
                    localStorage.removeItem('act')
                    return false
                }else{
                    this.store('ret', itemObj.value, '1800000')
                    return true
                }
            }else{
                return false
            }
        }
    }
})