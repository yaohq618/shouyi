import axios from "axios"
import { useTokenStore } from "@/store/mytoken"
import { ElMessage } from "element-plus"
import router from "@/router"

const baseURL = '/api'
const instance = axios.create({baseURL})


//添加请求拦截器
instance.interceptors.request.use(
    (config)=>{
        console.log("请求拦截器");
        //添加token
        const tokenStore = useTokenStore()
        console.log("tokenStore.token1",tokenStore.token);
        if(tokenStore.token){
            config.headers.Authorization = tokenStore.token
        }
        return config
    },
    (err)=>{
        Promise.reject(err)
    }  
)

//添加响应拦截器
// instance.interceptors.response.use(
//     result=>{
//         if(result.code == 0){
//             return result.data
//         }
//         ElMessage.error(result.data.msg?result.data.msg:'服务异常')
//         return Promise.reject(result.data)
//     },
//     err=>{
//         if(err.response.status == 401 ){
//             console.log("响应拦截器");
//             ElMessage.error('请先登录！')
//             router.push("/login")
//         }else{
//             ElMessage.error('服务异常')
//         }
//         return Promise.reject(err);//异步的状态转化为失败的状态
//     }
// )

export default instance