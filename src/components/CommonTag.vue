<template>
    <div class="tabs">
        <el-tag
            v-for="(tag,index) in tags"
            :key="tag.name"
            :closable="tag.name !== 'home'"
            :effect="$route.name  === tag.name ? 'dark':'plain'"
            @click="changeMenu(tag)"
            @close="handleClose(tag,index)"
        >
            {{ tag.label }}
        </el-tag>

    </div>
</template>

<script>

import {mapMutations, mapState} from "vuex";
import th from "element-ui/src/locale/lang/th";

export default {
    name: "CommonTag",
    data() {
        return {}
    },
    computed: {
        ...mapState({
            tags: state => state.tab.tabsList
        })
    },
    methods: {
        ...mapMutations(['closeTag']),
        changeMenu(tag) {
            this.$router.push({name: tag.name})
        },

        //点击删除tag
        handleClose(tag, index) {
            this.closeTag(tag)
            const length = this.tags.length

            if (tag.name !== this.$route.name) {
                return
            }

            if (index === length) {
                this.$router.push({
                    name: this.tags[index - 1].name
                })
            } else {
                this.$router.push({
                    name: this.tags[index].name
                })
            }
        }

    }
}
</script>

<style scoped>

</style>
