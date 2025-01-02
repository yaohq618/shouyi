<template>
    <div>
        <el-container>
            <SidebarVc/>
            <el-container class="headermain">
                <HeaderVc/>

                <el-main>        
                        <router-view></router-view>
                </el-main>

                
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import SidebarVc from "@/components/SidebarVc.vue"
import HeaderVc from "@/components/HeaderVc.vue"
import FooterVc from "@/components/FooterVc.vue"
</script>

<style scoped>
.headermain{
  flex-direction:column;
  height:100vh;
}

.el-main{
}

</style>