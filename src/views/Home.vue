<template>
    <div class="page">
        <div class="gva-card-box">
            <div class="gva-card gva-top-card">
                <div class="gva-top-card-left">
                    <div class="gva-top-card-left-title">Hello，<span>{{ info.userName }}</span>，请开始一天的工作吧</div>
                    <div class="gva-top-card-left-dot">登录IP：<span>&nbsp;&nbsp;{{info.loginIp}}</span>&nbsp;&nbsp; || &nbsp;&nbsp;登录时间：<span>&nbsp;&nbsp;{{info.loginTime}}</span></div>
                    <div class="gva-top-card-left-rows">
                        <el-row>
                            <el-col :span="6" :xs="24" :sm="20">
                                <div  class="flex-center">
                                    <img src="../assets/icons/user.png" class="dasboard-icon">
                                    用户：<span>{{ userDateList[0].value }}人</span>
                                </div>
                            </el-col>
                            <el-col :span="6" :xs="24" :sm="20">
                                <div class="flex-center">
                                    <img src="../assets/icons/student.png" class="dasboard-icon">
                                    学生：<span>{{ userDateList[1].value }}人</span>
                                </div>
                            </el-col>
                            <el-col :span="6" :xs="24" :sm="20">
                                <div class="flex-center">
                                    <img src="../assets/icons/canteen.png" class="dasboard-icon">
                                    食堂员工：<span>{{ userDateList[2].value }}人</span>
                                </div>
                            </el-col>
                            <el-col :span="6" :xs="24" :sm="8">
                                <div class="flex-center">
                                    <img src="../assets/icons/repairs.png" class="dasboard-icon">
                                    维修工：<span>{{ userDateList[3].value }}人</span>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <iframe scrolling="no" src="https://tianqiapi.com/api.php?style=ya&skin=durian" style="margin-right: 100px" frameborder="0" width="320" height="200" allowtransparency="true"></iframe>
                <img src="@/assets/dashboard.png" class="gva-top-card-right" alt>
            </div>
        </div>
        <div class="gva-card-box" v-show="divShow">
            <el-card class="gva-card quick-entrance">
                <template #header>
                    <div class="card-header">
                        <span>快捷入口</span>
                    </div>
                </template>
                <el-row :gutter="20">
                    <el-col
                        v-for="(card, key) in toolCards"
                        :key="key"
                        :span="4"
                        :xs="8"
                        class="quick-entrance-items"
                        @click.native="toTarget(card.name)"
                    >
                        <div class="quick-entrance-item">
                            <div class="quick-entrance-item-icon" :style="{ backgroundColor: card.bg }">
                                <i :class="`el-icon-${card.icon}`"></i>
                            </div>
                            <p>{{ card.label }}</p>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <div class="gva-card-box">
            <div class="gva-card">
                <div class="card-header">
                    <span>数据统计</span>
                </div>
                <div class="echart-box">
                    <el-row :gutter="20">
                        <el-col :xs="24" :sm="18">
                            <echarts-line/>
                        </el-col>
                        <el-col :xs="24" :sm="6">
                            <dashboard-table/>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import echartsLine from "@/components/dashboardCharts/echartsLine.vue";
import dashboardTable from "@/components/dashboardTable/dashboardTable.vue";
import {homeData} from "@/api";

export default {
    name: 'Dashboard',
    components: {
        echartsLine,
        dashboardTable
    },
    data() {
        return {
            divShow: false,
            userDateList: {},
            info: {
                name: '',
                userName: '',
                userRole: '',
                loginTime: '',
                loginIp: ''
            },
            toolCards: [
                {
                    label: '学生管理',
                    icon: 'user',
                    name: '/student',
                    color: '#ff9c6e',
                    bg: 'rgba(255, 156, 110,.3)'
                },
                {
                    label: '食堂员工管理',
                    icon: 'setting',
                    name: '/employee',
                    color: '#69c0ff',
                    bg: 'rgba(105, 192, 255,.3)'
                },
                {
                    label: '菜品列表',
                    icon: 'eleme',
                    name: '/dish',
                    color: '#b37feb',
                    bg: 'rgba(179, 127, 235,.3)'
                },
                {
                    label: '添加用户',
                    icon: 'female',
                    name: '/system',
                    color: '#ffd666',
                    bg: 'rgba(255, 214, 102,.3)'
                },
                {
                    label: '报修列表',
                    icon: 'document-checked',
                    name: '/repairsList',
                    color: '#ff85c0',
                    bg: 'rgba(255, 133, 192,.3)'
                },
                {
                    label: '物品列表',
                    icon: 'monitor',
                    name: '/articles',
                    color: '#5cdbd3',
                    bg: 'rgba(92, 219, 211,.3)'
                }
            ]
        }
    },
    mounted() {
        const userInfo = this.$session.get('userInfo')

        if (userInfo.userRole === '0') {
            this.divShow = true
            userInfo.userRole = '系统管理员'
        }

        if (userInfo.userRole === '1') {
            userInfo.userRole = '宿舍管理员'
        }

        if (userInfo.userRole === '2') {
            userInfo.userRole = '食堂管理员'
        }

        if (userInfo.userRole === '3') {
            userInfo.userRole = '食堂工人'
        }

        if (userInfo.userRole === '4') {
            userInfo.userRole = '学生'
        }

        if (userInfo.userRole === '6') {
            userInfo.userRole = '维修员工'
        }

        this.info = userInfo


        homeData().then(r => {
            console.log(r, "ufhsduyg")

            this.userDateList = r.data.data.rightDate

            console.log(this.userDateList, "活动回顾")


        })
    },
    methods: {
        toTarget(name) {
            console.log(name, "弄好给你帮忙尽快")
            this.$router.push(name)
        }
    },
}
</script>

<style lang="scss" scoped>
@mixin flex-center {
    display: flex;
    align-items: center;
}

.page {
    background: #f0f2f5;
    padding: 0;

    .gva-card-box {
        padding: 12px 16px;

        & + .gva-card-box {
            padding-top: 0px;
        }
    }

    .gva-card {
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 2px;
        height: auto;
        padding: 26px 30px;
        overflow: hidden;
        box-shadow: 0 0 7px 1px rgba(0, 0, 0, 0.03);
    }

    .gva-top-card {
        height: 260px;
        @include flex-center;
        justify-content: space-between;
        color: #777;

        &-left {
            height: 100%;
            display: flex;
            flex-direction: column;

            &-title {
                font-size: 22px;
                color: #343844;
            }

            &-dot {
                font-size: 14px;
                color: #6B7687;
                margin-top: 24px;
            }

            &-rows {
                // margin-top: 15px;
                margin-top: 18px;
                color: #6B7687;
                width: 600px;
                align-items: center;
            }

            &-item {
                + .gva-top-card-left-item {
                    margin-top: 24px;
                }

                margin-top: 14px;
            }
        }

        &-right {
            height: 600px;
            width: 600px;
            margin-top: 28px;
        }
    }

    ::v-deep(.el-card__header) {
        padding: 0;
        border-bottom: none;
    }

    .card-header {
        padding-bottom: 20px;
        border-bottom: 1px solid #e8e8e8;
    }

    .quick-entrance-title {
        height: 30px;
        font-size: 22px;
        color: #333;
        width: 100%;
        border-bottom: 1px solid #eee;
    }

    .quick-entrance-items {
        @include flex-center;
        justify-content: center;
        text-align: center;
        color: #333;

        .quick-entrance-item {
            padding: 16px 28px;
            margin-top: -16px;
            margin-bottom: -16px;
            border-radius: 4px;
            transition: all 0.2s;

            &:hover {
                box-shadow: 0px 0px 7px 0px rgba(217, 217, 217, 0.55);
            }

            cursor: pointer;
            height: auto;
            text-align: center;
            // align-items: center;
            &-icon {
                width: 50px;
                height: 50px !important;
                border-radius: 8px;
                @include flex-center;
                justify-content: center;
                margin: 0 auto;

                i {
                    font-size: 24px;
                }
            }

            p {
                margin-top: 10px;
            }
        }
    }

    .echart-box {
        padding: 14px;
    }
}

.dasboard-icon {
    font-size: 20px;
    color: rgb(85, 160, 248);
    width: 20px;
    height: 20px;
    margin-right: 10px;
    @include flex-center;
}

.flex-center {
    margin-bottom: 10px;
    @include flex-center;
}

//小屏幕不显示右侧，将登陆框居中
@media (max-width: 750px) {
    .gva-card {
        padding: 20px 10px !important;

        .gva-top-card {
            height: auto;

            &-left {
                &-title {
                    font-size: 20px !important;
                }

                &-rows {
                    margin-top: 15px;
                    align-items: center;
                }
            }

            &-right {
                display: none;
            }
        }

        .gva-middle-card {
            &-item {
                line-height: 20px;
            }
        }

        .dasboard-icon {
            font-size: 18px;
        }
    }
}
</style>
