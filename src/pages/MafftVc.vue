<template>
  <div class="container">
    <h2 class="title">Mafft序列比对及系统发育树构建</h2>
    <div class="blast-container">
      <form @submit.prevent="submitForm">
        <div class="job-title">
          <label for="jobTitle">实验命名:</label>
          <input id="jobTitle" v-model="jobTitle" type="text" />
        </div>
        <div class="database-selection">
          <label for="databaseSelection">请选择构建树的算法:</label>
          <select id="databaseSelection" v-model="selectedAlgorithm">
            <option value="upgma">UPGMA</option>
            <option value="nj">Neighbor-Joining (NJ)</option>
            <option value="ml">Maximum Likelihood (ML)</option>
          </select>
        </div>
        <div class="query-sequence">
          <label for="querySequence">请输入对比序列:</label>
          <textarea
            id="querySequence"
            v-model="querySequence"
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
      </form>
    </div>
    <div class="buttons">
      <button type="submit" class="blast-button">提交并生成系统发育树</button>
      <button type="button" class="reset-button" @click="resetForm">
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const jobTitle = ref("");
const querySequence = ref("");
const selectedFileName = ref("未选择任何文件");
const selectedAlgorithm = ref("upgma");
let uploadedFile = null;

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    selectedFileName.value = file.name;
    uploadedFile = file;
  }
}

async function submitForm() {
  if (!validateForm()) {
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append("jobTitle", jobTitle.value);
  formDataToSend.append("querySequence", querySequence.value);
  formDataToSend.append("selectedAlgorithm", selectedAlgorithm.value);

  if (uploadedFile) {
    formDataToSend.append("file", uploadedFile);
  }

  try {
    const response = await fetch("/api/mafft", {
      method: "POST",
      body: formDataToSend,
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Mafft 成功:", result);
      alert("系统发育树生成成功！");
    } else {
      console.error("Mafft 失败:", response.statusText);
      alert("系统发育树生成失败，请重试！");
    }
  } catch (error) {
    console.error("请求出错:", error);
    alert("请求出错，请重试！");
  }
}

function validateForm() {
  if (!jobTitle.value.trim()) {
    alert("请填写实验命名");
    return false;
  }
  if (!querySequence.value.trim() && !uploadedFile) {
    alert("请输入对比序列或选择文件上传");
    return false;
  }
  if (!selectedAlgorithm.value) {
    alert("请选择构建树的算法");
    return false;
  }
  return true;
}

function resetForm() {
  jobTitle.value = "";
  querySequence.value = "";
  selectedFileName.value = "未选择任何文件";
  selectedAlgorithm.value = "upgma";
  uploadedFile = null;
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
  margin-right:40px;
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






