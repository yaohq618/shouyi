<template>
  <div class="container">
    <h2 class="title">Blast序列比对</h2>
    <div class="blast-container">
      <form @submit.prevent="submitForm">
        <div class="job-title">
          <label for="jobTitle">实验命名:</label>
          <input id="jobTitle" v-model="formData.jobTitle" type="text" />
        </div>
        <div class="query-sequence">
          <label for="querySequence">请输入对比序列:</label>
          <textarea
            id="querySequence"
            v-model="formData.querySequence"
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <div class="file-upload">
          <label for="fileUpload">选择文件上传:</label>
          <input
            type="file"
            id="fileUpload"
            accept=".fasta,.faa"
            @change="handleFileUpload"
            style="display: none"
          />
          <label for="fileUpload" class="file-label">{{ selectedFileName }}</label>
        </div>

        <div class="database-selection">
          <label for="databaseSelection">选择数据库:</label>
          <select id="databaseSelection" v-model="formData.selectedDatabase">
            <option value="SSU">SSU rRNA RNA 序列</option>
            <option value="gp60">gp60 序列</option>
          </select>
        </div>
      </form>
    </div>
    <div class="buttons">
      <button type="button" class="blast-button" @click="submitBlast">Blast</button>
      <button type="button" class="reset-button" @click="resetForm">
        重置
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const formData = reactive({
  jobTitle: "",
  querySequence: "",
  file: null,
  selectedDatabase: "SSU", // 默认选中第一个选项
});

const selectedFileName = ref("未选择任何文件");

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    selectedFileName.value = file.name;
    formData.file = file;
  }
}

async function submitBlast() {
  if (!validateForm()) {
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append("jobTitle", formData.jobTitle);
  formDataToSend.append("querySequence", formData.querySequence);
  formDataToSend.append("selectedDatabase", formData.selectedDatabase);

  if (formData.file) {
    formDataToSend.append("file", formData.file);
  }

  try {
    const response = await fetch("/api/blast", {
      method: "POST",
      body: formDataToSend,
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Blast 成功:", result);
      alert("Blast 成功！");
    } else {
      console.error("Blast 失败:", response.statusText);
      alert("Blast 失败，请重试！");
    }
  } catch (error) {
    console.error("请求出错:", error);
    alert("请求出错，请重试！");
  }
}

function validateForm() {
  if (!formData.jobTitle.trim()) {
    alert("请填写实验命名");
    return false;
  }
  if (!formData.querySequence.trim() && !formData.file) {
    alert("请输入对比序列或选择文件上传");
    return false;
  }
  if (!formData.selectedDatabase) {
    alert("请选择数据库");
    return false;
  }
  return true;
}

function resetForm() {
  formData.jobTitle = "";
  formData.querySequence = "";
  formData.file = null;
  selectedFileName.value = "未选择任何文件";
  formData.selectedDatabase = "SSU"; // 重置为默认值
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.title {
  margin-bottom: 20px;
  font-size: 24px;
}

.blast-container {
  width: 800px;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.query-sequence {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.query-sequence label {
  font-size: 14px;
}

.query-sequence textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
}

.file-upload {
  display: flex;
  align-items: center;
}

.file-label {
  width: 200px;
  cursor: pointer;
  padding: 5px;
  margin-left: 10px;
  background-color: #ffffff;
  color: rgb(5, 5, 5);
  border-radius: 5px;
  text-align: center;
  transition: background-color 0.3s ease;
  border: 1px solid #ccc;
}

.file-label:hover {
  background-color: #d7d7d7;
}

.job-title {
  display: flex; /* 使用 Flexbox 布局 */
  align-items: center; /* 使子元素在垂直方向居中对齐 */
}

.job-title label {
  font-size: 14px;
  margin-right: 10px; /* 设置 label 和 input 之间的间距 */
  white-space: nowrap; /* 防止文字换行 */
}

.job-title input {
  padding: 5px; /* 给输入框增加内边距 */
  width: 200px; /* 设置输入框的宽度 */
  border: 1px solid #ccc;
  border-radius: 5px;
}

.database-selection {
  display: flex;
  align-items: center;
}

.database-selection label {
  font-size: 14px;
}

.database-selection select {
  width: 500px;
  padding: 10px;
  margin-left: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  
}

.blast-button,
.reset-button {
  padding: 10px 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  margin-left:40px;
}

.blast-button {
  background-color: #4ea4cb;
  color: white;
}

.blast-button:hover {
  background-color: #0977aa;
}

.reset-button {
  background-color: #6c757d;
  color: white;
}

.reset-button:hover {
  background-color: #5a6268;
}
</style>






