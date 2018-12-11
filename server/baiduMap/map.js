const BMap = require('vue-baidu-map')
(function getLocation() {
  var geolocation = new BMap.Geolocation();
  geolocation.getCurrentPosition(function(r){
    if(this.getStatus() == BMAP_STATUS_SUCCESS){
      var mk = new BMap.Marker(r.point);
      map.addOverlay(mk);
      map.panTo(r.point);
      console.log('您的位置：'+r.point.lng+','+r.point.lat);
    }
    else {
      console.log('failed'+this.getStatus());
    }
  },{enableHighAccuracy: true})
})()

