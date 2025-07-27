import axios from "axios";
import summaryApi, { baseUrl } from "../common/summaryApi";

const Axios=axios.create({
    baseURL:baseUrl,
    withCredentials:true,

})
Axios.interceptors.request.use(
    async(config)=>{
        const accessToken=localStorage.getItem('accesstoken')
        if(accessToken){
            config.headers.Authorization=`Bearer ${accessToken}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

//extend lifespan of accesstoken with help of refresh

Axios.interceptors.request.use(
    (response)=>{
        return response
    },
    async(error)=>{
        let originRequest=error.config
        if(error.response.status === 401 && !originRequest.retry){
            originRequest.retry=true
            const refreshToken=localStorage.getItem("refreshtoken")
            if(refreshToken){
                const newaccessToken=await refreshAccessToken(refreshToken)
                if(newaccessToken){
                    originRequest.headers.Authorization=`Bearer ${newaccessToken}`
                    return Axios(originRequest)
                }

            }
            return Promise.reject(error)
        }
    }
)
const refreshAccessToken=async(refreshToken)=>{
    try{
        const response=await Axios({
            ...summaryApi.refreshToken,
            headers:{
                Authorization:`Bearer ${refreshToken}`
            }
        })
        const accessToken=response.data.data.accessToken
        localStorage.setItem('accesstoken',accessToken)
        return accessToken
        console.log(response)
    }catch(error){
        console.log(error)
    }
}
export default Axios