<template>
    <div>
        <el-card>
            <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
                <el-form-item label="角色" prop="userRole">
                    <el-select v-model="formData.userRole" placeholder="请择选角色" clearable :style="{width: '100%'}">
                        <el-option v-for="(item, index) in roleOptions" :key="index" :label="item.label"
                                   :value="item.value"
                                   :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号" prop="userName">
                    <el-input type="number" v-model="formData.userName" placeholder="请输入账号" :maxlength="11"
                              show-word-limit clearable
                              prefix-icon='el-icon-user' :style="{width: '100%'}"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入姓名" :maxlength="11" show-word-limit clearable
                              prefix-icon='el-icon-user' :style="{width: '100%'}"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="formData.phone" placeholder="请输入手机号" :maxlength="11" show-word-limit
                              clearable
                              prefix-icon='el-icon-mobile' :style="{width: '100%'}"></el-input>
                </el-form-item>
                <el-form-item label="维修工类型" prop="type" v-if="eFlag">
                    <el-select v-model="formData.type" placeholder="请选择维修工类型" clearable
                               :style="{width: '100%'}">
                        <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.label"
                                   :value="item.value"
                                   :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="formData.gender" size="medium">
                        <el-radio v-for="(item, index) in genderOptions" :key="index" :label="item.value"
                                  :disabled="item.disabled">{{ item.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item size="large">
                    <el-button type="primary" @click="submitForm">提交</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

    </div>
</template>
<script>
import {addUser} from "@/api";

export default {
    components: {},
    props: [],
    data() {
        return {
            flag: 'false',
            eFlag: false,
            formData: {
                userRole: undefined,
                phone: '',
                gender: 1,
                userName: '',
                name: '',
                type: ''
            },
            rules: {
                userRole: [{
                    required: true,
                    message: '请择选角色',
                    trigger: 'change'
                }],
                phone: [{
                    required: true,
                    message: '请输入手机号',
                    trigger: 'blur'
                }, {
                    pattern: /^1(3|4|5|7|8|9)\d{9}$/,
                    message: '手机号格式错误',
                    trigger: 'blur'
                }],
                gender: [{
                    required: true,
                    message: '性别不能为空',
                    trigger: 'change'
                }],
                userName: [{
                    required: true,
                    message: '账号不能为空',
                    trigger: 'blur'
                }],
                name: [{
                    required: true,
                    message: '姓名不能为空',
                    trigger: 'blur'
                }],
                eType: [{
                    required: true,
                    message: '请选择维修工类型',
                    trigger: 'change'
                }],
            },
            roleOptions: [{
                "label": "系统管理员",
                "value": 0
            }, {
                "label": "宿舍管理员",
                "value": 1
            }, {
                "label": "食堂管理员",
                "value": 2
            }, {
                "label": "维修工人",
                "value": 6
            }

            ],
            typeOptions: [{
                "label": "基础维修工",
                "value": "基础维修工"
            }, {
                "label": "电器维修工",
                "value": "电器维修工"
            }, {
                "label": "机房维修工",
                "value": "机房维修工"
            }],
            genderOptions: [{
                "label": "男",
                "value": 1
            }, {
                "label": "女",
                "value": 0
            }],
        }
    },
    computed: {},
    watch: {
        'formData.userRole':{
            handler(){
                if(this.formData.userRole === 6){
                    this.eFlag = true
                }
            }
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        submitForm() {
            this.$refs['elForm'].validate(valid => {
                if (!valid) return
                // TODO 提交表单
                console.log(this.formData, "购买了时间")
                addUser(this.formData).then(r => {
                    console.log(r, "jngdai")
                    if (r.data.code === 200) {
                        this.$message.success("添加成功!")
                        this.resetForm();
                        this.eFlag = false
                    } else {
                        this.$message.error("添加失败,该用户已存在!")
                    }
                })
            })
        },
        resetForm() {
            this.$refs['elForm'].resetFields()
        },
    }
}

</script>
<style>
</style>
