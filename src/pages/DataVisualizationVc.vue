<template>
  <div>
    <div class="top">
      <div class="select">
        <!-- 新增省份选择框 -->
        <el-button type="primary" @click="goBack">返回上级</el-button>
        <!-- 新增宿主选择框 -->
        <el-select v-model="host" placeholder="选择宿主" @change="updateCharts">
          <el-option value="奶牛" label="奶牛"></el-option>
          <el-option value="肉牛" label="肉牛"></el-option>
          <el-option value="绵羊" label="绵羊"></el-option>
        </el-select>
      </div>
      <div class="map">
        <div ref="mapChartRef" style="height: 600px; width: 1000px"></div>
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
          <h3>{{ selectedYear }}{{ currentMapName }}微小隐孢子虫流行病学数据</h3>
          <el-table :data="tableData" class="rounded-table" :empty-text="'没有数据'">
            <el-table-column prop="[][0]" label="省份/直辖市/自治区" width="200"></el-table-column>
            <el-table-column prop="[][1]" label="样本数" width="100"></el-table-column>
            <el-table-column prop="[][2]" label="阳性数" width="100"></el-table-column>
            <el-table-column prop="[][3]" label="感染率" width="100"></el-table-column>
          </el-table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, onUpdated, watch } from "vue";
import * as echarts from "echarts/core";
import { GeoComponent } from 'echarts/components';
import { VisualMapComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { MapChart, BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
echarts.use([MapChart, BarChart, CanvasRenderer, GeoComponent, VisualMapComponent, TitleComponent, GridComponent, TooltipComponent]);

const mapChartRef = ref();
const initChinaMap = ref();
const initAdCode = ref(100000); // 默认中国地图的编码
const currentMapName = ref("中国"); // 默认地图的名称
const mapList = ref([]); // 当前展示的省市区所有数据
const historyInfo = ref([]); // 记录历史点击的省市区，用于返回查询

const barChart = ref(null);
// 静态流行病数据 - 省份、对应数值和年份
const province_InfectionSize_Data = ref([]);
const province_InfectionRate_Data = ref([]);
const tableData = ref([])

//虫种
const species = ref("C.parvum")
// 可用的年份列表
const availableYears = ref([])
// 当前选中的年份
const selectedYear = ref(2020);
// 当前选中的宿主
const host = ref("奶牛");
//省份
const province = ref()
// API服务
import {  getYearSampleService, getProvinceAndInfectionSizeSampleService, getCityAndInfectionSizeSampleService 
  ,getProvinceInfectionRateSampleService,getProvinceSampleSizeInfectionCountInfectionRateService,getHostSampleSizeInfectionCountInfectionRateService,
  getInfectionRateSampleService
} from '@/api/sample';

// 获取样本数据
const getMapSample = async () => {
  let result4 = await getYearSampleService()
  availableYears.value = result4.data.data
  if (currentLevel.value == "country") {
    let params = {
      year: selectedYear.value,
      host: host.value,
    };
    try {
      let result = await getProvinceAndInfectionSizeSampleService(params);
      province_InfectionSize_Data.value = result.data.data;
      if (availableYears.value.length > 0 && !selectedYear.value) {
        selectedYear.value = availableYears.value[0];
      }
      let result2 = await getProvinceInfectionRateSampleService(params);
      province_InfectionRate_Data.value = result2.data.data;
      console.log("province_InfectionRate_Data.value",province_InfectionRate_Data.value);

      let result3 = await getProvinceSampleSizeInfectionCountInfectionRateService(params);
      tableData.value = result3.data.data

      
    } catch (error) {
      console.error("Failed to fetch sample data:", error);
    }
  } else {
    let params = {
      province: province.value,
      year: selectedYear.value,
      host: host.value,
    };
    let params3 = {
      province: province.value,
      year: selectedYear.value,
    }
    try {
      let result = await getCityAndInfectionSizeSampleService(params);
      province_InfectionSize_Data.value = result.data.data;

      let result2 = await getInfectionRateSampleService(params);
      province_InfectionRate_Data.value = result2.data.data
      console.log("province_InfectionRate_Data.value",province_InfectionRate_Data.value);

      let result3 = await getHostSampleSizeInfectionCountInfectionRateService(params3)
      tableData.value = result3.data.data
    } catch (error) {
      console.error("Failed to fetch sample data:", error);
    }
  }

};

let barChartInstance;


const currentLevel = ref("country")
//根据当前地图的情况返回数据
const mapDataMapping = (item) => {
  if (currentLevel.value === 'country') {
    return { name: item[0], value: item[1] };
  } else {
    return { name: item.city, value: item.positiveCount };
  }
};
// 获取地图数据
const getMapData = async (code) => {
  const data = await axios
    .get(`https://geo.datav.aliyun.com/areas_v3/bound/${code}_full.json`)
    .then((res) => {
      mapList.value = [];
      if (res.status === 200) {
        // 获取当前选中的省市区的所有名称和编码
        res.data.features.forEach((item) => {
          mapList.value.push(item.properties);
        });
        renderChart(currentMapName.value, res.data);
      }
    })
    .catch(() => { });
  return data;
};

// 渲染地图
const renderChart = async (mapName, mapData) => {
  console.log("renderChart");
  // 注册: registerMap('地图名称', 地图数据）, 地图名称须和option里面的map一致
  echarts.registerMap(mapName, mapData);
  // 地图配置项
  const option = {
    // 提示浮窗样式
    tooltip: {
      show: true,
      trigger: "item",
      formatter: function (params) {
        return `${params.name}<br/>病例数量: ${isNaN(params.value) ? 0 : params.value} (例)`;      
      }
    },
    geo: {
      map: mapName,
      roam: false, // 禁用缩放和平移
      label: {
        show: false // 不显示市级名称
      },
      itemStyle: {
        areaColor: '#eee', // 地图背景色
        borderColor: '#444' // 边界线颜色
      },
      zoom: 1.2 // 调整缩放级别以适应地图居中
    },
    visualMap: {
      show: true,
      right: '85%', // 确保有足够的空间
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
        type: "map",
        data: province_InfectionSize_Data.value.map(mapDataMapping),
        geoIndex: 0,
        label: {
          show: false, // 是否显示省份名字
        },

      },
    ],
  };

  // 渲染
  initChinaMap.value.setOption(option);

  // 防止多次触发click事件，重要！！！
  initChinaMap.value.off("click");

  // 下钻
  initChinaMap.value.on("click", async (params) => {
    const activeItem = mapList.value.find((item) => item.name == params.name);
    // 判断有子级的时候才可以下钻
    console.log("activeItem", activeItem);
    console.log("currentLevel.value1", currentLevel.value);
    if (activeItem && activeItem.adcode && activeItem.childrenNum && currentLevel.value == "country") {
      currentLevel.value = activeItem.level;
      province.value = activeItem.name
      
      console.log("province_InfectionSize_Data.value33333", province_InfectionSize_Data.value);
      
      historyInfo.value.push(activeItem);
      currentMapName.value = params.name;
      initAdCode.value = activeItem.adcode
      getMapData(activeItem.adcode);

    }

  });
};

onMounted(async () => {
  barChartInstance = echarts.init(barChart.value);
  //地图

  initChinaMap.value = echarts.init(mapChartRef.value);
  await getMapSample();

  getMapData(initAdCode.value);
  
  updateCharts();
});
function updateCharts() {
  // 更新柱状图配置...
  const barOption = {
    title: {
      text: `${selectedYear.value}${host.value}微小隐孢子虫感染率`,
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
      data: province_InfectionRate_Data.value.length ? province_InfectionRate_Data.value.map(item => item[0]) : ['无数据'],
      axisLabel: {
        interval: 0,
        rotate: 45 // 根据需要调整标签旋转角度
      }
    },
    yAxis: {
      type: 'value',
      name: '感染率',
      min: 0,
      max: 0.5, // 根据实际情况调整最大值
      interval: 0.1, // 根据实际情况调整间隔
      
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
        data: province_InfectionRate_Data.value.length ? province_InfectionRate_Data.value.map(item => item[1]) : [0],
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

// 返回上一级
const goBack = async () => {
  const lastItem = historyInfo.value.pop();
  if (lastItem && lastItem.parent && lastItem.parent.adcode) {
    currentLevel.value = "country";
    initAdCode.value  = lastItem.parent.adcode
    await getMapSample()
    await getMapData(lastItem.parent.adcode);
    updateCharts();
  }
};
// 监听选择的变化
watch([selectedYear, host,province], async () => {
  await getMapSample();
  await getMapData(initAdCode.value)
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
  margin-left: 5px;
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

.speciesSelect {
  width: 150px;
  display: flex;
  margin-left: 15px;
  margin-top: 10px;
}

.barChart_table {
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
  flex-direction: column;
  justify-content: center;
  width:500px
}

.table h3{
  text-align: center;
}

.rounded-table {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #dcdcdc;
  overflow: hidden;
  margin-top: 10px;
  height: 300px;
  display: flex;
  justify-content: center;
}
</style>