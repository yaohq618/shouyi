<template>
  <div>
    <el-container>
      <SidebarVc class="siderbar"></SidebarVc>
      <el-container class="headermain">
        <HeaderVc></HeaderVc>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import SidebarVc from './components/SidebarVc'
import HeaderVc from './components/HeaderVc'



</script>

<style scoped>
.headermain{
  display:flex;
  flex-direction: column ;
}


</style>