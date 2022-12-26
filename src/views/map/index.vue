<template>
    <div>
        <div ref="map" id="map"></div>
    </div>
</template>
  
<script>
import axios from "axios";
import * as echarts from "echarts";
axios.defaults.baseURL = "https://geo.datav.aliyun.com/areas_v3/bound";
export default {
    data() {
        return {
            mapCode: [],
            option: {},
        };
    },
    mounted() {
        this.initCharts();
    },
    methods: {
        async initCharts() {
            //   所有地区的信息
            let mapChina = echarts.init(this.$refs.map);
            const { data: dataCode } = await axios.get(`/all.json`);
            const { data: dataCity } = await axios.get(`/100000_full.json`);
            this.mapCode = dataCode;
            this.beginMap(dataCity, "中国", mapChina);
        },
        beginMap(newData, name, clickEvent) {
            //   所有省信息
            echarts.registerMap(name, newData);
            let option = {
                backgroundColor: "skyblue",
                tooltip: {
                    trigger: "item",
                },
                geo: {
                    map: name,
                    emphasis: {
                        label: {
                            show: false,
                        },
                        itemStyle: {
                            areaColor: "skyblue",
                        },
                    },
                },
            };
            this.option = option;
            clickEvent.setOption({
                ...this.option,
            });
            clickEvent.off("click");
            clickEvent.on("click", async (result) => {
                // 过滤当前点击的省份code
                let newCode = this.mapCode.filter(
                    (code) => code.name === result.name
                )[0].adcode;
                // 重新渲染
                const { data } = await axios.get(`/${newCode}_full.json`);
                this.beginMap(data, result.name, clickEvent);
            });
        },
    },
};
</script>
  
<style scoped>
#map {
    width: 100%;
    height: 865px;
}
</style>