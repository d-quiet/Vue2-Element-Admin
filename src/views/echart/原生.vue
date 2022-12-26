<template>
    <div id="box">
        <div id="chart" ref="chart" style="width: 600px;height:400px;"></div>
        <!-- <button @click="setData">更新数据</button> -->
        <div ref="map" class="map"></div>
    </div>
</template>

<script>
import * as echarts from "echarts"
import dlData from '@/data/DaliMap.json'
export default {
    data() {
        return {
            myChart: null,
            option: {
                title: {
                    text: 'ECharts 入门示例'
                },
                tooltip: {},
                xAxis: {
                    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            },
            mapOption: {
                backgroundColor: '#404a59',
                tooltip: {
                    trigger: 'item'
                },
                geo: {
                    map: 'dali',
                }
            }
        }
    },
    watch: {
        option: {
            handler() {
                this.setOption(this.option) // 更新数据么
            },
            deep: true
        }
    },
    mounted() {
        echarts.registerMap('dali', dlData)
        this.myChart = echarts.init(this.$refs.chart)
        this.setOption(this.option)
        const mapCharts = echarts.init(this.$refs.map)
        mapCharts.setOption({
            ...this.mapOption
        })
    },
    methods: {
        setOption(option) {
            this.myChart.setOption(option)
        },
        setData() {
            this.option.series[0].data = [5, 5, 5, 5, 5, 5]
        }
    },
}
</script>

<style scoped>
#box {
    display: flex;
}

.map {
    width: 60vw;
    height: 400px;
    background-color: skyblue;
}
</style>