<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
            <el-form-item label="楼号" :prop="'params.id'">
                <el-select v-model="queryParams.params.id" placeholder="请选择楼号" clearable
                           :style="{width: '100%'}">
                    <el-option v-for="(item, index) in buildNumList" :key="index" :label="item.buildName"
                               :value="item.id" :disabled="item.disabled"></el-option>
                </el-select>
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
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                >导出
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>


        <el-table :data="buildList" @selection-change="handleSelectionChange" height="450">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="编号" align="center" prop="id"/>
            <el-table-column label="楼名" align="center" prop="buildName"/>
            <el-table-column label="类型" align="center" prop="flag"/>
            <el-table-column label="图片" align="center" prop="buildImage">
                <template slot-scope="scope">
                    <el-image style="width: 100px;height: 100px" :src="scope.row.buildImage"/>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                    >修改
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                    >删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination class="stu-pagination"
                    v-show="total>0"
                    :total="total"
                    :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize"
                    @pagination="getList"
        />

        <!-- 添加或修改楼信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="楼号" prop="id">
                    <el-input oninput="if(value.length>3)value=value.slice(0,3)" v-model="form.id"
                              :disabled="disabled" type="number" placeholder="请输入楼号"/>
                </el-form-item>
                <el-form-item label="楼名" prop="buildName">
                    <el-input v-model="form.buildName" :disabled="true"/>
                </el-form-item>
                <el-form-item label="类型" prop="flag">
                    <el-select v-model="form.flag" placeholder="请选择宿舍类型" clearable
                               :style="{width: '100%'}">
                        <el-option v-for="(item, index) in flagSelect" :key="index" :label="item.label"
                                   :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="图片" prop="buildImage">
                    <el-upload
                        class="avatar-uploader"
                        :action="urlPath"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
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
import {exportBcgl} from "@/api";
import {buildList, queryList, add, update, deleteBuild} from "@/api/dormitory/dormitory";
import Vue from "vue";

export default {
    name: "Student",
    data() {
        return {
            urlPath: '',
            imageName: '',
            disabled: false,
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            flag: '',
            imageUrl: '',
            imageUrlList: [],
            // 学生信息表格数据
            buildList: [],
            //楼列表
            buildNumList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            rules: {
                id: [{
                    required: true,
                    message: '请输入楼号',
                    trigger: 'blur'
                }],
                flag: [{
                    required: true,
                    message: '请选择宿舍类型',
                    trigger: 'change'
                }],
            },
            open: false,
            flagSelect: [{
                "label": "男生宿舍",
                "value": 1
            }, {
                "label": "女生宿舍",
                "value": 0
            }],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                params: {
                    id: ''
                }
            },
            // 表单参数
            form: {
                id: '',
                buildName: '',
                flag: '',
            },

        };
    },
    watch: {
        'form.id': {
            handler() {
                if (this.form.id === null) {
                    this.form.buildName = ''
                } else {
                    this.form.buildName = this.form.id + '号楼'
                }

            }
        }
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
            buildList().then(response => {

                if (response.data.data === null) {
                    this.buildList = null
                }

                this.buildNumList = response.data.data

            });

            queryList(this.queryParams).then(response => {
                console.log(this.queryParams, "参数")


                console.log(response.data, "返回")
                if (response.data.data === null) {
                    this.buildList = null
                }
                this.total = response.data.data.total
                this.buildList = response.data.data.resultList

                this.buildList.forEach(i => {
                    if (i.flag === '1') {
                        i.flag = '男生宿舍楼'
                    } else {
                        i.flag = '女生宿舍楼'
                    }
                })

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
                id: null,
                buildName: null,
                buildImage: null
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
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.stunumber)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.flag = 1;
            this.open = true;
            this.title = "添加宿舍楼";

        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.flag = 0;
            this.reset();
            const stunumber = row.stunumber || this.ids
            this.title = "修改宿舍楼信息"
            this.form.id = row.id
            this.form.buildName = row.buildName
            this.imageUrl = row.buildImage
            this.disabled = true
            this.open = true;

        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.flag === 1) {
                        this.form.buildImage = this.imageName;
                        console.log(this.form, "表单")
                        add(this.form).then(response => {
                            if (response.data.code === 200) {
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.open = false;
                                this.getList();
                            } else {
                                this.$message.error('新增失败,该宿舍楼已存在!')
                            }

                        });
                    } else if (this.flag === 0) {
                        //更新
                        this.form.buildImage = this.imageName
                        update(this.form).then(response => {
                            if (response.data.code === 200) {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.open = false;
                                this.getList();
                            } else {
                                this.$message.error('修改失败')
                            }

                        });


                    }


                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {

            const buildId = row.id

            console.log(buildId, "删除")

            this.$confirm('是否确认楼号"' + buildId + '"的宿舍楼信息？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                return deleteBuild(buildId);
            }).then(data => {
                if (data.data.code === 200) {
                    this.getList();
                    this.$message.success('删除成功')
                } else {
                    this.getList();
                    this.$message.error("该宿舍楼里住有学生,不能删除!")
                }

            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出所有数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return exportBcgl(queryParams);
                })
                .then((response) => {
                    this.download(response.msg);
                })
                .catch(function () {
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
                        this.urlPath = 'http://localhost:8082/building/uploadPhoto';
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
;
</script>

<style lang="less" scoped>
.stu-pagination {
    display: flex;
    justify-content: right;

}

/*去除input上下添加*/
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
}

::v-deep input[type='number'] {
    -moz-appearance: textfield !important;
}


.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

