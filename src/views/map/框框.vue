<template>
    <div>
        <div id="map"></div>
        <button @click="del">删除圆形围栏</button>
        <button @click="delAll">删除所有围栏</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            map: null,
            circle: null,
        }
    },
    mounted() {
        var map = new BMap.Map("map");  // 创建Map实例
        this.map = map;
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);      // 初始化地图,用城市名设置地图中心点
        map.enableScrollWheelZoom(true);
        var polygon = new BMap.Polygon([
            new BMap.Point(116.387112, 39.920977),
            new BMap.Point(116.385243, 39.913063),
            new BMap.Point(116.394226, 39.917988),
            new BMap.Point(116.401772, 39.921364),
            new BMap.Point(116.41248, 39.927893)
        ], { strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5 });  //创建多边形
        map.addOverlay(polygon);   //增加多边形

        var circle = new BMap.Circle(new BMap.Point(116.404, 39.915), 2000, { strokeColor: 'skyblue' })
        this.circle = circle;
        map.addOverlay(circle);   //增加多边形
    },
    methods: {
        del() {
            this.map && this.map.removeOverlay(this.circle)
        },
        delAll() {
            this.map.clearOverlays()
        },
    },
}
</script>

<style>
.anchorBL {
    display: none !important;
}

#map {
    width: 100vw;
    height: 665px;
}
</style>