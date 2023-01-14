<template>
    <div>
        <el-container>
            <el-aside width="auto">
                <!-- 侧边 -->
                <common-aside/>
            </el-aside>
            <el-container>
                <el-header>
                    <!-- 头部 -->
                    <common-header/>
                </el-header>
                <common-tag/>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import CommonAside from '../components/CommonAside.vue';
import CommonHeader from '../components/CommonHeader.vue';
import CommonTag from "@/components/CommonTag.vue";

export default {
    data() {
        return {}
    },
    components: {
        CommonAside,
        CommonHeader,
        CommonTag
    }

}
</script>

<style lang="less" scoped>
.el-header {
    padding: 0;
    margin: 0;
}
</style>
