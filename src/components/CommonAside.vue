<template>
    <div>
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                 :collapse="isCollapse" background-color="#003a7b" text-color="#fff" active-text-color="#ffd04b">
            <h3>{{ isCollapse ? '后勤' : '高校学生后勤管理系统' }}</h3>
            <el-menu-item v-for="item in noChildren" :key="item.name" :index="item.name" @click="clickMenu(item)">
                <i :class="`el-icon-${item.icon}`"></i>
                <span slot="title">{{ item.label }}</span>
            </el-menu-item>
            <el-submenu :index="item.label" v-for="item in hasChildren" ::key="item.label">
                <template slot="title">
                    <i :class="`el-icon-${item.icon}`"></i>
                    <span slot="title">{{ item.label }}</span>
                </template>
                <el-menu-item-group v-for="subItem in item.children" ::key="subItem.path">
                    <el-menu-item :index="subItem.path" @click="clickMenu(subItem)"><i
                        :class="`el-icon-${item.icon}`"></i>{{ subItem.label }}
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>

</template>


<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 1200px;
}

.el-menu {
    border-right: none;
    height: 100vh;

    h3 {
        color: #fff;
        text-align: center;
        line-height: 48px;
        font-size: 16px;
        font-weight: 400px;
    }
}
</style>

<script>
import th from "element-ui/src/locale/lang/th";
import Cookie from "js-cookie";

export default {
    data() {
        return {};
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        //点击菜单
        clickMenu(item) {
            console.log(item);
            //当前路由与跳转路由不一致才允许跳转
            if (this.$route.path !== item.path && !(this.$route.path === '/home' && (this.$route.path === '/'))) {
                this.$router.push(item.path) //获取挂载的router，将路由push到指定位置
            }

            this.$store.commit('selectMenu', item)
        }
    },
    computed: {
        noChildren() {
            return this.menuData.filter(item => item.children.length === 0)
        },
        hasChildren() {
            return this.menuData.filter(item => item.children != 0)
        },
        menuData() {
            return JSON.parse(Cookie.get('menu')) || this.$store.state.tab.menu
        },
        isCollapse() {
            return this.$store.state.tab.isCollapse
        }
    }
}
</script>
