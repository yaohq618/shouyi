<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    router
  >
    <el-menu-item index="/text/award">获奖</el-menu-item>
    <el-menu-item index="/text">论文</el-menu-item>
    <el-menu-item index="/text">专利</el-menu-item>
    <el-menu-item index="/text">著作</el-menu-item>
  </el-menu>
  <router-view></router-view>
</template>

<script setup>
import { ref } from 'vue'
const activeIndex = ref('/text/award')



</script>

<style scoped>
.el-menu-demo {
  display: flex;
  justify-content: flex-end; /* 使菜单靠右对齐 */
  width: 100%;
}
</style>