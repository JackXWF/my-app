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
            <el-form-item label="处理人" :prop="'params.handleUser'">
                <el-input
                    v-model="queryParams.params.handleUser"
                    placeholder="请输入处理人"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
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
            <el-table-column label="图片" align="center" prop="images">
                <template slot-scope="scope">
                    <el-image style="width: 100px;height: 100px" :src="scope.row.image"/>
                </template>
            </el-table-column>
            <el-table-column label="描述" align="center" prop="descr"/>
            <el-table-column label="维修人" align="center" prop="handleUser"/>
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
                        :disabled='roleIdentity'
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

        <el-dialog :title="title" :visible.sync="open" width="1000px" height>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="菜名" prop="name">
                    <el-input v-model="form.name"
                              placeholder="请输入菜名" clearable/>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input type="text" v-model="form.price" clearable maxlength="8" placeholder="请输入价格"
                              oninput="value=value.replace(/[^\d.]/g,'')"/>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择菜品类型" clearable
                               :style="{width: '100%'}">
                        <el-option v-for="(item, index) in typeList" :key="index" :label="item.type"
                                   :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
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
                <el-form-item label="备注" prop="descr">
                    <el-input type="textarea" v-model="form.descr" :rows="2" placeholder="请输入备注"/>
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

import {orderList} from "@/api/repairs/repairs";

export default {
    data() {
        return {
            roleIdentity: true,
            urlPath: '',
            imageUrl: '',
            imageUrlList: [],
            imageName: '',
            disabled: false,
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
            flag: '',
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
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                params: {
                    id: '',
                    state: '',
                    handleUser: ''
                }
            },
            // 表单参数
            form: {
                typeId: '',
                addUser: ''
            },
            // 表单校验
            rules: {
                name: [{
                    required: true,
                    message: '请输入菜名',
                    trigger: 'blur'
                }],
                price: [{
                    required: true,
                    message: '请输入价格',
                    trigger: 'blur'
                }],
                type: [{
                    required: true,
                    message: '请选择类型',
                    trigger: 'change'
                }],
            }
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
            }

            console.log(this.queryParams, "参数")

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
                })


                this.total = response.data.data.total

                this.repairsList = list


                console.log(this.repairsList, "换个地方会")
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

            this.flag = 0;
            this.reset();
            this.title = "工单详情";
            this.disabled = true;
            this.open = true;

        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.flag === 1) {
                        this.form.typeId = this.form.type
                        this.form.image = this.imageName
                        this.form.addUser = this.$session.get('userInfo').userName
                        console.log(this.form, "信息")
                        addDish(this.form).then(response => {
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
                    } else if (this.flag === 0) {
                        //更新
                        console.log(this.form, "hjdkghsdif")
                        this.form.image = this.imageName
                        updateDish(this.form).then(response => {
                            console.log(response, "相应")
                            if (response.data.code === 200) {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.open = false;
                                this.getList();
                            } else {
                                this.$message.error('修改失败,该菜品类型下面存在相同菜品!')
                            }
                        });


                    }


                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            console.log(row, "删除")
            const dishId = row.id || this.ids;
            const dishName = row.name || this.names;
            this.$confirm('是否确认删除"' + dishName + '"的菜品信息？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                return removeDish(dishId);
            }).then(() => {
                this.getList();
                this.$message.success('删除成功')
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

