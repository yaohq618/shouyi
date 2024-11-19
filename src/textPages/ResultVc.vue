<template>
    <el-card class="result-container">
      <h2 class="title">SSU rRNA序列对比结果(根据18S序列库比对结果)</h2>
      <div class="info-section">
        <el-descriptions title="" :column="1" direction="vertical" border>
          <el-descriptions-item label="样本编号">{{ sampleNumber }}</el-descriptions-item>
          <el-descriptions-item label="匹配结果">
            <el-table :data="alignmentResults" style="width: 100%" @row-click="handleRowClick" highlight-current-row stripe>
              <el-table-column prop="sequenceName" label="序列名称" width="180"></el-table-column>
              <el-table-column prop="sequenceNumber" label="序列号" width="180"></el-table-column>
              <el-table-column prop="species" label="虫种"></el-table-column>
              <el-table-column prop="subtype" label="亚型"></el-table-column>
              <el-table-column prop="matchLength" label="匹配长度"></el-table-column>
              <el-table-column prop="identity" label="一致性">
                <template #default="scope">
                  {{ scope.row.identity }}%
                </template>
              </el-table-column>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="基因序列（显示库中匹配的序列）">
            <div class="alignment-results">
              <div v-for="(result, index) in alignmentResults" :key="index" class="alignment-result-details">
                <el-collapse-transition>
                  <div v-show="expandedIndex === index" class="result-details">
                    <el-descriptions :column="1" direction="vertical" border>
                      <el-descriptions-item label="序列名称"><strong>{{ result.sequenceName }}</strong></el-descriptions-item>
                      <el-descriptions-item label="具体序列">
                        <pre>{{ result.alignment }}</pre>
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                </el-collapse-transition>
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { ElDescriptions, ElDescriptionsItem, ElTable, ElTableColumn, ElCollapseTransition } from "element-plus";
  
  // 静态数据
  const sampleNumber = ref("Sample_001");
  const matchResultFileName = ref("match_results.txt");
  const geneSequence = ref(">Gene_Sequence\nACGTACGTACGT");
  
  const alignmentResults = ref([
    {
      sequenceName: "Sequence_1",
      sequenceNumber: "Seq_001",
      species: "Species_A",
      subtype: "Subtype_X",
      matchLength: 12,
      identity: 95,
      alignment: ">Sequence_1\nACGTACGTACGT"
    },
    {
      sequenceName: "Sequence_2",
      sequenceNumber: "Seq_002",
      species: "Species_B",
      subtype: "Subtype_Y",
      matchLength: 12,
      identity: 85,
      alignment: ">Sequence_2\nACGAACGTACGT"
    },
    {
      sequenceName: "Sequence_3",
      sequenceNumber: "Seq_003",
      species: "Species_C",
      subtype: "Subtype_Z",
      matchLength: 12,
      identity: 75,
      alignment: ">Sequence_3\nACGTACGGACGT"
    }
  ]);
  
  const expandedIndex = ref(null);
  
  function handleRowClick(row, column, event) {
    // 查找当前行的索引
    const index = alignmentResults.value.findIndex(item => item.sequenceName === row.sequenceName);
    
    // 如果当前索引已经在 expandedIndex 中，则关闭展开
    if (expandedIndex.value === index) {
      expandedIndex.value = null;
    } else {
      expandedIndex.value = index; // 打开展开
    }
  }
  </script>
  
  <style scoped>
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
  
  
  
  
  
  
  