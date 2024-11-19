<template>
  <div class="user-info">
    <h2>当前登录信息</h2>
    <table class="info-table">
      <tr>
        <th>用户编号</th>
        <td>{{ userInfo.userNumber }}</td>
      </tr>
      <tr>
        <th>姓名</th>
        <td>{{ userInfo.name }}</td>
      </tr>
      <tr>
        <th>电话</th>
        <td>{{ userInfo.phone }}</td>
      </tr>
      <tr>
        <th>地区</th>
        <td>{{ userInfo.region }}</td>
      </tr>
      <tr>
        <th>角色</th>
        <td>{{ userInfo.role }}</td>
      </tr>
    </table>
    <div class="actions">
      <button @click="logout">退出登录</button>
      <button @click="editInfo">修改</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const userInfo = ref({
  userNumber: 'Y20243170130',
  name: '张三',
  phone: '13715966548',
  region: '北京',
  role: '普通用户'
});

function logout() {
  // Implement logout logic here
}

function editInfo() {
  // Implement edit info logic here
}
</script>

<style scoped>
.user-info {
  width: 100%;
  text-align: center;
}
.user-info h2{
  margin-left: -200px;
}
.info-table {
  margin-top:40px;
  border-collapse: collapse;
  width: 900px;
  margin-left:100px;
}

.info-table th,.info-table td {
  padding: 8px;
  border: 1px solid #ccc;
}
.actions{
  margin-left:500px;
  margin-top:20px;
}
.actions button {
  padding:8px 10px;
  margin-top:20px;
  margin-right: 30px;
  background-color: #4EA4CB;
  color:white;
  border:none;
  border-radius:5px;
}
</style>