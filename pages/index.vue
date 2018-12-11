<template>
  <div class="page-index">
    <el-row>
      <el-col :span="5">
        <e-menu/>
      </el-col>
      <el-col :span="19">
        <life/>
      </el-col>
    </el-row>
    <el-row >
      <el-col :span="24">
      </el-col>
    </el-row>
  </div>
</template>


<script>
import Logo from '~/components/Logo.vue'
import EMenu from "../components/index/menu";
import Life from "../components/index/life";

export default {
  components: {
    Life,
    EMenu,
    Logo
  },
  mounted() {
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.331398,39.897445);
    map.centerAndZoom(point,12);
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
      if(this.getStatus() == BMAP_STATUS_SUCCESS){
        var mk = new BMap.Marker(r.point);
        map.addOverlay(mk);
        map.panTo(r.point);
        alert('您的位置：'+r.point.lng+','+r.point.lat);
      }
      else {
        alert('failed'+this.getStatus());
      }
    },{enableHighAccuracy: true})
  }
}
</script>

<style lang="scss">
  @import "../assets/css/index/index.scss";
</style>
