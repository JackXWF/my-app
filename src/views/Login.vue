<template>
    <div id="login">
        <el-form ref="form" label-width="70px" class="login-container" :model="form" :rules="rules" :inline="true">
            <p class="login_title">高校学生后勤管理系统</p>
            <el-form-item label="用户名" prop="userName">
                <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="userPassword">
                <el-input v-model="form.userPassword" type="password" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-button style="margin-left: 75px;margin-top: 10px;font-size: 18px" type="primary" @click="submit">登录
            </el-button>
            <el-button style="margin-left: 139px;margin-top: 10px;font-size: 18px" type="info" @click="forget">忘记
            </el-button>
        </el-form>

        <el-dialog
            title="重置密码"
            :visible.sync="dialogVisible"
            width="30%"
            :modal="false"
        >
            <el-form :model="resetForm" :rules="resetRules" ref="resetForm">
                <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="resetForm.newPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="resetForm.confirmPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮件地址" prop="email">
                    <el-input v-model="resetForm.email" type="email"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitResetForm" style="display: flex;justify-content: center">
                        提交
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>

</template>

<script>
import {login} from '../api'
import Cookie from 'js-cookie'

export default {
    data() {
        return {
            dialogVisible: false,
            form: {
                userName: '',
                userPassword: ''
            },
            resetForm: {
                newPassword: '',
                confirmPassword: '',
                email: ''
            },
            rules: {
                userName: [
                    {required: true, trigger: 'blur', message: '请输入用户名'}
                ],
                userPassword: [
                    {required: true, trigger: 'blur', message: '请输入密码'}
                ],
            },
            resetRules: {
                newPassword: [
                    {required: true, trigger: 'blur', message: '请输入新密码'}
                ],
                confirmPassword: [
                    {required: true, trigger: 'blur', message: '请确认新密码', validator: this.matchPassword}
                ],
                email: [
                    {required: true, trigger: 'blur', message: '请输入邮件地址'},
                    {type: 'email', message: '请输入有效的邮件地址', trigger: ['blur', 'change']}
                ]
            }
        };
    },
    methods: {
        forget() {
            this.$message.error("请联系学校管理员:2933203540@qq.com")
        },
        submit() {
            //token
            //将token信息存入cookie 用于不同页面的通信
            this.$refs.form.validate((valid) => {
                if (valid) {
                    login(this.form).then(({data}) => {
                        console.log(data)
                        if (data.code === 200) {
                            //保存token信息
                            Cookie.set('token', data.token)

                            //获取菜单数据
                            //data.data.menuDataList
                            this.$store.commit('setMenu', data.data.menuDataList)
                            this.$store.commit('addMenu', this.$router)
                            //保存用户信息
                            this.$session.set('userInfo', data.data)
                            this.$message({
                                message: '登录成功',
                                type: 'success'
                            });
                            this.$router.push('/home')
                        } else if (data.code === 500) {
                            this.$message.error(data.msg)
                        } else if (data.code === 1000) {
                            this.dialogVisible = true;
                        }
                    })
                }
            })
        },
        submitResetForm() {
            this.$refs.resetForm.validate((valid) => {
                if (valid) {
                    // 在这里执行重置密码的逻辑
                    console.log('重置密码表单数据:', this.resetForm);
                    // 重置成功后
                    this.dialogVisible = false;
                }
            });
        },
        matchPassword(rule, value, callback) {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.resetForm.newPassword) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        }
    }
}
</script>

<style lang="less" scoped>
#login {
    background: url("../assets/images/background3.jpg");
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
}

.login-container {
    width: 500px;
    margin: 260px auto;
    border: 1px solid #eaeaea;
    padding: 35px 35px 15px 35px;
    background-color: rgba(34, 34, 34, 0.5);
    border-radius: 15px;
    box-shadow: 0 0 25px #cac6c6;
    box-sizing: border-box;

    .login_title {
        text-align: center;
        margin-bottom: 40px;
        margin-left: 9px;
        font-size: 30px;
        color: white;
    }

    .el-input {
        width: 300px;
    }
}
</style>
