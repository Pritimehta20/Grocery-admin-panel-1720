import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { uploadImage } from '../utils/uploadImage.js';
import summaryApi from '../common/summaryApi.js';
import AxiosToastError from '../utils/AxiosToastError.js';
import toast from 'react-hot-toast'
import Axios from '../utils/Axios.js';

const Uploadcategory = ({close,fetchData}) => {
    const [data,setData]=useState({
        name:"",
        image:""
    })
    const [loading,setLoading] = useState(false)

    const handleOnchange=(e)=>{
        const{name,value}=e.target
        setData((preve)=>{
            return{
                ...preve,
                [name]:value
            }
        })
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        try {
            setLoading(true)
            const response = await Axios({
                ...summaryApi.addCategory,
                data:data
            })
            console.log(data)

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                close()
                fetchData()
            }
        } catch (error) {
            AxiosToastError(error)
        }finally{
            setLoading(false)
        }
    }
    const handleUploadcategory=async(e)=>{
        const file=e.target.files[0]
        if(!file){
            return
        }
        const response = await uploadImage(file)
        console.log(response)
        const { data: ImageResponse } = response

        setData((preve)=>{
            return{
                ...preve,
                image : ImageResponse.data.url
            }
        })
    }
  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-black/50 p-4 flex items-center justify-center'>
        <div className='bg-white max-w-4xl w-full p-4 rounded-md'>
            <div className='flex justify-between items-center'>
                <h1 className='font-semibold'>Add Category</h1>
                <button onClick={close} className='w-fit block ml-auto'>
                    <IoMdClose size={23}/>
                </button>
            </div>
            <form className='grid-gap-2 my-3' onSubmit={handleSubmit} >
                <div className='grid gap-1 mb-2 '>
                    <label>Name:</label>
                    <input type='text'
                    id='categoryName'
                    placeholder='Enter Category Name'
                    value={data.name}
                    name='name'
                    onChange={handleOnchange}
                    className='bg-blue-50 p-1 border-2 border-blue-300 focus-within:border-blue-700 outline-none rounded-md'>

                    </input>
                </div>

                <div className='grid gap-2'>
                    <label>Upload Image:</label>
                    <div className='flex gap-4 flex-col lg:flex-row items-center'>
                        <div className=' bg-blue-50 h-36 w-full lg:w-36 flex justify-center items-center'>
                            {
                                data.image ? (
                                    <img
                                        alt='category'
                                        src={data.image}
                                        className='w-full h-full object-scale-down'
                                    />
                                ) :
                                (<p className='text-sm text-neutral-700 rounded'>No Image</p>)
                            }
                    </div>
                    <label htmlFor='uploadimage' className={
                        `${!data.name ? "bg-gray-400":"bg-blue-500"} px-4 py-2 rounded cursor-pointer`}
                    >Upload Image</label>
                    <input disabled={!data.name} onChange={ handleUploadcategory} type='file' id='uploadimage' className='hidden'/>
                </div>
                </div>
                 <button
                    className={ `
                    ${data.name && data.image ? "bg-green-600 hover:bg-green-800 text-white" : "bg-gray-300 "}
                     mt-4 font-semibold rounded w-full h-10 flex justify-center items-center
                    `}
                >Add Category</button>
            </form>
        </div>
    </section>
  )
}

export default Uploadcategory