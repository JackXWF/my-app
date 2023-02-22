<template>
    <div class="dashboard-line-box">
        <div class="dashboard-line-title">
            访问趋势
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



export default {
    name: 'Line',
    data() {
        return {
            chart: null,
            chartData: []
        }
    },
    mounted() {
        homeData().then(r => {
            console.log(r.data.data.leftData, "采集到的")
            this.chartData = r.data.data.leftData

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
            toRaw(this.chart).setOption({
                grid: {
                    left: '40',
                    right: '20',
                    top: '40',
                    bottom: '20',
                },
                xAxis: {
                    data: this.chartData.map(item => item.name+'月'),
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    z: 10,
                },
                yAxis: {
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#999',
                        },
                    },
                },
                dataZoom: [
                    {
                        type: 'inside',
                    },
                ],
                series: [
                    {
                        type: 'bar',
                        barWidth: '40%',
                        itemStyle: {
                            borderRadius: [5, 5, 0, 0],
                            color: '#188df0',
                        },
                        emphasis: {
                            itemStyle: {
                                color: '#188df0',
                            },
                        },
                        data: this.chartData.map(item => item.value),
                    },
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
