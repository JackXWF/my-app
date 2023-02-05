import Vue from 'vue'
import VueRouter from "vue-router";
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Main from '../views/Main.vue'
import Mall from '../views/Mall.vue'
import PageOne from '../views/PageOne.vue'
import PageTwo from '../views/PageTwo.vue'
import Login from "@/views/Login.vue";
import Apartment from "@/views/Apartment.vue";
import Canteen from "@/views/Canteen.vue";

Vue.use(VueRouter)

//将路由与组件进行映射
const routes = [
    {
        path: '/',
        component: Main,
        name: 'Main',
        redirect: '/home',//重定向
        children: [
            /*{path: 'home', name: 'home', component: Home},//首页
            {path: 'user', name: 'user', component: User},//用户管理
            {path: 'apartment', name: 'apartment', component: Apartment},//宿舍管理
            {path: 'canteen', name: 'canteen', component: Canteen},//食堂管理
            {path: 'page1', name: 'page1', component: PageOne},//页面1
            {path: 'page2', name: 'page2', component: PageTwo},//页面2*/
        ]

    },

    {
        path: '/login',
        name: 'login',
        component: Login

    }

]

//创建router实例
const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})

//对外暴露router
export default router

