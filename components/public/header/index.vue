<template>
    <div class="m-header">
      <el-row :gutter="0">
        <el-col :span="6">
          <geo/>
        </el-col>
        <el-col :span="6">
          <user/>
        </el-col>
        <el-col :span="12">
          <nav-bar/>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import Geo from './geo';
  import User from "./user";
  import NavBar from "./nav";
  export default {
      components: {
        NavBar,
        User,
        Geo
      }
  }
</script>

<style lang="scss">
   @import "../../../assets/css/public/layout.scss";
   @import "../../../assets/css/public/header/index.scss";
</style>
