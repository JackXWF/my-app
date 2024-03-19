<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
            <el-form-item label="工号" :prop="'params.stunumber'">
                <el-input
                    type="number"
                    v-model="queryParams.params.userName"
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
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>


        <el-table :data="studentList" @selection-change="handleSelectionChange" height="450">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="工号" align="center" prop="userName"/>
            <el-table-column label="姓名" align="center" prop="name"/>
            <el-table-column label="角色" align="center" prop="userRole"/>
            <el-table-column label="性别" align="center" prop="gender"/>
            <el-table-column label="状态" align="center" prop="state"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                    >启用
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDisable(scope.row)"
                    >停用
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
    userList,
    enable,
    disable
} from "@/api";
import {dormitoryList, allocation} from "@/api/dormitory/dormitory";

export default {
    name: "Student",
    data() {
        return {

            disabled: false,
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
                    userName: '',
                    name: ''
                }
            },
            // 表单参数
            form: {},
        };
    },
    created() {
        this.getList();
    },
    methods: {

        getList() {


            console.log(this.queryParams, "参数")

            userList(this.queryParams).then(response => {
                console.log(response.data, "返回")
                if (response.data.data === null) {
                    this.studentList = null
                }

                this.total = response.data.data.total

                const changeDate = response.data.data.resultList

                changeDate.forEach(e=>{
                    if(e.userRole == '0'){
                        e.userRole = "系统管理员"
                    }
                    if(e.userRole == '1'){
                        e.userRole = "宿舍管理员"
                    }

                    if(e.userRole == '2'){
                        e.userRole = "食堂管理员"
                    }

                    if(e.userRole == '4'){
                        e.userRole = "学生"
                    }

                    if(e.userRole == '6'){
                        e.userRole = "维修员工"
                    }

                })

                this.studentList = response.data.data.resultList


            });

            /*  dormitoryList().then(response => {
                  this.dormitoryList = response.data.data
                  console.log(this.dormitoryList, "宿舍列表")
              })*/
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                stunumber: null,
                name: null,
                build: null,
                gender: null,
                college: null,
                grade: null
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

        /** 修改按钮操作 */
        handleUpdate(row) {
            console.log(row.id, "空间看看看看")
            enable(row.id).then(r => {
                if (r.data.code === 200) {
                    this.$message.success("启用成功")
                }
            })

            this.getList()
        },
        handleDisable(row) {
            disable(row.id).then(r => {
                if (r.data.code === 200) {
                    this.$message.error("已停用")
                }
            })
            this.getList()
        }
    },


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

