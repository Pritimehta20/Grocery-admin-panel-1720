import React, { useState } from 'react'
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import toast  from 'react-hot-toast';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import image from '../assets/image.png'


const Login = () => {
    const [data,setData]=useState({
        email:"",
        password:""
    })

    const [showPassword,setshowPassword]=useState(false)

    const navigate=useNavigate()
    const dispatch=useDispatch()
    const handleChange=(e)=>{
        const {name,value}=e.target;
        
        setData((prev)=>{
            return{
                ...prev,
                [name]:value
            }
        })
    }

    const validvalue=Object.values(data).every(el=>el)

    const handleSubmit=async (e)=>{
        e.preventDefault()

        try{
            const response= await Axios({
            ...summaryApi.login,
            data:data
        })

        if(response.data.error){
            toast.error(response.data.message)
        }
        if(response.data.success){
            toast.success(response.data.message)
            localStorage.setItem('accesstoken',response.data.data.accesstoken)
            localStorage.setItem('refreshtoken',response.data.data.refreshtoken)

            const userDetails=await fetchUserDetails()
            dispatch(setUserDetails(userDetails.data))
            setData({
                email:"",
                password:""
            })
            navigate("/")
        }

        console.log("response",response)
        } 
        catch(error){
            AxiosToastError(error)
        }
        
    }
  return (
    <section className='container mx-auto w-full px-2 py-15'>
        <div className='bg-white py-4 w-full max-w-lg mx-auto rounded p-4 shadow-md'>
            <div className='flex justify-center items-center '>
                <img src={image} alt='Logo' className='w-50 h-30' />
                <p className='text-center text-2xl font-bold text-green-600'>Welcome Back! 👤</p>
            </div>


            <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
                
                <div className='grid gap-2'>
                    <label htmlFor='email' className='text-green-700'>Email:</label>
                    <input
                    type='email'
                    id='email'
                    name='email'
                    placeholder='Enter Email'
                    className='bg-gray-50 p-2 rounded outline-none border border-green-300 focus:border-green-500'
                    value={data.email}
                    onChange={handleChange}
                    />
                </div>
                <div className='grid gap-2'>
                    <label htmlFor='password' className='text-green-700'>Password:</label>
                    <div className='bg-gray-50 p-2 rounded flex items-center border border-green-300 focus-within:border-green-500'>
                        <input
                            type={showPassword ?"text":"password"}
                            id='password'
                            name='password'
                            placeholder='Enter Password'
                            className='w-full outline-none'
                            value={data.password}
                            onChange={handleChange}
                    />
                    <div  onClick={()=>setshowPassword(prev=>!prev)}className='cursor-pointer text-green-500'>
                        {
                            showPassword ? <FaEye />:<FaEyeSlash />
                        }
                    </div>
                    </div>
                    <Link to={"/forgotpassword"} className='block ml-auto font-semibold text-green-600 hover:text-green-800'>Forgot password?</Link>
                </div>
                
                
                <button  disabled={!validvalue} className={ ` ${validvalue ? "bg-green-600 hover:bg-green-700" :" bg-gray-500" }  w-full py-2 rounded  text-white my-3  font-semibold`}>Login</button>

            </form>
            <p className='text-green-700'>
                Don't have an account ?
                <Link to={"/register"} className='font-semibold text-green-600 hover:text-green-800'> Register
                </Link>
            </p>

            
        </div>
    </section>
  )
}

export default Login