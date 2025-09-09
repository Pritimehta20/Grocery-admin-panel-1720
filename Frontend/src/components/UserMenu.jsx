import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Links, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import summaryApi from '../common/summaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { logout } from '../store/userSlice'
import { LuExternalLink } from "react-icons/lu";
import isAdmin from '../utils/isAdmin.jsx'

const UserMenu = ({close}) => {
    const user=useSelector((state)=>state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout=async()=>{
        try{
            const response=await Axios({
                ...summaryApi.logout
            })
            console.log("logout",response)
          if(response.data.success){
            if(close){
              close()
            }
            dispatch(logout())
            localStorage.clear()
            toast.success(response.data.message)
            navigate("/")
          }
        }catch(error){
            console.log(error)
            AxiosToastError(error)
        }
    }

    const handleClose = ()=>{
      if(close){
        close()
      }
   }
  return (
    <div>
        <div className='font-semibold'>My Account 👤</div>
        <div className='text-sm flex items-center gap-2'>
          <span className='max-w-52 text-ellipsis line-clamp-1 '>{user.name||user.mobile}<span className='text-red-700 font-semibold text-md'>{user.role === "ADMIN" ?"(Admin)":""} </span></span>
           <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-blue-300'><LuExternalLink size={15}/></Link>
        </div>

        <Divider/>

        <div className='text-sm grid gap-2'>
          
          {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/category"}className='px-2 hover:bg-orange-200 py-1'>Category</Link>

              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/sub_category"}className='px-2 hover:bg-orange-200 py-1'>Sub Category</Link>
              )
            }

            {
              isAdmin(user.role) && (
              <Link onClick={handleClose} to={"/dashboard/upload_product"}className='px-2 hover:bg-orange-200 py-1'>Upload Product</Link>
              )
            }
            {
              isAdmin(user.role) && (
              <Link onClick={handleClose} to={"/dashboard/product_admin"}className='px-2 hover:bg-orange-200 py-1'>Product</Link>
              )
            }
            
          <Link onClick={handleClose} to={"/dashboard/myorder"}className='px-2 hover:bg-orange-200 py-1'>My Orders 📦</Link>
          <Link onClick={handleClose} to={"/dashboard/saveaddress"} className='px-2 hover:bg-orange-200 py-1'>Save Address 📍</Link>
          <button onClick={handleLogout} className='text-left px-2 hover:bg-orange-200 py-1'>Log Out</button>
        </div>
    </div>
  )
}

export default UserMenu