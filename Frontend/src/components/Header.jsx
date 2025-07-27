import React from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useMobile from '../hooks/useMobile';
import { useSelector } from 'react-redux';
const Header = () => {
    const [isMobile]=useMobile()
    const location=useLocation()
    const navigate=useNavigate()
    const isSearchPage=location.pathname==="/search"

    const user=useSelector((state)=>state?.user)
    console.log('user from store',user)
    const redirectToLoginPage=()=>{
        navigate("/login")
    }
  return (
    <header className=' h-25 lg:h-20 lg:shadow-md sticky top-0 flex flex-col justify-center gap-1'>
        {
            !(isSearchPage && isMobile) && (
            <div className='container mx-auto flex items-center px-3 justify-between'>

            {/* logo */}
            <div className='h-full'>
                <Link to={"/"}className='h-full flex justify-center items-center'>
                        <img src={logo}
                        width={170}
                        height={60}
                        alt='logo'
                        className='hidden lg:block'
                        >
                        </img>
                         <img src={logo}
                        width={120}
                        height={60}
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
                <button className='text-3xl lg:hidden'>
                    <FaRegUserCircle />
                </button>

                {/* for desktop */}

                <div className='hidden lg:flex items-center gap-10'>
                    <button onClick={redirectToLoginPage} className='font-semibold text-xl'>Login</button>
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