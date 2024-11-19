<template>
  <div class="container">
    <div class="underline-text">
      院士
    </div>
    <div class="officials-grid">
      <div v-for="(official, index) in officials" :key="index" class="official-card">
        <img :src="official.image" :alt="official.name" class="official-photo">
        <div class="official-info">
          <p class="official-name">{{ official.name }}</p>
          <p class="official-years">{{ official.years }}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="underline-text">
      创新团队
    </div>
    <div class="officials-grid">
      <div v-for="(official, index) in officials" :key="index" class="official-card">
        <img :src="official.image" :alt="official.name" class="official-photo">
        <div class="official-info">
          <p class="official-name">{{ official.name }}</p>
          <p class="official-years">{{ official.years }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OfficialsComponent',
  data() {
    return {
      officials: [
        { name: '张三', years: '1953-', image: require('@/assets/avatar.jpg') },
        { name: '李四', years: '1962-', image: require('@/assets/avatar.jpg') },
        { name: '赵五', years: '1942-', image: require('@/assets/avatar.jpg') },
        { name: '莫六', years: '1955-1997', image: require('@/assets/avatar.jpg') },
        { name: '黄七', years: '1950-', image: require('@/assets/avatar.jpg') },
        { name: '肖八', years: '1931-1997', image: require('@/assets/avatar.jpg') },
        
      ]
    };
  }
};
</script>

<style scoped>

.container{
  width:600px;
  margin-left:150px;
  margin-top:40px;
 
}
.officials-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  /* 卡片之间的间距 */
  padding: 16px;
  margin-top:20px;
  margin-left:30px;
}

.official-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  margin-right:30px;
}

.official-photo {
  width: 100%;
  height: auto;
  display: block;
  border-bottom: 1px solid #ddd;
}

.official-info {
  padding: 16px;
}

.official-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.official-years {
  font-size: 10px;
  color: #666;
}

.underline-text {
  position: relative;
  display: inline-block;
  /* 让容器仅包裹文本 */
}

.underline-text::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -5px;
  /* 调整此值以改变线条与文本的距离 */
  width: 650px;
  /* 线条宽度为文本宽度的120% */
  height: 1px;
  /* 线条高度 */
  background-color: #81D2F4;
  /* 线条颜色 */
  z-index: -1;
  /* 确保线条在文本之下 */
}
</style>