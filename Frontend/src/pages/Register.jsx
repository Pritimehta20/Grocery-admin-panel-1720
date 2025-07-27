import React, { useState } from 'react'
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import toast  from 'react-hot-toast';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
const Register = () => {
    const [data,setData]=useState({
        name:"",
        email:"",
        password:"",
        confirmpassword:""

    })

    const [showPassword,setshowPassword]=useState(false)

    const [showconfirmpass,setshowconfirmpass]=useState(false)

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

        if(data.password !== data.confirmpassword){
            toast.error(
                "password donot match"
            )
            return
        }

        try{
            const response= await Axios({
            ...summaryApi.register,
            data:data
        })
        console.log(response)
        if(response.data.error){
            toast.error(response.data.message)
        }
        if(response.data.success){
            toast.success(response.data.message)
            setData({
                name:"",
                email:"",
                password:"",
                confirmpassword:""
            })
            navigate("/login")
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
            <p className='text-center text-xl font-semibold'>Register Here!</p>

            <form className='grid gap-2 mt-6' onSubmit={handleSubmit}>
                <div className=' grid gap-2'>
                    <label htmlFor='name' className=''>Name:</label>
                    <input
                    type='text'
                    id='name'
                    autoFocus
                    name='name'
                    placeholder='Enter name'
                    className='bg-white p-2 rounded outline-none'
                    value={data.name}
                    onChange={handleChange}
                    />
                </div>
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
                <div className='grid gap-2'>
                    <label htmlFor='password' className=''>Password:</label>
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
                            showPassword ? <FaEye />:<FaEyeSlash />
                        }
                    </div>
                    </div>
                </div>
                
                <div className='grid gap-2'>
                    <label htmlFor='Cpassword' className=''>Confirm Password:</label>
                    <div className='bg-white p-2 rounded flex items-center'>
                        <input
                            type={showconfirmpass ?"text":"password"}
                            id='confirmpassword'
                            name='confirmpassword'
                            placeholder='Enter Confirm Password'
                            className='w-full outline-none'
                            value={data.confirmpassword}
                            onChange={handleChange}
                    />
                    <div  onClick={()=>setshowconfirmpass(prev=>!prev)}className='cursor-pointer'>
                        {
                            showconfirmpass ? <FaEye />:<FaEyeSlash />
                        }
                    </div>
                    </div>
                </div>
                <button  disabled={!validvalue} className={ ` ${validvalue ? "bg-green-800 hover:bg-green-900" :" bg-gray-500" }  w-full py-2 rounded  text-white my-3  font-semibold`}>Register</button>

            </form>

            <p>
                Already have account ?
                <Link to={"/login"} className='font-semibold text-green-600'>Login
                </Link>
            </p>
        </div>
    </section>
  )
}

export default Register