<template>
    <div class="manage">
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
        >
            <!--用户表单-->
            <el-form ref="form" :rules="rules" :model="form" label-width="80px" :inline="true">
                <el-form-item label="姓名" prop="name">
                    <el-input placeholder="请输入姓名" v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="年龄" prop="age">
                    <el-input placeholder="请输入年龄" v-model="form.age"></el-input>
                </el-form-item>

                <el-form-item label="性别" prop="sex">
                    <el-select v-model="form.sex" placeholder="请选择性别">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="出生日期" prop="birth">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.birth"
                    ></el-date-picker>
                </el-form-item>


            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="submit">确 定</el-button>
  </span>
        </el-dialog>
        <div class="manage-header">

            <div class="head-search">
                <el-button @click="handleAdd" type="primary">+ 新增</el-button>

                <div class="search">
                    <el-input v-model="input" placeholder="请输入内容" style="width: 130px"></el-input>
                    <el-button class="button" type="primary">搜索</el-button>
                </div>
            </div>

        </div>

        <el-table :data="tableData" style="width: 90%">
            <el-table-column v-for="(val, key) in tableLable" :prop="key" :label="val" width="180">
            </el-table-column>
            <el-table-column>
                <el-button type="danger" @click="handleDelete">删除</el-button>
                <el-button type="primary" @click="handleEdit">编辑</el-button>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="prev, pager, next"
            :total="50" class="pagination">
        </el-pagination>
    </div>
</template>

<script>

export default {
    data() {
        return {
            dialogVisible: false,
            form: {
                name: '',
                age: '',
                sex: '',
                birth: ''
            },
            rules: {
                name: [
                    {required: true, message: '请输入姓名'}
                ],
                age: [
                    {required: true, message: '请输入年龄'}
                ],
                sex: [
                    {required: true, message: '请选择性别'}
                ],
                birth: [
                    {required: true, message: '请选择生日'}
                ]
            },
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, , {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, , {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, , {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, ],
            tableLable: {
                date: '日期',
                name: '姓名',
                address: '地址',
                operation: '操作'
            },
            modelType: 0,  //0表示新增的弹窗  1表示编辑
            total: 0 //数据总条数
        };
    },

    methods: {
        submit() {
            this.$refs.form.validate((valid) => {

                if (valid) {
                    //如果为true 则保存数据
                    console.log(this.form, 'form')

                    if (this.modelType === 0) {
                        //添加

                        //重新获取列表数据
                    } else {
                        //编辑

                        //重新获取列表数据
                    }

                    //清空表单
                    this.$refs.form.resetFields()
                    //关闭弹窗
                    this.dialogVisible = false
                } else {

                }
            })
        },
        handleClose() {
            //清空表单
            this.$refs.form.resetFields()
            this.dialogVisible = false
        },
        cancel() {
            this.handleClose()
        },
        handleAdd() {
            this.modelType = 0
            this.dialogVisible = true
        },
        handleEdit(row) {
            this.modelType = 1
            this.dialogVisible = true
        },

        handleDelete(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        getList(){
            //获取列表数据
        }
    },
    mounted() {
        //进入页面前加载页面数据
        this.getList();
    }

}

</script>

<style lang="less">
.head-search{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pagination{
    margin-left: 70%;
}

.manage{
    height: 90%;
}

</style>
