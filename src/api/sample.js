import  request  from "@/utils/request";

//根据年份和宿主获取数据
export const sampleService = (params)=>{
    return request.get("/sample/list",{params:params})
}

//获取所有年份
export const getYearSampleService = ()=>{
    return request.get("/sample/year")
}

export const getProvinceAndInfectionSizeSampleService = (params)=>{
    return request.get("/sample/province-infection-count",{params:params})
}
//获取城市和感染数
export const getCityAndInfectionSizeSampleService = (params)=>{
    return request.get("/sample/city-infection-count",{params:params})
}

// 根据年份，宿主获取感染率
export const getProvinceInfectionRateSampleService = (params)=>{
    return request.get("/sample/province_infectionRate",{params:params})
}

//根据省份、年份和宿主获取感染率
export const getInfectionRateSampleService = (params)=>{
    return request.get("/sample/infectionRate",{params:params})
}

export const getProvinceSampleSizeInfectionCountInfectionRateService = (params)=>{
    return request.get("/sample/details",{params:params})
}

export const getHostSampleSizeInfectionCountInfectionRateService = (params)=>{
    return request.get("/sample/host_details",{params:params})
}

