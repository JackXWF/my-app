import Vue from 'vue'
import VueRouter from "vue-router";
import Main from '../views/Main.vue'
import Login from "@/views/Login.vue";


Vue.use(VueRouter)

//将路由与组件进行映射
const routes = [
    {
        path: '/',
        component: Main,
        name: 'Main',
        redirect: '/home',//重定向

    },

    {
        path: '/login',
        name: 'login',
        component: Login

    },
]

//创建router实例
const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})

//对外暴露router
export default router

