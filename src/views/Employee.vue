<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
            <el-form-item label="工号" :prop="'params.id'">
                <el-input
                    type="number"
                    v-model="queryParams.params.id"
                    placeholder="请输入工号"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="姓名" :prop="'params.name'">
                <el-input
                    v-model="queryParams.params.name"
                    placeholder="请输入姓名"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="电话" :prop="'params.phone'">
                <el-input
                    v-model="queryParams.params.phone"
                    placeholder="请输入电话"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="性别" :prop="'params.gender'">
                <el-select v-model="queryParams.params.gender" placeholder="请选择性别" clearable
                           :style="{width: '100%'}">
                    <el-option v-for="(item, index) in genderSelect" :key="index" :label="item.label"
                               :value="item.value" :disabled="item.disabled"></el-option>
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
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                >删除
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="success"
                    plain
                    :disabled="roleFlog"
                    icon="el-icon-upload2"
                    size="mini"
                    @click="handleImport"
                >导入
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    :disabled="roleFlog"
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                >导出
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>


        <el-table :data="employeeList" @selection-change="handleSelectionChange" height="450">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="工号" align="center" prop="id"/>
            <el-table-column label="姓名" align="center" prop="name"/>
            <el-table-column label="电话" align="center" prop="phone"/>
            <el-table-column label="性别" align="center" prop="gender"/>
            <el-table-column label="备注" align="center" prop="descr"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['student:student:edit']"
                    >修改
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['student:student:remove']"
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

        <!-- 添加或修改学生信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <!--                <el-form-item label="工号" prop="id">
                                    <el-input v-model="form.id" :disabled="disabled" type="number"
                                              oninput="if(value.length>10)value=value.slice(0,10)" placeholder="请输入工号"/>
                                </el-form-item>-->
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" placeholder="请输入姓名"/>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input oninput="if(value.length>11)value=value.slice(0,11)" type="number" v-model="form.phone"
                              placeholder="请输入电话号码"/>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-select v-model="form.gender" placeholder="请选择性别" clearable
                               :style="{width: '100%'}">
                        <el-option v-for="(item, index) in genderSelect" :key="index" :label="item.label"
                                   :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="descr">
                    <el-input type="textarea" v-model="form.descr" :rows="2" placeholder="请输入备注"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!--上传excel-->
        <el-dialog title="导入excel" :visible.sync="openExcel" width="500px">
            <el-upload
                class="upload-demo"
                drag
                :action="excelUrl"
                :on-success="handleAvatarSuccess"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-dialog>
    </div>

</template>

<script>
import {getStudentList, addStudent, updateStudent, removeStudent, exportBcgl} from "@/api";
import {employeeList, add, update, removeEmployee, exportEmp} from "@/api/canteen/canteen";

export default {
    name: "Student",
    data() {
        return {
            roleFlog: true,
            excelUrl: '',
            openExcel: false,
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
            // 员工信息表格数据
            employeeList: [],
            //学生宿舍列表
            dormitoryList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                params: {
                    id: '',
                    name: '',
                    phone: '',
                    gender: ''
                }
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                id: [{
                    required: true,
                    message: '请输入工号',
                    trigger: 'blur'
                }],
                name: [{
                    required: true,
                    message: '请输入姓名',
                    trigger: 'blur'
                }],
                phone: [{
                    required: true,
                    message: '请输入电话号码',
                    trigger: 'blur'
                }],
                gender: [{
                    required: true,
                    message: '请选择性别',
                    trigger: 'change'
                }],
            },
            genderSelect: [{
                "label": "男",
                "value": 1
            }, {
                "label": "女",
                "value": 0
            }],
        };
    },
    created() {
        const role = this.$session.get('userInfo').userRole
        if (role === '0') {
            this.roleFlog = false
        }
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
        /** 查询学生信息列表 */
        getList() {


            if (this.queryParams.params.gender === '男') {
                this.queryParams.params.gender = '1'
            }

            if (this.queryParams.params.gender === '女') {
                this.queryParams.params.gender = '0'
            }

            console.log(this.queryParams, "参数")

            employeeList(this.queryParams).then(response => {
                console.log(response.data, "返回")
                if (response.data.data === null) {
                    this.employeeList = null
                }

                this.total = response.data.data.total

                const gender = response.data.data.resultList

                gender.forEach(item => {
                    if (item.gender == 1) {
                        item.gender = '男'
                    } else {
                        item.gender = '女'
                    }
                })

                this.employeeList = gender;
                console.log(this.employeeList, "列表")

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
                name: null,
                phone: null,
                gender: null,
                descr: null
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
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.flag = 1;
            this.open = true;
            this.title = "添加员工";

        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.flag = 0;
            this.reset();
            const stunumber = row.stunumber || this.ids
            this.title = "修改员工信息"
            this.form.id = row.id
            this.form.phone = row.phone
            this.form.gender = row.gender
            this.form.name = row.name
            this.form.descr = row.descr
            this.disabled = true
            this.open = true;

        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.flag === 1) {
                        add(this.form).then(response => {
                            if (response.data.code === 200) {
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.open = false;
                                this.getList();
                            } else {
                                this.$message.error("该员工已存在,请勿重复添加!")
                            }

                        });
                    } else if (this.flag === 0) {
                        //更新
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
            console.log(row, "删除")
            const stuNumbers = row.id || this.ids;
            this.$confirm('是否确认删除工号为"' + stuNumbers + '"的员工信息？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                return removeEmployee(stuNumbers);
            }).then(() => {
                this.getList();
                this.$message.success('删除成功')
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        /** 导出按钮操作 */
        handleExport() {
            exportEmp().then(r => {
                if (r.data.code === 200) {
                }
                this.$message.success("已成功导出到E盘!")
            })
        },
        handleImport() {
            this.openExcel = true
            this.excelUrl = "http://localhost:8085/employee/import"
        },
        handleAvatarSuccess() {
            this.$message.success("批量导入成功!");
            this.openExcel = false
            this.getList()
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

::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
}

::v-deep input[type='number'] {
    -moz-appearance: textfield !important;
}
</style>

