<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
            <el-form-item label="物品描述" :prop="'params.descr'">
                <el-input
                    v-model="queryParams.params.descr"
                    placeholder="请输入物品描述"

                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="丢失位置" :prop="'params.address'">
                <el-input
                    v-model="queryParams.params.address"
                    placeholder="请输入丢失位置"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd()"
                >新增
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>


        <el-table :data="articlesList" @selection-change="handleSelectionChange" height="450">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="序号" type="index" align="center"/>
            <el-table-column label="物品描述" align="center" prop="descr"/>
            <el-table-column label="捡到位置" align="center" prop="address"/>
            <el-table-column label="图片" align="center" prop="image">
                <template slot-scope="scope">
                    <el-image style="width: 100px;height: 100px" :src="scope.row.image"/>
                </template>
            </el-table-column>
            <el-table-column label="拾到人" align="center" prop="pickUser"/>
            <el-table-column label="联系电话" align="center" prop="pickPhone"/>
            <el-table-column label="拾到时间" align="center" prop="pickTime"/>
            <el-table-column label="添加时间" align="center" prop="addtime"/>
        </el-table>

        <pagination class="stu-pagination"
                    v-show="total>0"
                    :total="total"
                    :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize"
                    @pagination="getList"
        />


        <el-dialog :title="title" :visible.sync="open" width="500px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="拾到人" prop="pickUser">
                    <el-input v-model="form.pickUser"
                              placeholder="请输入姓名" :disabled="true" clearable/>
                </el-form-item>
                <el-form-item label="联系电话" prop="pickPhone">
                    <el-input v-model="form.pickPhone"
                              placeholder="请输入联系电话" clearable/>
                </el-form-item>
                <el-form-item label="物品描述" prop="descr">
                    <el-input type="textarea" v-model="form.descr" :rows="2" placeholder="请输入描述"/>
                </el-form-item>
                <el-form-item label="捡到地点" prop="address">
                    <el-input v-model="form.address"
                              placeholder="请输入捡到地点" clearable/>
                </el-form-item>
                <el-form-item label="图片" prop="image">
                    <el-upload
                        class="avatar-uploader"
                        :action="urlPath"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" width="150px" height="150px">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="捡到时间" prop="pickTime">
                    <div class="block">
                        <el-date-picker
                            v-model="form.pickTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            align="right"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </div>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>

import {add,list} from "@/api/articles/articles";

export default {
    name: "Student",
    data() {
        return {
            roleIdentity: true,
            urlPath: '',
            imageUrl: '',
            imageUrlList: [],
            imageName: '',
            disabled: false,
            roleName: '',
            //角色
            role: '',
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            names: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            //菜品类型列表
            articlesList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                params: {
                    descr: '',
                    address: ''
                }
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                pickUser: [{
                    required: true,
                    message: '请输入姓名',
                    trigger: 'blur'
                }],
                pickPhone: [{
                    required: true,
                    message: '请输入手机号',
                    trigger: 'blur'
                }, {
                    pattern: /^1(3|4|5|7|8|9)\d{9}$/,
                    message: '手机号格式错误',
                    trigger: 'blur'
                }],
                address: [{
                    required: true,
                    message: '请输入捡到地点',
                    trigger: 'blur'
                }],
                descr: [{
                    required: true,
                    message: '请输入物品描述',
                    trigger: 'blur'
                }],
                pickTime: [{
                    required: true,
                    message: '请选择日期选择',
                    trigger: 'change'
                }],
            },
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {
                });
        },

        getList() {
            this.roleName = this.$session.get('userInfo').userName


            console.log(this.queryParams,"了很快改变")
            list(this.queryParams).then(response=>{
                console.log(response,"尽管当时天津海关")
                if(response.data.data === null){
                    this.articlesList = null;
                }

                this.articlesList = response.data.data.resultList
                this.total = response.data.data.total
            })


        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                pickUser: null,
                pickPhone: null,
                address: '',
                pickTime: null,
                descr: null,
                image: null

            };
            this.imageUrl = null;
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.form.pickUser = this.roleName
            this.title = "添加丢失物品信息";

        },
        /** 提交按钮 */
        submitForm() {

            console.log(this.form, "信息")
            this.form.image = this.imageName
            this.form.pickTime = this.formatLongDate(this.form.pickTime)
            add(this.form).then(response => {
                if (response.data.code === 200) {
                    this.$message({
                        message: '新增成功',
                        type: 'success'
                    });
                    this.open = false;
                    this.getList();
                } else {
                    this.$message.error("该菜品已存在,请勿重复添加!")
                }

            });


        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.imageName = res.data;
            console.log(res.data, "显示")
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (isJPG) {
                return new Promise((resolve) => {
                    this.$nextTick(() => {
                        this.urlPath = 'http://localhost:8089/articles/uploadPhoto';
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
        },
        formatLongDate (date) {
            let myyear = date.getFullYear();
            let mymonth = date.getMonth() + 1;
            let myweekday = date.getDate();
            let myHour = date.getHours();
            let myMin = date.getMinutes();
            let mySec = date.getSeconds();

            if (mymonth < 10) {
                mymonth = '0' + mymonth;
            }
            if (myweekday < 10) {
                myweekday = '0' + myweekday;
            }
            if (myHour < 10) {
                myHour = '0' + myHour;
            }
            if (myMin < 10) {
                myMin = '0' + myMin;
            }
            if (mySec < 10) {
                mySec = '0' + mySec;
            }
            return (myyear + '-' + mymonth + '-' + myweekday + ' ' + myHour + ':' + myMin + ':' + mySec);
        },

    }
}
;
</script>

<style lang="less" scoped>
.stu-pagination {
    display: flex;
    justify-content: right;

}

::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
}

::v-deep input[type='number'] {
    -moz-appearance: textfield !important;
}
</style>

