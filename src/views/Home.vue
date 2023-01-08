<template>
    <el-row>
        <!-- 左侧 -->
        <el-col :span="8">
            <el-card class="box-card">
                <div class="user">
                    <img src="../assets/images/pig.png"/>
                    <div class="userInfo">
                        <p class="name">Admin</p>
                        <p class="access">超级管理员</p>
                    </div>
                </div>
                <div class="loginInfo">
                    <p>上次登录的时间: <span>2023年1月7日</span></p>
                    <p>上次登录的地点: <span>江苏</span></p>
                </div>
            </el-card>
            <el-card style="margin-top: 20px;">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column v-for="(val, key) in tableLable" :prop="key" :label="val" width="100">
                    </el-table-column>

                </el-table>
            </el-card>
        </el-col>
        <!-- 右侧-->
        <el-col :span="16">
            <!-- 图形 -->
            <el-card style="height: 267px; margin-left: 10px;">

                <!-- 折线图 -->
                <div ref="echarts1" style="267px">

                </div>
            </el-card>

            <div class="graph">
                <el-card style="height: 463px;">


                </el-card>
                <el-card style="height: 463px;">

                </el-card>
            </div>

        </el-col>
    </el-row>
</template>

<script>
import * as echarts from 'echarts'
export default {
    data() {
        return {

            form: {
                id: '10086',
                password: '123456'
            },

            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
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
            }],
            tableLable: {
                date: '日期',
                name: '姓名',
                address: '地址'
            }
        }
    },
    mounted() {

        getData().then((data) => {
            // 基于准备好的dom  ，初始化echarts实例
            const echarts = echarts.init(this.$refs.echarts1)


            var option = {}
        })


    }

}

</script>


<style lang="less" scoped>
.user {
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;

    img {
        margin-right: 40px;
        width: 150px;
        height: 150px;
        border-radius: 50%;
    }

    .userInfo {
        .name {
            font-size: 32px;
            margin-bottom: 10px;
        }

        .access {
            color: #999999;
        }
    }
}

.loginInfo {
    p {
        line-height: 28px;
        font-size: 14px;
        color: #999999;

        span {
            color: #666666;
            margin-left: 88px;
        }


    }
}

.graph {
    display: flex;
    justify-content: space-between;

    .el-card {

        margin-left: 10px;
        margin-top: 20px;
        width: 48%;
    }
}
</style>
