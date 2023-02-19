<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h1>填写报修信息</h1>
            </div>
            <div>
                <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px"
                         label-position="left">
                    <el-form-item label="报修人" prop="initUser">
                        <el-input v-model="formData.initUser" placeholder="请输入报修人" :maxlength="20" clearable
                                  prefix-icon='el-icon-user' :style="{width: '100%'}"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="initPhone">
                        <el-input v-model="formData.initPhone" placeholder="请输入联系电话" :maxlength="11" show-word-limit
                                  clearable
                                  prefix-icon='el-icon-mobile' :style="{width: '100%'}"></el-input>
                    </el-form-item>
                    <el-form-item label="故障地点" prop="address">
                        <el-input v-model="formData.address" placeholder="请输入故障地点" clearable
                                  prefix-icon='el-icon-office-building' :style="{width: '100%'}"></el-input>
                    </el-form-item>
                    <el-form-item label="故障图片" prop="images">
                        <el-upload
                            ref="pictureUpload"
                            :action="urlPath"
                            list-type="picture-card"
                            :show-file-list="true"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <i slot="default" class="el-icon-plus"></i>
                            <div slot="file" slot-scope="{file}">
                                <img
                                    class="el-upload-list__item-thumbnail"
                                    :src="file.url" alt=""
                                >
                                <span class="el-upload-list__item-actions">
                                  <span
                                      class="el-upload-list__item-preview"
                                      @click="handlePictureCardPreview(file)"
                                  >
                                    <i class="el-icon-zoom-in"></i>
                                  </span>
                                  <span
                                      v-if="!disabled"
                                      class="el-upload-list__item-delete"
                                      @click="handleRemove(file)"
                                  >
                                    <i class="el-icon-delete"></i>
                                  </span>
                                </span>
                            </div>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="故障描述" prop="descr">
                        <el-input v-model="formData.descr" type="textarea" placeholder="请输入故障描述" :maxlength="500"
                                  show-word-limit :autosize="{minRows: 4, maxRows: 4}"
                                  :style="{width: '100%'}"></el-input>
                    </el-form-item>

                    <div style="display: flex; justify-content: center">
                        <el-button type="primary" @click="submitForm">提交</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </div>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
import {addOrders} from "@/api/repairs/repairs";


export default {
    components: {},
    props: [],
    data() {
        return {
            urlPath: '',
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            imageUrl: '',
            imageList: [],
            formData: {
                initUser: '',
                initPhone: '',
                address: undefined,
                images: [],
                descr: '',
            },
            rules: {
                initUser: [{
                    required: true,
                    message: '请输入报修人',
                    trigger: 'blur'
                }],
                initPhone: [{
                    required: true,
                    message: '请输入联系电话',
                    trigger: 'blur'
                }, {
                    pattern: /^1(3|4|5|7|8|9)\d{9}$/,
                    message: '手机号格式错误',
                    trigger: 'blur'
                }],
                address: [{
                    required: true,
                    message: '请输入故障地点',
                    trigger: 'blur'
                }],
                descr: [{
                    required: true,
                    message: '请输入故障描述',
                    trigger: 'blur'
                }],
            },
        }
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {
        submitForm() {
            this.$refs['elForm'].validate(valid => {
                if (!valid) return
                // TODO 提交表单
                addOrders(this.formData).then(response => {
                    if(response.data.code === 200){
                        this.$message({
                            message: '报修成功',
                            type: 'success'
                        });
                        setTimeout( () => {
                            this.$router.go(0);
                        },500);
                    }
                })

            })
        },

        resetForm() {
            this.$refs['elForm'].resetFields()
        },
        handleRemove(file) {
            let uploadFiles = this.$refs.pictureUpload.uploadFiles
            for (let i = 0; i < uploadFiles.length; i++) {
                if (uploadFiles[i]['url'] == file.url) {
                    uploadFiles.splice(i, 1)
                    this.formData.images.splice(i,1)
                }
            }
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;

        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.imageName = res.data;
            this.formData.images.push(res.data)
            console.log(this.formData.image, "显示")
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (isJPG) {
                return new Promise((resolve) => {
                    this.$nextTick(() => {
                        this.urlPath = 'http://localhost:8088/repairs/uploadPhoto';
                        resolve();
                    })
                })
            }

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 或 Png 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    }
}

</script>
<style>
</style>
