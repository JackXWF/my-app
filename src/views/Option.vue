<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
            <el-form-item label="学号" :prop="'params.stunumber'">
                <el-input
                    type="number"
                    v-model="queryParams.params.stunumber"
                    placeholder="请输入学号"
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
                    v-if="checkFlag"
                    @click="handleCheck"
                >通过
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    v-if="checkFlag"
                    @click="handleDelete"
                >驳回
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="success"
                    plain
                    v-if="confirmFlag"
                    icon="el-icon-upload2"
                    size="mini"
                    @click="handleConfirm"
                >通过
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="success"
                    plain
                    v-if="confirmFlag"
                    icon="el-icon-upload2"
                    size="mini"
                    @click="handleNotConfirm"
                >驳回
                </el-button>
            </el-col>

            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>


        <el-table :data="studentList" @selection-change="handleSelectionChange" height="450">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="学号" align="center" prop="stunumber"/>
            <el-table-column label="姓名" align="center" prop="name"/>
            <el-table-column label="学院" align="center" prop="college"/>
            <el-table-column label="班级" align="center" prop="grade"/>
            <el-table-column label="宿舍" align="center" prop="dormitory"/>
            <el-table-column label="申请原因" align="center" prop="reason"/>
            <el-table-column label="性别" align="center" prop="gender"/>
            <el-table-column label="审核人" align="center" prop="checkName"/>
            <el-table-column label="确认人" align="center" prop="confirmName"/>
            <el-table-column label="状态" align="center" prop="state"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        v-if="checkFlag"
                        @click="handleCheck(scope.row)"
                        v-hasPermi="['student:student:edit']"
                    >通过
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        v-if="checkFlag"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['student:student:remove']"
                    >不通过
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        v-if="confirmFlag"
                        @click="handleConfirm(scope.row)"
                        v-hasPermi="['student:student:edit']"
                    >同意
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        v-if="confirmFlag"
                        icon="el-icon-delete"
                        @click="handleNotConfirm(scope.row)"
                        v-hasPermi="['student:student:remove']"
                    >不同意
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


    </div>

</template>

<script>
import {
    getStudentList,
    addStudent,
    updateStudent,
    removeStudent,
    exportStudent,
} from "@/api";
import {dormitoryList, allocation, checkList, confirm, check} from "@/api/dormitory/dormitory";

export default {
    name: "Student",
    data() {
        return {
            cFlag: '',
            disFlag: false,
            excelUrl: '',
            disabled: false,
            confirmFlag: false,
            checkFlag: false,
            // 遮罩层
            loading: true,
            roleFlog: true,
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
            // 学生信息表格数据
            studentList: [],
            //学生宿舍列表
            dormitoryList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            openExcel: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                params: {
                    stunumber: '',
                }
            },
            // 表单参数
            value: {
                studentList: [],
                flag: '',
                checkId: '',
                confirmId: ''
            },
            role: ''

        };
    },
    created() {
        const role = this.$session.get('userInfo').userRole
        this.role = this.$session.get('userInfo')
        if (role === '0') {
            this.roleFlog = false
            this.confirmFlag = true
        }

        if (role === '1') {
            this.checkFlag = true
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
            checkList(this.queryParams).then(response => {
                console.log(response.data, "看就看")

                // 如果 response.data.data 为 null，直接返回
                if (!response.data.data) {
                    this.studentList = [];
                    this.total = 0;
                    return;
                }

                this.total = response.data.data.total;

                const gender = response.data.data.resultList;
                gender.forEach(item => {
                    if (item.gender == 1) {
                        item.gender = '男';
                    } else {
                        item.gender = '女';
                    }
                });

                this.studentList = gender;
                console.log(this.studentList, "列表");

                console.log(this.role, "江河湖海");

                const list = [];

                this.studentList.forEach(i => {
                    if (this.role.userRole === '0') {
                        if (i.state === 1) {
                            list.push(i);
                        }
                    }

                    if (this.role.userRole === '1') {
                        if (i.state === 0) {
                            list.push(i);
                        }
                    }

                    if (this.role.userRole === '4') {
                        if (i.stunumber == this.role.userName) {
                            list.push(i);
                        }
                    }
                });

                list.forEach(i => {
                    if (i.state === 0) {
                        i.state = '未审核';
                    }

                    if (i.state === 1) {
                        i.state = '待系统管理员审核';
                    }

                    if (i.state === 2) {
                        i.state = '已通过';
                    }

                    if (i.state === 3) {
                        i.state = '未通过';
                    }

                    if (i.dormitory == '0') {
                        i.dormitory = '暂未分配';
                    }
                });

                this.studentList = list;
                console.log(this.studentList, "列表dd");
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置

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


        handleDelete(row) {
            const stuNumbers = row.stunumber || this.ids;

            if (this.ids.length > 0) {
                this.value.studentList = stuNumbers
            } else {
                this.value.studentList.push(stuNumbers)
            }


            this.value.flag = 0


            this.value.checkId = this.role.userName


            console.log(this.value, "啦啦啦帆帆帆帆")
            check(this.value).then(r => {

                if (r.data.code === 200) {
                    this.$message.error("已驳回申请")
                }
            })

            this.getList()
        },
        handleCheck(row) {
            const stuNumbers = row.stunumber || this.ids;

            console.log(stuNumbers, "fjngkdsfjkgsn")

            if (this.ids.length > 0) {
                this.value.studentList = stuNumbers
            } else {
                this.value.studentList.push(stuNumbers)
            }


            this.value.flag = 1


            this.value.checkId = this.role.userName


            console.log(this.value, "啦啦啦ffff")
            check(this.value).then(r => {

                if (r.data.code === 200) {
                    this.$message.success("审批成功，等待系统管理员确认")
                }
            })

            this.getList();
        },
        handleNotConfirm(row) {
            const stuNumbers = row.stunumber || this.ids;

            if (this.ids.length > 0) {
                this.value.studentList = stuNumbers
            } else {
                this.value.studentList.push(stuNumbers)
            }


            this.value.flag = 0


            this.value.confirmId = this.role.userName


            console.log(this.value, "啦啦啦帆帆帆帆")
            confirm(this.value).then(r => {

                if (r.data.code === 200) {
                    this.$message.error("已驳回申请")
                }
            })

            this.getList()
        },
        handleConfirm(row) {
            const stuNumbers = row.stunumber || this.ids;

            console.log(stuNumbers, "fjngkdsfjkgsn")

            if (this.ids.length > 0) {
                this.value.studentList = stuNumbers
            } else {
                this.value.studentList.push(stuNumbers)
            }


            this.value.flag = 1


            this.value.confirmId = this.role.userName


            console.log(this.value, "啦啦啦ffff")
            confirm(this.value).then(r => {

                if (r.data.code === 200) {
                    this.$message.success("已通过")
                }
            })

            this.getList();
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

