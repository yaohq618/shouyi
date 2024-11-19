<template>
  <el-carousel :interval="4000" type="card" height="300px">
    <el-carousel-item v-for="item in 6" :key="item">
      <h3 text="2xl" justify="center">{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>
  <el-card shadow="hover" class="information">
    <template #header>
      <div class="card-header">
        <span>通知</span>
        <router-link to="/more-news" class="more-link">更多 >></router-link>
      </div>
    </template>
    <ul class="news-list">
      <li v-for="news in newsItems" :key="news.id">
        <a href="#/news/{{ news.id }}">
          <h3>{{ news.title }}</h3>
          <p>{{ news.description }}</p>
          <span class="date">{{ news.date }}</span>
        </a>
      </li>
    </ul>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';

// 示例新闻数据
const newsItems = ref([
  {
    id: 1,
    title: "系统更新须知",
    description: "2024年11月7日系统将进行更新...",
    date: "2024-11-06"
  },
  {
    id: 2,
    title: "AI赋能，数智增效，提升农业新质生产力：第二届中国计算机学会数字农业大会成功举办",
    description: "2024年11月4日，由我院主办的华南农业大学2024秋季信息IT类行业招聘会在华山区新生活动中心举行。",
    date: "2024-11-04"
  },
  // 更多新闻...
]);

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
.news-list p,.news-list h3{
  color:#0f0f0f
}
.date {
  color: gray;
}
</style>