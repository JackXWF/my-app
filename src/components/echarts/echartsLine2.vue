<template>
    <div class="dashboard-line-box">
        <div class="dashboard-line-title">
            处理情况
        </div>
        <div
            ref="echart"
            class="dashboard-line"
        />
    </div>
</template>
<script>
import * as echarts from 'echarts'
import {toRaw} from 'vue'
import 'echarts/theme/macarons'
import {homeData} from "@/api";
import {typeCharts} from "@/api/repairs/repairs";


export default {
    name: 'Line',
    data() {
        return {
            chart: null,
            chartData: []
        }
    },
    mounted() {
        typeCharts(2).then(r => {

            this.chartData = r.data.dataVOS
            console.log(this.chartData, "类型数据")

            this.$nextTick(() => {
                this.initChart()
            })
        })


    },
    beforeUnmount() {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$refs.echart, 'macarons')
            this.setOptions()
        },
        setOptions() {
            let datas = []
            datas = this.chartData
            toRaw(this.chart).setOption({

                title: {
                    text: '维修处理情况',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: '50%',
                        data: datas,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ],
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.dashboard-line-box {
    .dashboard-line {
        background-color: #fff;
        height: 360px;
        width: 100%;
    }

    .dashboard-line-title {
        font-weight: 600;
        margin-bottom: 12px;
    }
}
</style>
