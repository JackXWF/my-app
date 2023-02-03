<template>
    <div id="login">
        <el-form label-width="70px" class="login-container" :model="form" :rules="rules" :inline="true">
            <h3 class="login_title">系统登录</h3>
            <el-form-item label="用户名" prop="username" >
                <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" >
                <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-button style="margin-left: 115px;margin-top: 10px" type="primary">登录</el-button>
        </el-form>
    </div>

</template>

<script>
export default {
    data() {
        return {
            form: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    {required: true, trigger: 'blur', message: '请输入用户名'}
                ],
                password: [
                    {required: true, trigger: 'blur', message: '请输入密码'}
                ],
            }

        }
    }
}
</script>

<style lang="less" scoped>
#login{
    background: url("../assets/images/login_background.png");
    width:100%;
    height:100%;
    position:fixed;
    background-size:100% 100%;
}
.login-container {
    width: 350px;
    margin: 180px auto;
    border: 1px solid #eaeaea;
    padding: 35px 35px 15px 35px;
    background-color: rgba(34,34,34,0.9);
    border-radius: 15px;
    box-shadow: 0 0 25px #cac6c6;
    box-sizing: border-box;

    .login_title{
        text-align: center;
        margin-bottom: 40px;
        color: white;
    }
    .el-input{
        width: 198px;
    }
}
</style>
