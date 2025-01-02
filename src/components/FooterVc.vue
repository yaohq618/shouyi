<template>
    <el-footer>
        <div class="container">
        <!-- 左侧：研究所标志 -->
        <div class="mb-4 md:mb-0">
          <img src="@/assets/avatar.jpg" alt="Institute Logo" class="w-48">
        </div>
  
        <!-- 中间：联系信息 -->
        <div class="flex-grow">
          <div class="text-center">
            <span class="block mb-1">Copyright © 中国农业科学院作物科学研究所版权所有</span>
            <span class="block mb-1">地址: 北京市海淀区中关村南大街12号 邮编: 100081 电话: 010-82109715 email: zksbgs@caas.cn</span>
            <span class="block mb-1">ics.caas.cn , 京ICP备10039560号-5 , 京公网安备 11010802014990号</span>
            <span class="block">技术支持：中国农业科学院农业信息研究所</span>
          </div>
        </div>
  
      </div>
    </el-footer>
      
  </template>
  
  <script setup>
 
  </script>
  
  <style scoped>
  /* 你可以在这里添加额外的样式 */

  .w-48{
    width:20px;
    height:20px;
  }
  .container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: white; /* 背景颜色改为白色 */
    align-content: center;
  }

  .container ,span{
    font-size:10px
  }
  

  </style>