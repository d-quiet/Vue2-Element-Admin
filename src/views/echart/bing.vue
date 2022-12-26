<template>
      <div>
            <div ref="chart" id="chart"></div>
          </div>
</template>
    
<script>
import * as echarts from "echarts";
export default {
    data() {
        return {
            myChart: null,
            option: {
                title: {
                    text: "Referer of a Website",
                    subtext: "Fake Data",
                    left: "center",
                },
                tooltip: {
                    trigger: "item",
                },
                legend: {
                    orient: "vertical",
                    left: "left",
                },
                series: [
                    {
                        name: "Access From",
                        type: "pie",
                        radius: "50%",
                        data: [
                            { value: 1048, name: "Search Engine" },
                            { value: 735, name: "Direct" },
                            { value: 580, name: "Email" },
                            { value: 484, name: "Union Ads" },
                            { value: 300, name: "Video Ads" },
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)",
                            },
                        },
                    },
                ],
            },
        };
    },
    mounted() {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init(this.$refs.chart);
        // 绘制图表
        this.myChart.setOption(this.option);
        window.addEventListener("resize", this.resize);
    },
    destroyed() {
        window.removeEventListener("resize", this.resize);
    },
    methods: {
        resize() {
            this.myChart.resize();
        },
    },
};
</script>
    
<style scoped>
#chart {
    width: 50vw;
    height: 400px;
}
</style>