<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
            <el-form-item label="工单号" :prop="'params.id'">
                <el-input
                    type="number"
                    v-model="queryParams.params.id"
                    placeholder="请输入工单号"

                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="处理状态" :prop="'params.state'">
                <el-select v-model="queryParams.params.state" placeholder="请选择处理状态" clearable
                           :style="{width: '100%'}">
                    <el-option v-for="(item, index) in stateSelect" :key="index" :label="item.label"
                               :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="处理人" :prop="'params.handleUserId'">
                <el-select v-model="queryParams.params.handleUserId" placeholder="请选择处理人" clearable
                           :style="{width: '100%'}">
                    <el-option v-for="(item, index) in employeeList" :key="index" :label="item.name"
                               :value="item.id" :disabled="item.disabled"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="repairsList" @selection-change="handleSelectionChange" height="450">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="序号" type="index" align="center"/>
            <el-table-column label="工单号" align="center" prop="id"/>
            <el-table-column label="报修人" align="center" prop="initUser"/>
            <el-table-column label="联系电话" align="center" prop="initPhone"/>
            <el-table-column label="报修地点" align="center" prop="address"/>
            <el-table-column label="描述" align="center" prop="descr"/>
            <el-table-column label="维修人" align="center" prop="handleUserName"/>
            <el-table-column label="添加时间" align="center" prop="addTime"/>
            <el-table-column label="处理状态" align="center" prop="state"/>
            <el-table-column label="处理时间" align="center" prop="handleTime"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-info"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['student:student:edit']"

                    >详情
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        :disabled='roleIdentity'
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

        <drawer title="报修详情" :display.sync="display" :width="drawerWidth">
            <div style="width:100%;height: 100px;background-color: #409EFF" class="wrapper">
                <p style="font-size: 35px;color: white;margin-left: 20px">报修详情<span>(</span>工单号<span>)</span></p>
            </div>
            <el-row>
                <el-col :span="8">
                    <!-- 图形 -->
                    <el-card style="height: 750px; margin-left: 10px;" class="box-card">
                        <div slot="header" class="clearfix">
                            <span style="font-size: 20px">报修信息</span>
                        </div>
                        <el-row class="card-content">
                            <el-col :span="12">
                                <span>报修人</span>
                            </el-col>
                            <el-col :span="12">
                                <span>{{ this.drawerParams.initUser }}</span>
                            </el-col>
                        </el-row>
                        <el-row class="card-content">
                            <el-col :span="12">
                                <span>报修人电话</span>
                            </el-col>
                            <el-col :span="12">
                                <span>{{ this.drawerParams.initPhone }}</span>
                            </el-col>
                        </el-row>
                        <el-row class="card-content">
                            <el-col :span="12">
                                <span>报修物品</span>
                            </el-col>
                            <el-col :span="12">
                                <span>{{ this.drawerParams.value }}</span>
                            </el-col>
                        </el-row>
                        <el-row class="card-content">
                            <el-col :span="12">
                                <span>报修地点</span>
                            </el-col>
                            <el-col :span="12">
                                <span>{{ this.drawerParams.address }}</span>
                            </el-col>
                        </el-row>
                        <el-row class="card-descr">
                            <el-col :span="12">
                                <span>报修描述</span>
                            </el-col>
                            <el-col :span="12">
                                <span>{{ this.drawerParams.descr }}</span>
                            </el-col>
                        </el-row>
                        <h2>故障图片</h2>
                        <div style="display: flex; justify-content:space-between">
                            <div v-for="item in this.drawerParams.images">
                                <el-image style="width: 200px;height: 200px" :src="item"/>
                            </div>
                        </div>

                    </el-card>
                </el-col>
                <el-col :span="8">
                    <!-- 图形 -->
                    <el-card style="height: 750px; margin-left: 10px;" class="box-card">
                        <div slot="header" class="clearfix">
                            <span style="font-size: 20px">指派信息</span>
                        </div>
                        <div class="card-content">
                            <span style="color: deepskyblue;margin:auto">{{ this.drawerParams.state }}</span>
                        </div>
                        <el-row class="card-content">
                            <el-col :span="12">
                                <span>指派员工</span>
                            </el-col>
                            <el-col :span="12">
                                <span>{{ this.drawerParams.handleUserName }}</span>
                            </el-col>
                        </el-row>
                        <el-row class="card-content">
                            <el-col :span="12">
                                <span>联系电话</span>
                            </el-col>
                            <el-col :span="12">
                                <span>{{ this.drawerParams.handleUserPhone }}</span>
                            </el-col>
                        </el-row>
                        <div style="display: flex;justify-content: center;margin-top: 20px">
                            <el-button type="primary" @click="completeRepair" :disabled='completeFlag'>已完成维修
                            </el-button>
                        </div>


                    </el-card>
                </el-col>
                <el-col :span="8">
                    <!-- 图形 -->
                    <el-card style="height: 750px; margin-left: 10px;" class="box-card">
                        <div slot="header" class="clearfix">
                            <span style="font-size: 20px">指派受理</span>
                        </div>
                        <div>
                            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                            <div slot="footer" class="dialog-footer" style="margin-top: 20px">
                                <el-button type="primary" :disabled='roleIdentity' @click="submitForm">确定指派
                                </el-button>
                            </div>
                        </div>

                    </el-card>
                </el-col>
            </el-row>

        </drawer>
    </div>

</template>

<script>

import {orderList, employeeList, sendEmployee, deleteOrder, complete, employeeTree} from "@/api/repairs/repairs";
import drawer from "@/components/drawer.vue";

export default {
    components: {
        drawer
    },
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            data: [{
                label: '',
                children: [{
                    label: ''
                }]
            }],
            sendFlag: false,
            completeFlag: false,
            display: false,
            drawerWidth: '80%',
            roleIdentity: true,
            urlPath: '',
            imageUrl: '',
            imageUrlList: [],
            imageName: '',
            disabled: false,
            hUser: '',
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
            replaceImages: [],
            // 总条数
            total: 0,
            flag: '',
            employeeList: [],
            repairsList: [],
            stateSelect: [{
                "label": "未处理",
                "value": 0
            }, {
                "label": "处理中",
                "value": 1
            }, {
                "label": "已处理",
                "value": 2
            }],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            //抽屉参数
            drawerParams: {
                initUser: '',
                initPhone: '',
                value: '',
                address: '',
                state: '',
                descr: '',
                images: '',
                handleUserName: '',
                handleUserPhone: '',
                handleUserId: '',
            },
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                params: {
                    id: '',
                    state: '',
                    handleUserId: '',
                    initUser: '',
                }
            },
            // 表单参数
            form: {
                typeId: '',
                addUser: ''
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
            console.log("参数")

            //判断当前角色
            const role = this.$session.get('userInfo').userRole
            if (role === '0') {
                this.roleIdentity = false
                this.completeFlag = true
            } else if (role === '4') {
                this.queryParams.params.initUser = this.$session.get('userInfo').userName
                this.completeFlag = true
            } else if (role === '6') {
                this.queryParams.params.handleUserId = this.$session.get('userInfo').userName
                this.completeFlag = false
            } else {
                this.completeFlag = true
            }


            console.log(this.queryParams, "查询")
            orderList(this.queryParams).then(response => {
                console.log(response.data, "返回")
                if (response.data.data === null) {
                    this.repairsList = null
                }

                const list = response.data.data.resultList;

                list.forEach(item => {
                    if (item.state === '0') {
                        item.state = '未处理'
                    } else if (item.state === '1') {
                        item.state = '处理中'
                    } else if (item.state === '2') {
                        item.state = '已处理'

                    }

                    const imageTest = []

                    item.images.forEach(i => {
                        i = 'http://127.0.0.1:8088/repairsImage/' + i;
                        imageTest.push(i)
                    })

                    item.images = imageTest

                })


                this.total = response.data.data.total

                this.repairsList = list

                employeeList().then(response => {
                    this.employeeList = response.data
                })

                employeeTree().then(r => {

                    this.data = r.data

                    this.data.forEach(i=>{
                        i.children.forEach(e=>{
                            e.label = e.name
                        })
                    })

                    console.log(this.data, "方法")

                })
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
                name: null,
                price: null,
                typeId: null,
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
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.names = selection.map(item => item.name)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.flag = 1;
            this.open = true;
            this.title = "添加菜品信息";

        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.display = true
            this.flag = 0;
            this.reset();
            this.drawerParams = row
            this.title = "工单详情";
            this.disabled = true;
            this.open = true;

            console.log(this.drawerParams, "抽屉")

        },
        handleNodeClick(data) {
            console.log(data);
            this.hUser = data.id
        },
        /** 提交按钮 */
        submitForm() {
            this.drawerParams.handleUserId = this.hUser
            if (this.drawerParams.state === '已处理') {
                this.$message.error("该工单已完成维修,无需再指派")
            } else {
                sendEmployee(this.drawerParams).then(response => {
                    if (response.data.code === 200) {
                        this.$message.success("指派成功")
                        this.getList()
                        this.display = false
                        this.hUser = '';
                    }
                })
            }

        },
        completeRepair() {
            complete(this.drawerParams).then(response => {
                if (response.data.code === 200) {
                    this.$message.success("已完成,感谢您的维修!")
                    this.getList()
                    this.display = false
                    this.hUser = '';
                }
            })

        },
        /** 删除按钮操作 */
        handleDelete(row) {
            if (row.state !== '已处理') {
                this.$message.error("该工单未完结,不能删除!")
            } else {
                deleteOrder(row.id).then(response => {

                    if (response.data.code === 200) {
                        this.$message.success("删除成功")
                        this.getList()
                    }
                })
            }
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
                        this.urlPath = 'http://localhost:8085/dish/uploadPhoto';
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
        changeWidth() {
            this.drawerWidth = (this.drawerWidth === '500px') ? '800px' : '500px'
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

<style>
.wrapper {
    line-height: 100px;
    height: 100vh;
    background-image: linear-gradient(to bottom right, #a8edea, #fed6e3);
    overflow: hidden;
}
</style>

<style lang="scss">

.btn {
    border: none;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
    letter-spacing: 3px;

    &:hover {
        opacity: .8;
    }

    &.open {
        width: 200px;
        height: 80px;
        font-size: 18px;
        background-color: orange;
        color: #fff;
    }

    &.try {
        width: 100px;
        height: 40px;
        background-color: green;
        color: #fff;
        margin-top: 50px;
    }
}
</style>


<style lang="less" scoped>
.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.card-content {
    display: flex;
    padding-left: 10px;
    font-size: 16px;
    margin-top: 10px;
    line-height: 50px;
    height: 50px;
    background-color: #d5d5d5;
    border-radius: 5%;

    .text {
        margin-left: 150px;
    }
}

.card-descr {
    display: flex;
    padding-left: 10px;
    font-size: 16px;
    margin-top: 10px;
    line-height: 100px;
    height: 100px;
    background-color: #d5d5d5;
    border-radius: 5%;
}

.card-iamges {
    display: flex;
    padding-left: 10px;
    font-size: 16px;
    margin-top: 10px;
    line-height: 200px;
    height: 200px;
    background-color: #d5d5d5;
    border-radius: 5%;
}


</style>
