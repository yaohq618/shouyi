<template>
  <el-form v-if="showResult" ref="formRef" :model="formData" :rules="rules" label-width="90px" class="formContainer">
    <div class="leftContainer">
      <el-form-item prop="sampleNumber" class="sampleContainer">
        <div class="titleText"><el-text>样本编号</el-text></div>
        <el-input class="sampleImput" v-model="formData.sampleNumber"></el-input>
      </el-form-item>
      <el-form class="geoContainer">
        <div class="testT">
          <el-text>地理来源</el-text>
        </div>
        <el-form-item label="国家" prop="country">
          <el-input v-model="formData.country"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-input v-model="formData.province"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="formData.city"></el-input>
        </el-form-item>
        <el-form-item label="县/镇" prop="district">
          <el-input v-model="formData.district"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="addressDetails">
          <el-input v-model="formData.addressDetails"></el-input>
        </el-form-item>
      </el-form>

      <el-form class="samplemessageContainer">
        <div class="testT">
          <el-text>样本信息</el-text>
        </div>
        <el-form-item label="样本类型">
          <el-select v-model="formData.sampleType" placeholder="请选择" @change="handleSampleTypeChange">
            <el-option value="粪便">粪便</el-option>
            <el-option value="其他">其他</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showOtherInput" label-width="auto">
          <el-input v-model="formData.otherSampleType" placeholder="请输入样本类型"></el-input>
        </el-form-item>
        <el-form-item label="采集时间">
          <el-date-picker v-model="formData.collectionTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="样本储存条件" label-width="auto">
          <el-select v-model="formData.storageConditions" placeholder="请选择">
            <el-option value="2.5%重铬酸钾">2.5%重铬酸钾</el-option>
            <el-option value="75%酒精">75%酒精</el-option>
            <el-option value="-80℃冷藏">-80℃冷藏</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="样本送检人/单位" label-width="auto">
          <el-input v-model="formData.sender"></el-input>
        </el-form-item>
      </el-form>

      <el-form class="outbreakContainer">
        <div class="testT">
          <el-text>暴发情况</el-text>
        </div>
        <el-form-item label="开始时间">
          <el-date-picker v-model="formData.startTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="formData.endTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="报告时间">
          <el-date-picker v-model="formData.reportTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-row>
          <el-col :span="13">
            <el-form-item label="病畜数">
              <el-input-number v-model="formData.diseaseCount" controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="死亡数">
              <el-input-number v-model="formData.deathCount" controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="rightContainer">
      <el-form class="hostsourceContainer">
        <div class="testT">
          <el-text>宿主来源</el-text>
        </div>

        <div class="hostsourceLeft">
          <el-form-item label="宿主来源" label-width="auto" prop="hostSource">
            <el-select v-model="formData.hostSource" placeholder="请选择">
              <el-option value="奶牛">奶牛</el-option>
              <el-option value="肉牛">肉牛</el-option>
              <el-option value="绵羊">绵羊</el-option>
              <el-option value="山羊">山羊</el-option>
              <el-option value="猫">猫</el-option>
              <el-option value="狗">狗</el-option>
              <el-option value="猪">猪</el-option>
              <el-option value="啮齿类动物">啮齿类动物</el-option>
              <el-option value="其他">其他</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="性别" label-width="auto" prop="gender">
            <el-select v-model="formData.gender" placeholder="请选择">
              <el-option value="雄性">雄性</el-option>
              <el-option value="female">雌性</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否腹泻" label-width="auto" prop="diarrhea">
            <el-select v-model="formData.diarrhea" placeholder="请选择" @change="handlediarrheaChange">
              <el-option value="是">是</el-option>
              <el-option value="否">否</el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="showdiarrheaType" label-width="auto">
            <el-select v-model="formData.diarrheaType" placeholder="请选择腹泻类型">
              <el-option value="中度腹泻">中度腹泻</el-option>
              <el-option value="水样腹泻">水样腹泻</el-option>
              <el-option value="血便">血便</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否死亡" label-width="auto" prop="death">
            <el-select v-model="formData.death" placeholder="请选择">
              <el-option value="是">是</el-option>
              <el-option value="否">否</el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="hostsourceRight">
          <el-form-item label="宿主具体品种" prop="hostSpecies" label-width="auto">
            <el-input v-model="formData.hostSpecies"></el-input>
          </el-form-item>
          <el-form-item label="月龄/年龄" prop="age">
            <el-input-number v-model="formData.age" controls-position="right"></el-input-number>
          </el-form-item>

          <el-form-item label="其他症状" prop="otherSymptoms">
            <el-select v-model="formData.otherSymptoms" placeholder="请选择">
              <el-option value="呕吐">呕吐</el-option>
              <el-option value="发热">发热</el-option>
              <el-option value="消瘦">消瘦</el-option>
              <el-option value="被毛粗乱">被毛粗乱</el-option>
              <el-option value="其他">其他</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="免疫力" prop="immunity" label-width="auto">
            <el-select v-model="formData.immunity" placeholder="请选择">
              <el-option value="正常">正常</el-option>
              <el-option value="免疫力缺陷">免疫力缺陷</el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>

      <el-form class="testresultContainer">
        <div class="testT">
          <el-text>检测结果</el-text>
        </div>
        <div class="testresultContainerLeft">
          <el-form-item label="显微镜检查结果" label-width="auto" prop="microscopyResult">
            <el-select v-model="formData.microscopyResult" placeholder="请选择">
              <el-option value="阳性">阳性</el-option>
              <el-option value="阴性">阴性</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="SSU rRNA PCR" label-width="auto" prop="ssuRnaPcr">
            <el-select v-model="formData.ssuRnaPcr" placeholder="请选择">
              <el-option value="阳性">阳性</el-option>
              <el-option value="阴性">阴性</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="gp60 PCR" label-width="auto" prop="gp60Pcr">
            <el-select v-model="formData.gp60Pcr" placeholder="请选择">
              <el-option value="阳性">阳性</el-option>
              <el-option value="阴性">阴性</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="qPCR Ct值" label-width="auto" prop="qpcrCtValue">
            <el-input v-model="formData.qpcrCtValue"></el-input>
          </el-form-item>
        </div>
        <div class="testresultContainerRight">
          <el-form-item label="虫种" prop="insectspecies">
            <el-input v-model="formData.insectspecies"></el-input>
          </el-form-item>
          <el-form-item label="亚型" prop="subtype">
            <el-input v-model="formData.subtype"></el-input>
          </el-form-item>
        </div>
      </el-form>

      <el-form class="sequenceuploadContainer">
        <div class="testT">
          <el-text>序列上传</el-text>
        </div>

        <el-form-item label="标准序列选择" label-width="auto" prop="standardSequence">
          <el-select v-model="formData.selectedStandardSequence" placeholder="请选择标准序列">
            <el-option label="SSU rRNA RNA 序列" value="SSU"></el-option>
            <el-option label="gp60 序列" value="gp60"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="请选择文件上传" prop="file">
          <el-upload action="/upload/sequence" :before-upload="beforeUpload" :on-success="handleFileSuccess"
            :on-change="handleFileChange" :file-list="fileList" :auto-upload="false" :show-file-list="false">
            <el-button size="small" type="primary" :loading="loading">
              {{ selectedFileName || '未选择文件' }}
            </el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <div class="buttonContainer">
        <el-button type="primary" @click="submitForm">比对并进行保存</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </div>
  </el-form>
  <router-view></router-view>
</template>

<script setup>
import { reactive, ref,onMounted, onUpdated } from "vue";
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElRadioGroup,
  ElRadio,
  ElInputNumber,
  ElSwitch,
  ElUpload,
  ElButton,
} from "element-plus";
const formRef = ref(null);
const formData = reactive({
  country: "",
  province: "",
  city: "",
  district: "",
  addressDetails: "",
  sampleType: "",
  otherSampleType: "",
  collectionTime: "",
  storageConditions: "",
  sender: "",
  startTime: null,
  endTime: "",
  reportTime: "",

  diseaseCount: null,
  deathCount: null,
  hostSource: "",
  gender: "",
  diarrhea: "",
  diarrheaType: "",
  death: "",

  hostSpecies: "",
  age: null,
  otherSymptoms: "",
  immunity: "",

  microscopyResult: null,
  file: "",
  selectedStandardSequence: null,
  qpcrCtValue: null,
  insectspecies: null,
});
const rules = {};
// 假设服务器返回了序列数据
const router = useRouter();

const showResult = ref(true)

onUpdated(()=>{
  console.log(router)
  console.log(router.currentRoute._value.path)
  if(router.currentRoute._value.path == "/datasubmit/resultSSU"){
    showResult.value = false;
  }else{
    showResult.value = true;
  }
})



function submitForm() {
  if (!formRef.value.validate()) return;
  console.log("表单数据:", formData);
  router.push('/datasubmit/resultSSU');
  // 这里可以添加提交表单的逻辑，比如发送数据到服务器
  // sendFormDataToServer(formData);

}

// const sendFormDataToServer = async (data) => {
//   try {
//     const response = await fetch('/api/submit', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (response.ok) {
//       const result = await response.json();
//       ElMessage.success('表单提交成功');
//       console.log('Submit Response:', result);
//     } else {
//       ElMessage.error('表单提交失败');
//     }
//   } catch (error) {
//     ElMessage.error('表单serve提交发生错误');
//     console.error('Error submitting form data:', error);
//   }
// };

function resetForm() {
  formRef.value.resetFields();
}

// 选择其他显示填写框
const showOtherInput = ref(false);
const handleSampleTypeChange = (value) => {
  if (value == "其他") {
    showOtherInput.value = true;
  } else {
    showOtherInput.value = false;
  }
};

//选择腹泻类型
const showdiarrheaType = ref(false);
const handlediarrheaChange = (value) => {
  if (value == "是") {
    showdiarrheaType.value = true;
  } else {
    showdiarrheaType.value = false;
  }
};

//文件上传
const selectedStandardSequence = ref("");
const selectedFileName = ref("未选择文件");
const fileList = ref([]);
const loading = ref(false);


//文件上传前的检查
function beforeUpload(file) {
  const isFasta = file.type === "chemical/x-fasta" || file.type === "text/plain";
  if (!isFasta) {
    ElMessage.error("只允许上传 .fasta 或 .faa 格式的文件");
    return false;
  }
  console.log('6666');
  return true;
}

function handleExceed(files, fileList) {
  ElMessage.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
}

function handleFileSuccess(response, file, fileList) {
  console.log('6666');
  selectedFileName.value = file.name;
  this.formData.file = file;
  loading.value = false;
}

function handleFileChange(file) {
  console.log('7777');
  selectedFileName.value = file.name;
  fileList.value = [file];
}




</script>

<style scoped>
.formContainer {
  width: 1200px;
  margin-left: px;
  display: flex;
  flex-direction: row;
  padding-top: 20px;
  z-index: 1;
}

.sampleContainer,
.geoContainer,
.samplemessageContainer,
.outbreakContainer,
.hostsourceContainer,
.testresultContainer,
.sequenceuploadContainer {
  border-width: 1px;
  border-color: black;
  border-style: solid;
  padding: 10px;
  padding-left: 5px;
}

.hostsourceContainer,
.testresultContainer {
  display: flex;
  flex-direction: row;
}

.rightContainer .el-form {
  margin-bottom: 20px;
}

.testT {
  width: 80px;
  height: 40px;
  text-align: center;
  margin-left: 20px;
  margin-top: -20px;
  background: white;
}

.geoContainer .el-form-item,
.samplemessageContainer .el-form-item,
.outbreakContainer .el-form-item {
  margin-left: 80px;
  max-width: 400px;
}

.sequenceuploadContainer .el-form-item {
  margin-left: 100px;
  width: 300px;
}

.leftContainer {
  width: 600px;
  display: flex;
  flex-direction: column;
}

.leftContainer .el-form {
  margin-bottom: 20px;
}

.rightContainer {
  display: flex;
  flex-direction: column;
}

.titleText {
  width: 80px;
  height: 40px;
  text-align: center;
  margin-left: -70px;
  margin-top: -30px;
  background: white;
}

.geoContainer .titleText {
  margin-bottom: 25px;
  /* 可以调整标题和表单项之间的间隔 */
}

.geoContainer .el-form-item {
  margin-bottom: 15px;
  /* 设置每个表单项的底部间隔 */
}

.samplemessageContainer .titleText {
  margin-bottom: 20px;
}

.samplemessageContainer .el-form-item {
  margin-bottom: 15px;
  /* 设置每个表单项的底部间隔 */
}

.outbreakContainer .titleText {
  margin-bottom: 20px;
}

.outbreakContainer .el-form-item {
  margin-bottom: 15px;
  /* 设置每个表单项的底部间隔 */
}

.rightContainer {
  margin-left: 15px;
  width: 800px;
}

.hostsourceContainer .titleText {
  margin-bottom: 220px;
}

.testresultContainer .titleText {
  margin-bottom: 170px;
}

.hostsourceLeft .el-form-item,
.testresultContainerLeft .el-form-item {
  margin-bottom: 15px;
  width: 250px;
  /* 设置每个表单项的底部间隔 */
}

.hostsourceContainer .hostsourceRight .el-form-item,
.testresultContainerRight .el-form-item {
  margin-bottom: 15px;
  /* 设置每个表单项的底部间隔 */
}

.hostsourceRight,
.testresultContainerRight {
  margin-left: 40px;
}

.sequenceupload {
  display: flex;
  flex-direction: column;
}

.test {
  width: 80px;
  height: 40px;
  text-align: center;
  margin-left: -70px;
  margin-top: -90px;
  background: white;
}

.buttonContainer {
  margin-top: 10px;
  margin-left: 400px;
}

.buttonContainer .el-button {
  margin-right: 20px;
}
</style>