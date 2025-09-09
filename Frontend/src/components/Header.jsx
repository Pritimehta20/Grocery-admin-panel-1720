import React, { useState } from 'react'
import logo from '../assets/logo.png'
import image from '../assets/image.png'
import Search from './Search'
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useMobile from '../hooks/useMobile';
import { useSelector } from 'react-redux';
import { VscTriangleDown, VscTriangleUp}from "react-icons/vsc";
import UserMenu from './UserMenu';

const Header = () => {
    const [isMobile]=useMobile()
    const location=useLocation()
    const navigate=useNavigate()

    const handleMobileUser=()=>{
        if(!user._id){
            navigate("/login")
            return
        }
        navigate("/usermenu")
    }
    const isSearchPage=location.pathname==="/search"

    const user=useSelector((state)=>state?.user)

    console.log('user from store',user)
    const redirectToLoginPage=()=>{
        navigate("/login")
    }
    const [openUserMenu,setopenUserMenu]=useState(false)

    const handleCloseUserMenu = ()=>{
        setopenUserMenu(false)
    }
  return (
    <header className=' h-25 lg:h-20 lg:shadow-md sticky top-0 flex flex-col justify-center gap-1'>
        {
            !(isSearchPage && isMobile) && (
            <div className='container mx-auto flex items-center px-3 justify-between'>

            {/* logo */}
            <div className='h-full'>
                <Link to={"/"}className='h-full flex justify-center items-center'>
                        <img src={image}
                        width={130}
                        height={50}
                        alt='logo'
                        className='hidden lg:block'
                        >
                        </img>
                         <img src={image}
                        width={130}
                        height={50}
                        alt='logo'
                        className='lg:hidden'
                        >
                        </img>
                </Link>
            </div>
            {/* search */}
            <div className='hidden lg:block'>
                <Search/>
            </div>

            {/* Login and cart */}
            <div className=''>
                {/* user icon display in mobile screen */}
                <button className='text-3xl lg:hidden' onClick={handleMobileUser}>
                    <FaRegUserCircle />
                </button>

                {/* for desktop */}

                <div className='hidden lg:flex items-center gap-10'>
                    {
                        user._id ?(
                            <div className='relative'>
                                <div onClick={()=>setopenUserMenu(preve => !preve)} className='flex  select-none items-center gap-1 cursor-pointer'>
                                    <p>Account</p>
                                    {
                                    openUserMenu ? (
                                    <VscTriangleUp size={25}/> 
                                    ) : (
                                        <VscTriangleDown size={25}/>
                                        )
                                    }
                                </div>
                                {
                                    openUserMenu && (
                                    <div className='absolute right-0 top-12'>
                                    <div className='bg-white rounded p-4 min-w-52 lg:shadow-lg'>
                                        <UserMenu close={handleCloseUserMenu}/>
                                    </div>
                                    </div>
                                    )
                                }
                            </div>
                        ):(
                        <button onClick={redirectToLoginPage} className='font-semibold text-xl'>Login</button>
                        )
                    }
                    <button className='flex items-center gap-2 bg-green-700 text-white hover:bg-green-800 rounded-md px-3 py-2'>
                        <div className='hover:animate-bounce'>
                            <AiOutlineShoppingCart size={28}/>
                        </div>
                        <div className='font-semibold'>
                            <p>My Cart</p>
                            {/* <p>1 items</p>
                            <p>total price</p> */}
                        </div>
                    </button>
                </div>
            </div>
        </div>
            )
        }
        <div className='container mx-auto px-2 lg:hidden'>
            <Search/>
        </div>

    </header>
  )
}

export default Header