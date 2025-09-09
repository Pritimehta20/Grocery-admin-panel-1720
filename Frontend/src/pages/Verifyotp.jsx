
import React, { useState } from 'react'
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import toast  from 'react-hot-toast';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useEffect } from 'react';


const Verifyotp = () => {
    const [data,setData]=useState(["","","","","",""])
    const navigate=useNavigate()
    const inputRef=useRef([])

    const location=useLocation()
    console.log("location",location)

    useEffect(()=>{
        if(!location?.state?.email){
            navigate("/forgotpassword")
        }
    })
    const validvalue=data.every(el=>el)

    const handleSubmit=async (e)=>{
        e.preventDefault()

        try{
            const response= await Axios({
            ...summaryApi.verify_otp,
            data:{
                otp:data.join(""),
                email:location?.state?.email
            }
        })

        if(response.data.error){
            toast.error(response.data.message)
        }
        if(response.data.success){
            toast.success(response.data.message)
            setData(["","","","","",""])
            navigate("/resetpassword",{
                state:{
                    data:response.data,
                    email:location?.state?.email                }
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
            <p className='text-center text-xl font-semibold'>Otp Verification </p>

            <form className='grid gap-2 mt-6' onSubmit={handleSubmit}>
                
                <div className='grid gap-2'>
                    <div className=' flex  justify-center gap-6'>
                        {
                            data.map((element,index)=>{
                                return(
                                    <input
                                    type='text'
                                    key={index}
                                    value={data[index]}
                                    onChange={(e)=>{
                                        const value=e.target.value
                                        console.log("value",value)

                                        const newdata=[...data]
                                        newdata[index]=value

                                        setData(newdata)

                                        if(value && index<5){
                                            inputRef.current[index+1].focus()
                                        }
                                    }}
                                    maxLength={1}
                                    id='otp'
                                    ref={(ref)=>{
                                        inputRef.current[index]=ref
                                        return ref
                                    }}
                                    className='bg-white w-12 h-14 p-2 font-semibold text-center rounded-md  outline-none focus:border-3 focus:border-blue-300'
                                    />
                                )
                            })
                        }
                    </div>
                    
                </div>
                
                
                <button  disabled={!validvalue} className={ ` ${validvalue ? "bg-green-800 hover:bg-green-900" :" bg-gray-500" }  w-full py-2 rounded  text-white my-3  font-semibold`}>Verify Otp</button>

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

export default Verifyotp