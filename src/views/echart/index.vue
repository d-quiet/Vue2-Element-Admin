<template>
  <div>
    <div class="menu">
      <div class="ipt">
        <el-switch @change="deAll" active-color="#13ce66" active-text="点聚合开启" inactive-color="#ff4949"
          inactive-text="点聚合关闭" style="display: block" v-model="inpt" />
      </div>
      <div id="r-result">
        <el-input clearable id="start" placeholder="请输入起始点" v-model="startInput" />
      </div>
      <div id="r-result">
        <el-input clearable id="end" placeholder="请输入终点" v-model="endInput" />
      </div>
      <div class="diver">
        <el-button @click="PlanningRoute" size="small" type="primary">规划路线</el-button>
      </div>
      <div class="startCar">
        <el-button @click="openCar" size="small" type="primary">开始运动</el-button>
      </div>
      <!-- <div class="stop">
        <el-button @click="stopCar" size="small" type="primary">暂停</el-button>
      </div> -->
    </div>
    <div id="baiduMap" />
  </div>
</template>

<script>
import points from '@/data/points.json';
export default {
  data() {
    return {
      inpt: true,
      newPoint: null,
      pot: null,
      markers: [],
      map: null,
      local: null,
      myValue: null,
      myValue2: null,
      arr: [],
      driving: null,
      lushu: null,
      startInput: '',
      endInput: '',
      BMap: true,
      BMapLib: true,
      BMAP_STATUS_SUCCESS: true,
      LuShu: true,
    };
  },
  mounted() {
    this.map = new BMap.Map('baiduMap');
    this.map.centerAndZoom('南京', 12);
    this.map.setCurrentCity('南京');
    this.map.enableScrollWheelZoom();
    this.newPoint = points.splice(0, 500);
    setTimeout(async () => {
      await this.newPoint.forEach((item) => {
        this.pot = new BMap.Point(item.lnglat[0], item.lnglat[1]);
        this.markers.push(new BMap.Marker(this.pot));
        if (this.markers.length === 500) {
          new BMapLib.MarkerClusterer(this.map, { markers: this.markers });
        }
      });
    }, 200);
    this.driving = new BMap.DrivingRoute(this.map, {
      renderOptions: {
        map: this.map,
        autoViewport: true,
      },
      onSearchComplete: (res) => {
        const that = this;
        if (that.driving.getStatus() === BMAP_STATUS_SUCCESS) {
          var plan = res.getPlan(0);
          var arrPois = [];
          for (var j = 0; j < plan.getNumRoutes(); j++) {
            var route = plan.getRoute(j);
            arrPois = arrPois.concat(route.getPath());
          }
          that.map.addOverlay(new BMap.Polyline(arrPois, { strokeColor: '#111' }));
          that.map.setViewport(arrPois);

          that.lushu = new BMapLib.LuShu(that.map, arrPois, {
            defaultContent: '',
            autoView: true,
            icon: new BMap.Icon('https://webapi.amap.com/images/car.png', new BMap.Size(52, 26), { anchor: new BMap.Size(27, 13) }),
            speed: 1000,
            enableRotation: true,
            landmarkPois: [],
          });
        }
      },
    });
  },
  methods: {
    deAll() {
      if (!this.inpt) {
        this.map.clearOverlays();
      } else {
        new BMapLib.MarkerClusterer(this.map, { markers: this.markers });
      }
    },

    setPlace(value, callback) {
      // LocalSearch 后加的是在什么区域搜索，如：——this.map 就是在全国范围内搜素
      const local = new BMap.LocalSearch('南京', {
        onSearchComplete: () => {
          const getpo = local.getResults().getPoi(0).point;
          this.arr.push(getpo);
          this.map.addOverlay(new BMap.Marker(getpo));
        },
      });
      local.search(value);
      callback();
    },
    PlanningRoute() {
      this.searchPoint(() => {
        this.$message('稍等');
        setTimeout(() => {
          this.driving.search(new BMap.Point(this.arr[0].lng, this.arr[0].lat), new BMap.Point(this.arr[1].lng, this.arr[1].lat));
          this.arr = [];
        }, 3000);
      });
    },
    searchPoint(callback) {
      this.map.clearOverlays();
      this.setPlace(this.startInput, () => {
        setTimeout(() => {
          this.setPlace(this.endInput, () => {
            callback();
          });
        }, 500);
      });
    },
    openCar() {
      this.lushu.start();
    },
    stopCar() {
      this.lushu.stop();
    },
  },
};
</script>

<style scoped>
.menu {
  position: fixed;
  z-index: 1;
  background: white;
  width: 90vw;
  height: 50px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  justify-content: space-evenly
}

#baiduMap {
  width: 90vw;
  height: 865px;
  line-height: 80px;
  text-align: center;
  touch-action: none;
}

/* .ipt, */
/* .diver,
#r-result {
  margin: 0 10px;
} */
.startCar {
  margin-right: 20px;
}
</style>
