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
    </div>

</template>

<script>
import {login} from '../api'
import Cookie from 'js-cookie'

export default {
    data() {
        return {
            flag: 0,
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
                        } else {
                            this.flag++;
                            if (this.flag >= 3) {
                                this.$message.error("您输入密码已错误超过三次,如忘记密码请联系管理员:2933203540@qq.com")
                            } else {
                                this.$message.error(data.msg)
                            }

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
    background: url("../assets/images/background.jpg");
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
