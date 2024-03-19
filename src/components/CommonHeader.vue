<template>
    <div class="header-container">
        <div class="l-content">
            <!-- 按钮 -->
            <el-button @click="handleMenu" icon="el-icon-menu" size="mini"></el-button>

            <!-- 面包屑 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="item in tags" :key="item.path" :to="{ path: item.path }">
                    {{ item.label }}
                </el-breadcrumb-item>


            </el-breadcrumb>

        </div>

        <div class="r-content">
            <el-dropdown @command="handleClick">
                <span class="el-dropdown-link">
                    <img class="user" src="../assets/images/avatar35.png" alt="头像"/>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="updatePass">修改密码</el-dropdown-item>
                    <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>


        <el-dialog v-bind="$attrs" :visible.sync="dialogVisible" @close="onClose"
                   title="修改密码">
            <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
                <el-form-item label="原密码" prop="oldPass">
                    <el-input v-model="formData.oldPass" placeholder="请输入原密码" clearable
                              :style="{width: '100%'}">
                    </el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPass">
                    <el-input v-model="formData.newPass" placeholder="请输入新密码" clearable
                              :style="{width: '100%'}">
                    </el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="oncePass">
                    <el-input v-model="formData.oncePass" placeholder="请再次输入新密码" clearable
                              :style="{width: '100%'}">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
// 辅助函数
import {mapState} from 'vuex'
import {updatePwd} from "@/api";

import Cookie from "js-cookie";

export default {
    data() {
        return {
            dialogVisible: false,
            flag: 0,
            formData: {
                oldPass: undefined,
                newPass: undefined,
                oncePass: undefined,
            },
            submitForm: {
                id: '',
                oldPass: '',
                newPass: ''
            }
            ,
            rules: {
                oldPass: [{
                    required: true,
                    message: '请输入原密码',
                    trigger: 'blur'
                }],
                newPass: [{
                    required: true,
                    message: '请输入新密码',
                    trigger: 'blur'
                }],
                oncePass: [{
                    required: true,
                    message: '请再次输入新密码',
                    trigger: 'blur'
                }],
            },
        }
    },
    methods: {
        handleMenu() {
            this.$store.commit('collapseMenu')
        },
        handleClick(command) {
            if (command === 'logout') {
                Cookie.remove('token')
                Cookie.remove('menu')
                this.flag = 0;
                this.$session.remove('userInfo')
                window.location.reload()
                this.$router.push('/login')
            }

            if (command === 'updatePass') {
                this.dialogVisible = true
            }
        },
        onOpen() {
        },
        onClose() {
            this.$refs['elForm'].resetFields()
        },
        close() {
            this.dialogVisible = false
            this.$emit('update:visible', false)
        },
        handleConfirm() {
            this.$refs['elForm'].validate(valid => {
                if (!valid) return
                if (this.formData.newPass != this.formData.oncePass) {
                    this.$message.error("两次输入的密码不一致,请重新输入")
                }
                this.submitForm.id = this.$session.get('userInfo').userName
                this.submitForm.oldPass = this.formData.oldPass
                this.submitForm.newPass = this.formData.newPass
                updatePwd(this.submitForm).then(r => {
                    if (r.data.code != 200) {


                        this.flag++;
                        if (this.flag >= 3) {
                            this.$message.error("您输入密码已错误超过三次,如忘记密码请联系管理员:2933203540@qq.com")

                        } else {
                            this.$message.error("原密码错误,请重新输入!")
                        }


                        return;

                    } else {
                        this.$message.success("修改成功!")
                        this.onClose();
                        this.dialogVisible = false

                        setTimeout(() => {
                            this.$message.success("请重新登录!")
                        }, 500);

                        setTimeout(() => {
                            Cookie.remove('token')
                            Cookie.remove('menu')
                            this.$session.remove('userInfo')
                            window.location.reload()
                            this.$router.push('/login')
                        }, 500);

                    }


                })


            })
        },
    },
    computed: {
        ...mapState({
            tags: state => state.tab.tabsList
        })
    }

}

</script>

<style lang="less" scoped>
.header-container {
    padding: 0 20px;
    background-color: #333;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .text {
        font-size: 14px;
        color: #fff;
        margin-left: 10px;
    }

    .r-content {
        .user {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
    }

    .l-content {

        display: flex;
        align-items: center;

        /deep/ .el-breadcrumb__item {
            margin-left: 10px;

            .el-breadcrumb__inner {

                font-weight: normal;

                &.is-link {
                    color: #666;

                }

            }

            &:last-child {
                .el-breadcrumb__inner {
                    color: white;
                }
            }
        }
    }


}
</style>
