<template>
    <div id="login">
        <el-form ref="form" label-width="70px" class="login-container" :model="form" :rules="rules" :inline="true">
            <h3 class="login_title">系统登录</h3>
            <el-form-item label="用户名" prop="userName">
                <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="userPassword">
                <el-input v-model="form.userPassword" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-button style="margin-left: 115px;margin-top: 10px" type="primary" @click="submit">登录</el-button>
        </el-form>
    </div>

</template>

<script>
import {login} from '../api'
import Cookie from 'js-cookie'

export default {
    data() {
        return {
            form: {
                userName: '',
                userPassword: ''
            },
            rules: {
                userName: [
                    {required: true, trigger: 'blur', message: '请输入用户名'}
                ],
                userPassword: [
                    {required: true, trigger: 'blur', message: '请输入密码'}
                ],
            }

        }
    },
    methods: {
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
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }
            })


        }
    }
}
</script>

<style lang="less" scoped>
#login {
    background: url("../assets/images/login_background.png");
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
}

.login-container {
    width: 350px;
    margin: 260px auto;
    border: 1px solid #eaeaea;
    padding: 35px 35px 15px 35px;
    background-color: rgba(34, 34, 34, 0.9);
    border-radius: 15px;
    box-shadow: 0 0 25px #cac6c6;
    box-sizing: border-box;

    .login_title {
        text-align: center;
        margin-bottom: 40px;
        color: white;
    }

    .el-input {
        width: 198px;
    }
}
</style>
