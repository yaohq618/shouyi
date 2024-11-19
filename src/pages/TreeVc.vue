<template>
  <div class="mafft-container">
    <h2 class="mafft-title">Mafft 序列比对工具</h2>
    <el-form ref="mafftForm" :model="formData" :rules="rules" label-width="120px">
      <!-- 实验命名 -->
      <el-form-item label="实验命名" prop="experimentName">
        <el-input v-model="formData.experimentName" placeholder="请输入实验名称" />
      </el-form-item>

      <!-- 算法选择 -->
      <el-form-item label="算法选择" prop="algorithmType">
        <el-select v-model="formData.algorithmType" placeholder="请选择构建树的算法">
          <el-option label="Neighbor-Joining (NJ)" value="NJ"></el-option>
          <el-option label="Maximum Likelihood (ML)" value="ML"></el-option>
          <el-option label="Bayesian Inference (BI)" value="BI"></el-option>
        </el-select>
      </el-form-item>

      <!-- 文件上传 -->
      <el-form-item label="文件上传" prop="file">
        <el-upload
          class="upload-demo"
          drag
          action="#"
          :before-upload="handleBeforeUpload"
          :on-change="handleFileChange"
          :file-list="fileList"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">支持 FASTA 格式文件，每个文件不超过 2MB</div>
          </template>
        </el-upload>
      </el-form-item>

      <!-- 序列输入 -->
      <el-form-item label="序列输入" prop="sequence">
        <el-input
          v-model="formData.sequence"
          type="textarea"
          placeholder="请输入FASTA格式的序列"
          rows="8"
        />
      </el-form-item>

      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交并生成系统发育树</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "MafftComponent",
  data() {
    return {
      formData: {
        experimentName: "",  // 实验名称
        file: null,         // 上传的文件
        sequence: "",       // 输入的序列
      },
      fileList: [],  // 上传文件列表
      rules: {
        experimentName: [{ required: true, message: "请输入实验名称", trigger: "blur" }],
        sequence: [
          {
            validator: (rule, value, callback) => {
              if (!value && !this.fileList.length) {
                callback(new Error("请输入序列或上传文件"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 上传文件前检查
    handleBeforeUpload(file) {
      const isFASTA = file.name.endsWith(".fasta") || file.name.endsWith(".fa");
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isFASTA) {
        this.$message.error("只支持 FASTA 格式文件上传");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过2MB");
        return false;
      }
      return true;
    },
    // 文件改变时更新文件列表
    handleFileChange(file, fileList) {
      this.fileList = fileList;
      this.formData.file = file.raw;
    },
    // 提交表单
    handleSubmit() {
      this.$refs.mafftForm.validate((valid) => {
        if (valid) {
          const formData = new FormData();
          formData.append("experimentName", this.formData.experimentName);
          if (this.formData.file) {
            formData.append("file", this.formData.file);
          }
          if (this.formData.sequence) {
            formData.append("sequence", this.formData.sequence);
          }
          this.$message.success("表单已提交");
          // 在此处发送数据至后端 API
          // axios.post('/api/mafft', formData).then(response => {...})
        } else {
          this.$message.error("请完善表单信息");
        }
      });
    },
    // 重置表单
    handleReset() {
      this.$refs.mafftForm.resetFields();
      this.fileList = [];
    },
  },
};
</script>

<style scoped>
.mafft-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-family: 'Arial', sans-serif;
}

.mafft-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.el-form-item__label {
  font-weight: bold;
  font-size: 16px;
  width: 120px; /* 固定宽度，确保对齐 */
}

.el-input {
  width: 100%;
  border-radius: 8px;
}

.upload-demo {
  border: 2px dashed #409EFF;
  background-color: #e6f7ff;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.upload-demo:hover {
  background-color: #d4eaff;
}

.el-upload__text {
  font-size: 15px;
  color: #333;
}

.el-upload__tip {
  font-size: 13px;
  color: #888;
  margin-top: 8px;
}

.el-button {
  margin-top: 20px;
  border-radius: 8px;
  font-size: 14px;
}
</style>