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
            <option value="SSU">SSU rRNA RNA 序列 (18s)</option>
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
    <router-view></router-view>
  </div>
</template>


<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
const router = useRouter()
const expandedIndex = ref(null);
import {useBlastStore} from '@/store/blast'

const store = useBlastStore()

const formData = reactive({
  jobTitle: "",
  querySequence: "",
  file: null,
  selectedDatabase: "SSU", // 默认选中第一个选项
});

const selectedFileName = ref("未选择任何文件");
const topResults = ref([]);

const selectedSequence = ref(null);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    selectedFileName.value = file.name;
    formData.file = file;
    //store存储file
    store.setFormDataFile(file)
  }
}

// 新增一个下载文件的方法
function downloadFile(data, fileName) {
  const blob = new Blob([data], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName; // 指定下载文件的名称
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}

// 新增一个排序和过滤 BLAST 结果的方法
function filterAndSortBlastResult(result) {
  // 假设每一行都是以制表符分隔的字段
  const lines = result.split('\n').filter(line => line.trim() !== '');
  const parsedResults = lines.map(line => {
    const [queryId, subjectId, identity, alignmentLength, queryLength] = line.split('\t').map((val, index) => {
      return index === 2 || index === 3 || index === 4 ? parseFloat(val) : val;
    });

    // 计算匹配长度是否超过序列长度的60%
    const isMatchLengthValid = (alignmentLength / queryLength * 100) > 60;

    return {
      queryId,
      subjectId,
      identity,
      alignmentLength,
      queryLength,
      isMatchLengthValid
    };
  }).filter(result => result.identity > 80 && result.isMatchLengthValid);

  // 按照一致性降序排列，如果一致性相同则按对齐长度降序排列
  const sortedResults = parsedResults.sort((a, b) => {
    if (b.identity !== a.identity) {
      return b.identity - a.identity; // 按一致性降序
    }
    return b.alignmentLength - a.alignmentLength; // 如果一致性相同，按对齐长度降序
  });

  // 取前五个结果
  const topFiveResults = sortedResults.slice(0, 5);

  // 对于每个结果，解析 subjectId 并填充相应的字段
  const finalResults = topFiveResults.map(result => {
    const parts = result.subjectId.split('_');
    const sequenceId = parts[0];
    const sequenceName = parts.length > 1 ? parts.slice(1).join('_') : '';
    const species = parts.length > 2 ? parts[2] : ''; // 第二个下划线后的内容
    const subtype = parts.length > 3 ? parts[3] : '-'; // 第三个下划线后的内容

    return {
      ...result,
      sequenceId,
      sequenceName,
      species,
      subtype
    };
  });

  return finalResults;
}






async function submitBlast() {
  if (!validateForm()) {
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append("file1", formData.file); // 仅上传一个文件
  formDataToSend.append("selectedDatabase", formData.selectedDatabase);
  formDataToSend.append("blastType", formData.blastType || "blastn"); // 默认BLAST类型为blastn

  try {
    const response = await fetch("http://localhost:8087/api/blast/upload", {
      method: "POST",
      body: formDataToSend,
    });

    if (response.ok) {
      const result = await response.text(); // 直接读取纯文本
      console.log("Blast 成功:", result);
      alert("Blast 成功！");
      
      // 过滤和排序 BLAST 结果
      topResults.value = filterAndSortBlastResult(result);

      //存储到store中的blastResults
      store.setBlastResults(topResults)
      
      // 下载排序后的比对结果文件
      const sortedResult = topResults.value.map(result => [
        result.subjectId,
        result.identity,
        result.alignmentLength
      ].join('\t')).join('\n');
      downloadFile(sortedResult, 'sorted_blast_result.fasta');

      router.push('/blast/resultSSU');
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
  topResults.value = [];
  selectedSequence.value = null;
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
  margin-left: 40px;
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



/*------------------*/
.result-container {
  margin: 20px auto;
  width: 1100px;
}

.title {
  margin-bottom: 20px;
  font-size: 16px; /* 调整标题字体大小 */
  color: #333;
  text-align:center;
}

.info-section {
  margin-bottom: 20px;
}

.alignment-results {
  width: 100%;
}

.alignment-result-details {
  width: 100%;
  margin-top: 10px;
}

.result-details {
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>