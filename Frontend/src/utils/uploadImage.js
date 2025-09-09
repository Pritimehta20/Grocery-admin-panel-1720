import summaryApi from "../common/summaryApi.js"
import Axios from "../utils/Axios.js"

 export const uploadImage=async (image)=>{
    try {
        const formData=new FormData()
        formData.append('image',image)

        const response=await Axios({
            ...summaryApi.uploadImage,
            data:formData
        })
        return response
    } catch (error) {
        return error
    }
}