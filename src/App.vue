<template>
    <div id="app">
        <router-view v-if="isRouterAlive"></router-view>
    </div>

</template>

<script>
export default {
    data() {
        return {
            isRouterAlive: true
        }
    },
    methods: {
        reload() {
            this.isRouterAlive = false
            this.$nextTick(() => (this.isRouterAlive = true))
        }
    }
}
</script>
<style lang="less">
//清除默认样式
html, body, h3, p {
    margin: 0;
    padding: 0;
}
</style>



