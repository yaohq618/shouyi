<template>
  <div>
    <div class="top">
      <div class="select">
        <!-- 新增省份选择框 -->
        <el-select v-model="selectedProvince" placeholder="选择省份" @change="updateCharts" style="margin-right: 10px;">
          <el-option value="" label="全国"></el-option>
          <el-option v-for="province in provinces" :key="province" :label="province" :value="province"></el-option>
        </el-select>
        <!-- 新增宿主选择框 -->
        <el-select v-model="host" placeholder="选择宿主" @change="updateCharts">
          <el-option value="奶牛" label="奶牛"></el-option>
          <el-option value="肉牛" label="肉牛"></el-option>
          <el-option value="绵羊" label="绵羊"></el-option>
        </el-select>
      </div>
      <div class="map">
        <div ref="map" style="width: 800px; height: 600px;"></div>
        <div style="margin-top: 10px; display: flex; align-items: center;">
          <el-select v-model="selectedYear" placeholder="选择年份" @change="updateCharts"
            style="margin-top: 10px;width:100px">
            <el-option v-for="year in availableYears" :key="year" :label="year" :value="year"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="speciesSelect">
        <el-select v-model="species" placeholder="虫种" @change="updateCharts">
          <el-option value="C.parvum" label="C.parvum"></el-option>
      </el-select>
      </div>
      <div class="barChart_table">
        <div ref="barChart" class="barChart"></div>
      <div class="table">
        <el-table :data="filteredData" class="rounded-table">
          <el-table-column prop="province" label="省份/直辖市/自治区" width="200"></el-table-column>
          <el-table-column prop="sampleSize" label="样本数" width="100"></el-table-column>
          <el-table-column prop="parvumSize" label="阳性数" width="100"></el-table-column>
          <el-table-column prop="infectionRate" label="感染率" width="100"></el-table-column>
        </el-table>
      </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import * as echarts from 'echarts/core';
import { GeoComponent } from 'echarts/components';
import { MapChart } from 'echarts/charts';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { VisualMapComponent } from 'echarts/components'; // 导入 VisualMapComponent
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'; // 导入 TitleComponent
import { mapData } from '@/assets/china.js'; // 引入本地GeoJSON数据
import { ElSelect, ElOption, ElTable, ElTableColumn } from 'element-plus';

// 注册必须的组件
echarts.use([GeoComponent, MapChart, BarChart, CanvasRenderer, VisualMapComponent, TitleComponent, GridComponent, TooltipComponent]);

// 获取DOM元素引用
const map = ref(null);
const barChart = ref(null);

// 静态流行病数据 - 省份、对应数值和年份
const epidemicData = ref([]);

// 可用的年份列表
const availableYears = ref([])

// 当前选中的年份
const selectedYear = ref(null);

//虫种
const species = ref("C.parvum")
// 定义省份列表
const provinces = ref([
  "北京市", "天津市", "河北省", "山西省", "内蒙古自治区", "辽宁省", "吉林省", "黑龙江省",
  "上海市", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省",
  "湖北省", "湖南省", "广东省", "广西壮族自治区", "海南省", "重庆市", "四川省",
  "贵州省", "云南省", "西藏自治区", "陕西省", "甘肃省", "青海省", "宁夏回族自治区",
  "新疆维吾尔自治区"
]);

// 当前选中的省份
const selectedProvince = ref("");

// 当前选中的宿主
const host = ref("奶牛");

// API服务
import { sampleService,sampleYearService } from '@/api/sample';

// 获取样本数据
const getSample = async () => {
  let params = {
    year: selectedYear.value,
    host: host.value,
    province: selectedProvince.value || undefined // 如果选择了特定省份，则传递该值
  };
  try {
    let result = await sampleService(params);
    console.log("result.data.data", result.data.data);
    epidemicData.value = result.data.data;
    console.log("epidemicData.value1", epidemicData.value);

    if (availableYears.value.length > 0 && !selectedYear.value) {
      selectedYear.value = availableYears.value[0];
    }
  } catch (error) {
    console.error("Failed to fetch sample data:", error);
  }
};
//获取年份
const getYear = async()=>{
  let result = await sampleYearService()
  availableYears.value = result.data.data
}
// 初始化 ECharts 实例
let mapChart, barChartInstance;

onMounted(async () => {
  mapChart = echarts.init(map.value);
  barChartInstance = echarts.init(barChart.value);

  // 注册中国地图数据
  echarts.registerMap('china', mapData);

  await getYear()
  // 获取初始数据
  await getSample();
  updateCharts();
});

const filteredData = ref([])
// 更新图表的方法
function updateCharts() {
  console.log("epidemicData.value2", epidemicData.value);

  // 根据选择过滤数据
  filteredData.value = epidemicData.value.filter(item =>
    (!selectedProvince.value || item.province === selectedProvince.value) &&
    item.year === selectedYear.value
  );

  // 更新地图图表配置...
  const mapOption = {
    title: {
      text: '中国隐孢子虫流行分布图',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return `${params.name}<br/>病例数量: ${params.value} (例)`;
      }
    },
    geo: {
      map: 'china',
      roam: false, // 禁用缩放和平移
      label: {
        show: false // 不显示市级名称
      },
      itemStyle: {
        areaColor: '#eee', // 地图背景色
        borderColor: '#444' // 边界线颜色
      },
      center: [104.195397, 37.298456], // 地图居中（中国的地理中心）
      zoom: 1.2 // 调整缩放级别以适应地图居中
    },
    visualMap: {
      show: true,
      left: '5%', // 确保有足够的空间
      bottom: '5%', // 确保有足够的空间
      seriesIndex: 0,
      type: 'piecewise',
      pieces: [
        { min: 5000, color: 'rgb(112,22,29)' },
        { min: 500, max: 2000, color: 'rgb(203,42,47)' },
        { min: 100, max: 499, color: 'rgb(229,90,78)' }, // 更改阈值以匹配数据范围
        { min: 10, max: 99, color: 'rgb(245,158,131)' },
        { min: 1, max: 9, color: 'rgb(253,235,107)' }
      ],
      textStyle: {
        color: '#000000'
      }
    },
    series: [
      {
        name: '流行病例数量',
        type: 'map',
        geoIndex: 0,
        data: filteredData.value.map(item => ({ name: item.province, value: item.parvumSize })),
        label: {
          show: false // 不显示市级名称
        }
      }
    ]
  };

  // 使用配置项设置地图图表
  mapChart.setOption(mapOption);

  // 更新柱状图配置...
  const barOption = {
    title: {
      text: '各省感染率',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: filteredData.value.length ? filteredData.value.map(item => item.province) : ['无数据'],
      axisLabel: {
        interval: 0,
        rotate: 45 // 根据需要调整标签旋转角度
      }
    },
    yAxis: {
      type: 'value',
      name: '感染率',
      min: 0,
      max: 1, // 根据实际情况调整最大值
      interval: 0.1 // 根据实际情况调整间隔
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      containLabel: true
    },
    series: [
      {
        name: '感染率',
        type: 'bar',
        data: filteredData.value.length ? filteredData.value.map(item => item.infectionRate) : [0],
        label: {
          show: true,
          position: 'top'
        }
      }
    ]
  };

  // 使用配置项设置柱状图
  barChartInstance.setOption(barOption);
}

// 监听选择的变化
watch([selectedYear, selectedProvince, host], async () => {
  await getSample();
  updateCharts();
});
</script>

<style scoped>
.select {
  display: flex;
  margin-left: 15px;
  margin-top: 10px;
}

.select .el-select {
  width: 100px;
}

.top {
  border-radius: 10px;
  border: 2px solid #dcdcdc;
  padding-top: 10px;
  padding-bottom: 50px;
  width: 95%;
}

.map {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bottom {
  width: 95%;
  border-radius: 10px;
  border: 2px solid #dcdcdc;
  margin-top: 10px;
  padding-bottom: 20px;
}
.speciesSelect{
  width: 150px;
  display: flex;
  margin-left: 15px;
  margin-top: 10px;
}
.barChart_table{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.barChart {
  width: 1000px;
  height: 500px;
  margin-top: 20px;
  border-bottom: 2px dashed #ccc;
}

.table {
  display: flex;
  justify-content: center;
}

.rounded-table {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #dcdcdc;
  overflow: hidden;
  margin-top: 40px;
  height: 300px;
  display: flex;
  justify-content: center;
}
</style>