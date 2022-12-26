<template>
    <div id="box">
        <div>
            <VChart class="chart" :option="option" :autoresize="true"></VChart>
            <button @click="setData">更新数据</button>
        </div>
        <VChart class="chart" :option="mapOption" :autoresize="true"></VChart>
    </div>
</template>

<script>
import * as echarts from "echarts"
echarts.registerMap('dali', dlData)
import VChart from 'vue-echarts'
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
                // backgroundColor: '#404a59',
                backgroundColor: 'skyblue',
                tooltip: {
                    trigger: 'item'
                },
                geo: {
                    map: 'dali',
                }
            }
        }
    },
    components: {
        VChart
    },
    methods: {
        setData() {
            this.option.series[0].data = [5, 5, 5, 5, 5, 5]
        }
    },
}
</script>

<style scoped>
.chart {
    width: 40vw;
    height: 500px;
}

#box {
    display: flex;
}

.map {
    width: 60vw;
    height: 400px;
    background-color: skyblue;
}
</style>