<template>
    <el-container class="layout-default">
      <el-header style="height: auto">
        <m-header></m-header>
      </el-header>
      <el-main>
        <nuxt/>
      </el-main>
      <el-footer>
        <m-footer></m-footer>
      </el-footer>
    </el-container>
</template>

<script>
  import MHeader from '../components/public/header/index'
  import MFooter from "../components/public/footer/index";
  export default {
    components: {
      MFooter,
      MHeader
    }
  }
</script>

<style>
</style>
