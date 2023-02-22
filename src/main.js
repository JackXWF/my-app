import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from "@/router";
import store from './store'
import Cookie from "js-cookie";
import VueSession from "vue-session/index.esm";
// 分页组件
import Pagination from "@/components/Pagination";
//
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
import echarts from "echarts";






Vue.use(ElementUI);//全局注入
Vue.use(VueSession);


// 全局方法挂载
Vue.prototype.resetForm = resetForm

//全局echarts
Vue.prototype.$echarts = echarts;

// 全局组件挂载
Vue.component('Pagination', Pagination)


Vue.config.productionTip = false

//添加全局前置导航守卫
router.beforeEach((to, from, next) => {
    //token是否存在
    const token = Cookie.get(`token`)
    //如果token不存在，则用户未登录,跳转至登录页
    if (!token && to.name !== 'login') {
        next({name: 'login'})
    } else if (token && to.name === 'login') {
        next({name: 'home'})
    } else {
        next()
    }
})

new Vue({
    router,
    store,
    render: h => h(App),
    created() {
        store.commit('addMenu', router)
    },
}).$mount('#app')
