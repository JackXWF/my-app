<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
            <el-form-item label="类型" :prop="'params.type'">
                <el-input
                    v-model="queryParams.params.type"
                    placeholder="请输入菜品类型"
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


        <el-table :data="typeList" @selection-change="handleSelectionChange" height="450">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="序号" type="index" align="center" />
            <el-table-column label="编号" align="center" prop="id" v-if="false"/>
            <el-table-column label="类型" align="center" prop="type"/>
            <el-table-column label="添加者" align="center" prop="addUser"/>
            <el-table-column label="添加时间" align="center" prop="addTime" />
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
                <el-form-item label="类型" prop="type">
                    <el-input v-model="form.type" placeholder="请输入菜品类型"/>
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
import {getStudentList, addStudent, updateStudent, removeStudent, exportBcgl} from "@/api";
import {dormitoryList, buildList, queryList, add, update, deleteBuild} from "@/api/dormitory/dormitory";
import {addDishType,dishTypeList,updateDishType,deleteDishType} from "@/api/canteen/canteen";


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
            //菜品类型列表
            typeList: [],
            //楼列表
            buildNumList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                params: {
                    type: ''
                }
            },
            // 表单参数
            form: {
                id: '',
                type: ''
            },
            // 表单校验
            rules: {},
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
            dishTypeList(this.queryParams).then(response => {

                console.log(response.data.data ,"菜品类型")
                if (response.data.data === null) {
                    this.typeList = null
                }

                this.typeList = response.data.data.resultList

                this.total =  response.data.data.total

            });

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
                type: null
            };
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
            this.title = "添加菜品类型";

        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.flag = 0;
            this.reset();
            const typeId = row.id || this.ids
            this.title = "修改菜品类型"
            console.log(row,"行")
            this.form.type = row.type
            this.form.id = row.id
            this.disabled = true
            this.open = true;

        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.flag === 1) {
                        const user = this.$session.get('userInfo').userName;
                        this.form.addUser = user;
                        console.log(this.form, "表单")
                        addDishType(this.form).then(response => {
                            if (response.data.code === 200) {
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.open = false;
                                this.getList();
                            } else {
                                this.$message.error('新增失败,该菜品类型已存在!')
                            }

                        });
                    } else if (this.flag === 0) {
                        //更新
                        updateDishType(this.form).then(response => {
                            if (response.data.code === 200) {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.open = false;
                                this.getList();
                            } else {
                                this.$message.error('修改失败,该类型已存在')
                            }

                        });


                    }


                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {

            const typeId = row.id
            console.log(typeId, "删除")

            this.$confirm('是否删除"' + row.type + '"的类型？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                return deleteDishType(typeId);
            }).then(data => {
                if (data.data.code === 200) {
                    this.getList();
                    this.$message.success('删除成功')
                } else {
                    this.getList();
                    this.$message.error("该类型下面有菜品存在,不能删除!")
                }

            }).catch(() => {
            });
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

