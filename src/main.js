import Vue from "vue"
import App from "./App.vue"
import utils from "./utils/index"
import axios from "axios"
import "@/mock"
import "@/utils/elementUI"
import "@/style/index.less"

Vue.config.productionTip = false
Vue.prototype.$utils = utils
Vue.prototype.$axios = axios

new Vue({
    render: h => h(App)
}).$mount("#app")
