<template>
    <div>
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
            <el-form-item label="学号" prop="number">
                <el-input disabled="true" v-model="formData.number" placeholder="请输入学号" clearable
                          :style="{width: '100%'}">
                </el-input>
            </el-form-item>
            <el-form-item label="早起习惯" prop="early">
                <el-select v-model="formData.early" placeholder="请选择早起习惯" clearable :style="{width: '100%'}">
                    <el-option v-for="(item, index) in field102Options" :key="index" :label="item.label"
                               :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="晚睡习惯" prop="late">
                <el-select v-model="formData.late" placeholder="请选择晚睡习惯" clearable :style="{width: '100%'}">
                    <el-option v-for="(item, index) in field103Options" :key="index" :label="item.label"
                               :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="打游戏习惯" prop="game">
                <el-select v-model="formData.game" placeholder="请选择打游戏习惯" clearable :style="{width: '100%'}">
                    <el-option v-for="(item, index) in field104Options" :key="index" :label="item.label"
                               :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="宿舍打扫情况" prop="clean">
                <el-select v-model="formData.clean" placeholder="请选择宿舍打扫情况" clearable :style="{width: '100%'}">
                    <el-option v-for="(item, index) in field105Options" :key="index" :label="item.label"
                               :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="在宿舍健身" prop="fitness">
                <el-select v-model="formData.fitness" placeholder="请选择在宿舍健身" clearable :style="{width: '100%'}">
                    <el-option v-for="(item, index) in field106Options" :key="index" :label="item.label"
                               :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="室友性格" prop="disposition">
                <el-select v-model="formData.disposition" placeholder="请选择室友性格" clearable
                           :style="{width: '100%'}">
                    <el-option v-for="(item, index) in field107Options" :key="index" :label="item.label"
                               :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="室友来自" prop="address">
                <el-select v-model="formData.address" placeholder="请选择室友来自" clearable :style="{width: '100%'}">
                    <el-option v-for="(item, index) in field108Options" :key="index" :label="item.label"
                               :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item size="large">
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button type="primary" @click="onOpen">自选宿舍</el-button>
                <el-button @click="resetForm">重置</el-button>

            </el-form-item>
        </el-form>

        <el-dialog v-bind="$attrs" v-on="$listeners" :visible.sync="open" @close="onClose" title="选择宿舍">
            <el-form ref="dor" :model="dor" :rules="rules2" size="medium" label-width="100px">
                <el-form-item label="宿舍" prop="dormitoryId">
                    <el-select v-model="dor.dormitoryId" placeholder="请选择宿舍" clearable :style="{width: '100%'}">
                        <el-option v-for="(item, index) in dormitoryList" :key="index" :label="item.dormitory"
                                   :value="item.dormitoryId" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请原因" prop="reason">
                    <el-input v-model="dor.reason" type="textarea" placeholder="请填写申请原因" :maxlength="500"
                              show-word-limit :autosize="{minRows: 4, maxRows: 4}"
                              :style="{width: '100%'}"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import {insertSurvey, dormitoryList, optional} from "@/api/dormitory/dormitory";
import repairsHttp from "@/utils/repairs";
import el from "element-ui/src/locale/lang/el";

export default {
    components: {},
    props: [],
    data() {
        return {
            open: false,
            dor: {
                dormitoryId: undefined,
                stuNumber: '',
                reason: ''
            },
            formData: {
                number: undefined,
                early: undefined,
                late: undefined,
                game: undefined,
                clean: undefined,
                fitness: undefined,
                disposition: undefined,
                address: undefined,
            },
            dormitoryList: [],
            rules: {
                number: [{
                    required: true,
                    message: '请输入学号',
                    trigger: 'blur'
                }],
                early: [{
                    required: true,
                    message: '请选择早起习惯',
                    trigger: 'change'
                }],
                late: [{
                    required: true,
                    message: '请选择晚睡习惯',
                    trigger: 'change'
                }],
                game: [{
                    required: true,
                    message: '请选择打游戏习惯',
                    trigger: 'change'
                }],
                clean: [{
                    required: true,
                    message: '请选择宿舍打扫情况',
                    trigger: 'change'
                }],
                fitness: [{
                    required: true,
                    message: '请选择在宿舍健身',
                    trigger: 'change'
                }],
                disposition: [{
                    required: true,
                    message: '请选择室友性格',
                    trigger: 'change'
                }],
                address: [{
                    required: true,
                    message: '请选择室友来自',
                    trigger: 'change'
                }],

            },
            rules2: {
                dormitoryId: [{
                    required: true,
                    message: '请选择宿舍',
                    trigger: 'change'
                }],
                reason: [{
                    required: true,
                    message: '请填写原因',
                    trigger: 'blur'
                }],
            },
            field102Options: [{
                "label": "有",
                "value": 1
            }, {
                "label": "没有",
                "value": 2
            }],
            field103Options: [{
                "label": "有",
                "value": 1
            }, {
                "label": "没有",
                "value": 2
            }],
            field104Options: [{
                "label": "经常玩",
                "value": 1
            }, {
                "label": "偶尔玩",
                "value": 2
            }, {
                "label": "不玩",
                "value": 3
            }],
            field105Options: [{
                "label": "经常打扫",
                "value": 1
            }, {
                "label": "偶尔打扫",
                "value": 2
            }, {
                "label": "不打扫",
                "value": 3
            }],
            field106Options: [{
                "label": "是",
                "value": 1
            }, {
                "label": "否",
                "value": 2
            }],
            field107Options: [{
                "label": "活泼开朗",
                "value": 1
            }, {
                "label": "内向害羞",
                "value": 2
            }],
            field108Options: [{
                "label": "南方",
                "value": 1
            }, {
                "label": "北方",
                "value": 2
            }],
        }
    },
    computed: {},
    watch: {},
    created() {
        dormitoryList().then(response => {
            this.dormitoryList = response.data.data
            console.log(this.dormitoryList, "宿舍列表")

            const gender = this.$session.get('userInfo').gender

            const result = [];

            this.dormitoryList.forEach(i => {
                if (i.flag === gender) {
                    result.push(i)
                }
            })

            console.log(result, "拉开进攻")
            this.dormitoryList = result

        })


    },
    mounted() {

        this.formData.number = this.$session.get('userInfo').userName
    },
    methods: {
        submitForm() {
            console.log(this.formData, "表单")
            this.$refs['elForm'].validate(valid => {
                if (!valid) return
                // TODO 提交表单
                insertSurvey(this.formData).then(r => {
                    console.log(r.data.code, "烦烦烦")
                    if (r.data.code === 200) {
                        this.$message.success("提交成功，谢谢您的配合!")
                        this.open = false
                    } else {
                        this.$message.error(r.data.msg)
                    }
                })
            })
        },
        resetForm() {
            this.$refs['elForm'].resetFields()
        },
        handleConfirm() {
            this.$refs['dor'].validate(valid => {
                if (!valid) return

                this.dor.stuNumber = this.$session.get('userInfo').userName
                console.log(this.dor, "方法")

                optional(this.dor).then(r => {
                    if (r.data.code === 200) {
                        console.log(r.data, "斤斤计较")
                        this.$message.success(r.data.data)
                        this.open = false
                    } else {
                        this.$message.error(r.data.msg)
                    }


                })

            })
        },
        onOpen() {
            this.open = true
        },
        onClose() {
            this.$refs['dor'].resetFields()
        },
        close() {
            this.open = false
        },
    }
}

</script>
<style>
</style>
