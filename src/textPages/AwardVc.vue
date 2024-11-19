<template>
  <div class="achievements-table-container">
    <div class="table-section" v-for="(section, index) in sections" :key="index">
      <div class="table-section-title">
        {{ section.title }}
      </div>
      <ul>
        <li v-for="(item, idx) in section.items" :key="idx">
          <a href="#" @click.prevent="openDetails(item)">
            {{ item.text }}
          </a>
        </li>
      </ul>
      <button @click="loadMore(section)" v-if="section.hasMore">更多</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const sections = ref([
  {
    title: '国家级成果一览表',
    items: [
      { text: '2021年国家级成果1' },
      { text: '2022年国家级成果2' },
      { text: '2023年国家级成果3' },
    ],
    hasMore: true,
    allItems: [
      { text: '2021年国家级成果1' },
      { text: '2022年国家级成果2' },
      { text: '2023年国家级成果3' },
      { text: '2024年国家级成果4' },
      { text: '2025年国家级成果5' },
      { text: '2026年国家级成果6' },
    ],
  },
  {
    title: '省部级成果一览表',
    items: [
      { text: '2021年省部级成果1' },
      { text: '2022年省部级成果2' },
      { text: '2023年省部级成果3' },
    ],
    hasMore: true,
    allItems: [
      { text: '2021年省部级成果1' },
      { text: '2022年省部级成果2' },
      { text: '2023年省部级成果3' },
      { text: '2024年省部级成果4' },
      { text: '2025年省部级成果5' },
      { text: '2026年省部级成果6' },
    ],
  },
  {
    title: '院级成果一览表',
    items: [
      { text: '2021年院级成果1' },
      { text: '2022年院级成果2' },
      { text: '2023年院级成果3' },
    ],
    hasMore: true,
    allItems: [
      { text: '2021年院级成果1' },
      { text: '2022年院级成果2' },
      { text: '2023年院级成果3' },
      { text: '2024年院级成果4' },
      { text: '2025年院级成果5' },
      { text: '2026年院级成果6' },
    ],
  },
]);

function openDetails(item) {
  alert(`查看详细信息：${item.text}`);
}

function loadMore(section) {
  const currentLength = section.items.length;
  const newItems = section.allItems.slice(currentLength, currentLength + 5);
  section.items.push(...newItems);
  if (currentLength + newItems.length >= section.allItems.length) {
    section.hasMore = false;
  }
}
</script>

<style scoped>
.achievements-table-container {
  display: flex;
  justify-content: space-between;
  background-color: white; /* 背景颜色改为白色 */
}

.table-section {
  width: calc(33% - 20px); /* 调整宽度以适应三栏布局 */
  background-color: #ECF4F7; /* 背景颜色改为白色 */
  padding: 20px;
  margin-top: 80px;
  width:300px;
}
.table-section-title{
  display:flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
}

dl {
  list-style-type: none;
  padding: 0;
  /* 文字居中 */
}

li {
  margin-bottom: 5px;
}

a {
  text-decoration: none;
  color: black; /* 默认文字颜色为黑色 */
  display: inline-block; /* 使链接块级元素，方便居中 */
  transition: color 0.3s; /* 平滑过渡效果 */
}

a:hover {
  color: #BDDFEE; /* 鼠标悬停时文字颜色变为浅绿色 */
}

button {
  display: block;
  margin: 20px auto;
}


</style>