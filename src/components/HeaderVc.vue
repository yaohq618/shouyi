<template>
  <el-header>
    <!--图标-->
    <el-icon @click="toggleNavCollapse">
      <Fold v-show="!isCollapse"/>
      <Expand v-show="isCollapse"/>
    </el-icon>

    <!--面包屑-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index" :to="{ path: item.path }">
        {{item.meta.title}}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!--下拉菜单-->
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar :size="30" :src="require('@/assets/avatar.jpg')" />
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>  
          <el-dropdown-item>张三</el-dropdown-item>
          <el-dropdown-item>退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Expand, Fold,ArrowDown  } from '@element-plus/icons-vue';
import {useStore} from 'vuex'
const store = useStore();

const isCollapse = computed(() => store.state.isCollapse);
const toggleNavCollapse = () => {
  store.commit('toggleSidebar',!isCollapse.value)
}

</script>

<style scoped lang="scss">
.el-header{
  display:flex;
  align-items:center;
  background-color:#f0f0f0;
  .el-icon{
    margin-right:17px;
  }
} 
.el-dropdown{
  margin-left:auto;
  .el-dropdown-link{
    display:flex;
    justify-content: center;
    align-items: center;
  }
}
</style>