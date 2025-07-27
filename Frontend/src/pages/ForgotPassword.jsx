
import React, { useState } from 'react'
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import toast  from 'react-hot-toast';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
    const [data,setData]=useState({
        email:""
    })

    const navigate=useNavigate()

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
            ...summaryApi.forgot_password,
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
            navigate("/verifyotp",{
                state:data})
                setData({
                    email:"",
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
            <p className='text-center text-xl font-semibold'>Forgot Password 🔒??? </p>

            <form className='grid gap-2 mt-6' onSubmit={handleSubmit}>
                
                <div className='grid gap-2'>
                    <label htmlFor='email' className=''>Email:</label>
                    <input
                    type='email'
                    id='email'
                    name='email'
                    placeholder='Enter Email'
                    className='bg-white p-2 rounded outline-none'
                    value={data.email}
                    onChange={handleChange}
                    />
                </div>
                
                
                <button  disabled={!validvalue} className={ ` ${validvalue ? "bg-green-800 hover:bg-green-900" :" bg-gray-500" }  w-full py-2 rounded  text-white my-3  font-semibold`}>Send Otp</button>

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

export default ForgotPassword