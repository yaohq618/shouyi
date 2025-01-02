<template>
  <div v-if="!isShow">
    <el-carousel :interval="100000" type="card" height="300px">
      <el-carousel-item v-for="item in 6" :key="item">
        <h3 text="2xl" justify="center">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>

    <el-card shadow="hover" class="information">
      <template #header>
        <div class="card-header">
          <span>通知</span>
          <router-link to="/home/information" @click="isShow=!isShow" class="more-link">更多 >></router-link>
        </div>
      </template>
      <NotificationVc v-for="(item,index) in newsItems.slice(0,2)" :key="index"
      :id="item.id" 
      :title="item.title"
      :date="item.date"
      :description="item.content" ></NotificationVc>
    </el-card>
  </div>
  <router-view></router-view>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, onBeforeUnmount, onUpdated } from 'vue';
import { informationService } from "@/api/information";
import NotificationVc from "@/components/NotificationVc.vue"


// 示例新闻数据
const newsItems = ref([]);

// 获取通知数据
const fetchContours = async () => {
  try {
    let result = await informationService();
    console.log("result.data.data", result.data.data);
    newsItems.value = result.data.data;
  } catch (error) {
    console.error("Failed to fetch contours:", error);
  }
};

onMounted(()=>{
  fetchContours()
})

import { useRoute } from 'vue-router';

const isShow = ref(false)
onUpdated(()=>{
  const route = useRoute()
  if(route.path == "/home"){
    isShow.value = false
  }else{
    isShow.value = true
  }
})


</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.information {
  margin-top: 10px;
  
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.more-link {
  color: #0f0f0f;
  text-decoration: none;
}

.news-list {
  list-style-type: none;
  padding: 0;
}

.news-list li {
  margin-bottom: 1rem;
}

.news-list p,
.news-list h3 {
  color: #0f0f0f;
  font-size: 15px;
}

.date {
  color: gray;
}
</style>