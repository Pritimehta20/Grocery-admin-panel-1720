import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { FaEye } from 'react-icons/fa6'
import { useLocation, useNavigate } from 'react-router-dom'
import summaryApi from '../common/summaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'

const ResetPassword = () => {
    const location=useLocation()
    const navigate=useNavigate()
    const[data,setData]=useState({
        email:"",
        newPassword:"",
        confirmPassword:""
    })
        const [showPassword,setshowPassword]=useState(false)
        const [showconfirmpass,setshowconfirmpass]=useState(false)
        const validvalue=Object.values(data).every(el=>el)

     console.log("location",location)

    useEffect(()=>{
        if(!(location?.state?.data?.success)){
            navigate("/")
        }

        if(location?.state?.email){
        setData((preve)=>{
            return{
                ...preve,
                email:location?.state?.email
            }
        })
    }
    
    },[])

    const handleChange=(e)=>{
        const {name,value}=e.target;

        setData((prev)=>{
            return{
                ...prev,
                [name]:value
            }
        })
    }

    
    console.log("data reset password",data)

    const handleSubmit=async (e)=>{
        e.preventDefault()
        if(data.newPassword!==data.confirmPassword){
            toast.error("Password do not match ❗")
            retrun
        }
        try{
            const response= await Axios({
            ...summaryApi.reset_pass,
            data:data
        })

        if(response.data.error){
            toast.error(response.data.message)
        }
        if(response.data.success){
            toast.success(response.data.message)
            setData({
                email:""
            })
            navigate("/login",{
                state:data})
                setData({
                    email:"",
                    newPassword:"",
                    confirmPassword:""
                })
        }

        console.log("response",response)
        } 
        catch(error){
            AxiosToastError(error)
        }
        
    }

  return (
    <section className=' container mx-auto w-full px-2 py-15 '>
        <div className='bg-blue-100 py-4 w-full max-w-lg mx-auto rounded p-4'>
            <p className='text-center text-xl font-semibold'>Create Password 🔐??? </p>

            <form className='grid gap-2 mt-6' onSubmit={handleSubmit}>
                
                <div className='grid gap-2'>
                    <label htmlFor='newpassword' className=''>New Password</label>
                    <div className='bg-white p-2 rounded flex items-center'>
                        <input
                            type={showPassword ?"text":"password"}
                            id='password'
                            name='password'
                            placeholder='Enter Password'
                            className='w-full outline-none'
                            value={data.password}
                            onChange={handleChange}
                    />
                    <div  onClick={()=>setshowPassword(prev=>!prev)}className='cursor-pointer'>
                        {
                            showPassword ? <FaEye/>:<FaEyeSlash />
                        }
                    </div>
                </div>
                </div>

                <div className='grid gap-2'>
                    <label htmlFor='confirmPassword' className=''>Confirm Password</label>
                    <div className='bg-white p-2 rounded flex items-center'>
                        <input
                            type={showconfirmpass ?"text":"password"}
                            id='password'
                            name='confirmPassword'
                            placeholder='Confirm Password'
                            className='w-full outline-none'
                            value={data.confirmPassword}
                            onChange={handleChange}
                    />
                    <div  onClick={()=>setshowconfirmpass(prev=>!prev)}className='cursor-pointer'>
                        {
                            showconfirmpass ? <FaEye/>:<FaEyeSlash />
                        }
                    </div>
                </div>
                </div>
                
                
                <button  disabled={!validvalue} className={ ` ${validvalue ? "bg-red-700 hover:bg-red-800" :" bg-gray-500" }  w-full py-2 rounded  text-white my-3  font-semibold`}>Reset password</button>

            </form>
            <p>
                Already have an account ?
                <Link to={"/login"} className='font-semibold text-green-600'>Login
                </Link>
            </p>

            
        </div>
    </section>
  )
}

export default ResetPassword