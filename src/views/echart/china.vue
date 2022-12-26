<template>
    <div id="box">
        <span id="title" @click="backChina">中国</span>
        <span v-for="item in AllName" :key="item.adcode" @click="backClickName(item.adcode)">>{{ item.name }}</span>
        <div id="map" ref="map"></div>
    </div>
</template>
  
<script>
import axios from "axios";
import * as echarts from "echarts";
import Axios from "axios";
export default {
    data() {
        return {
            AllName: [],
            mapData: null,
            Allcode: [],
            clickCode: null,
            mapChart: null,
            option: {
                backgroundColor: "skyblue",
                tooltip: {
                    trigger: "item",
                },
                geo: {
                    map: "map",
                    emphasis: {
                        label: {
                            show: false,
                        },
                        itemStyle: {
                            areaColor: "cornflowerblue",
                        },
                    },
                },
            },
        };
    },
    async mounted() {
        const { data } = await this.getJson();
        // console.log(data);
        this.getAllcode(data);
        this.getmapData(data);
        this.mapChart.on("click", (params) => {
            //   console.log(params.name);
            let { adcode, level, name } = this.Allcode.filter(
                (item) => item.name === params.name
            )[0];
            //   console.log(name);
            this.AllName.push({ name, adcode });
            //   console.log(this.AllName);
            //   console.log(level);
            //   console.log(adcode);
            this.getJson(adcode).then((res) => {
                // console.log(res.data);
                this.getAllcode(res.data);
                this.mapData = res.data;
                echarts.registerMap("map", this.mapData);
                this.mapChart = echarts.init(this.$refs.map);
                this.mapChart.setOption({
                    ...this.option,
                });
            });
        });
    },
    methods: {
        getJson(clickCode = 100000) {
            return Axios.get(
                `https://geo.datav.aliyun.com/areas_v3/bound/${clickCode}_full.json`
            );
        },
        getAllcode(data) {
            this.Allcode = [];
            const { features } = data;
            //   console.log(features);
            features.forEach((item) => {
                let obj = {};
                obj.name = item.properties.name;
                obj.adcode = item.properties.adcode;
                obj.level = item.properties.level;
                this.Allcode.push(obj);
            });
        },
        getmapData(data) {
            this.mapData = data;
            echarts.registerMap("map", this.mapData);
            this.mapChart = echarts.init(this.$refs.map);
            this.mapChart.setOption({
                ...this.option,
            });
        },
        async backChina() {
            this.AllName = [];
            this.showName = false;
            const { data } = await this.getJson();
            this.getAllcode(data);
            this.getmapData(data);
        },
        async backClickName(adcode) {
            const index = this.AllName.findIndex((item) => item.adcode === adcode);
            this.AllName.splice(index + 1, 1);
            const { data } = await this.getJson(adcode);
            this.getAllcode(data);
            this.getmapData(data);
        },
    },
};
</script>
  
<style scoped>
#box {
    background-color: skyblue;
    font-size: 50px;
}

#map {
    width: 100%;
    height: 805px;

}
</style>
  