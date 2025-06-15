import React, { use, useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";import { TypeAnimation } from 'react-type-animation';
import {Link, useLocation, useNavigate} from 'react-router-dom'
import useMobile from '../hooks/useMobile';

const Search = () => {

    const navigate=useNavigate();
    const location=useLocation()
    const [isSearchPage,setIsSearchPage]=useState(false)
    const [isMobile]=useMobile()
    useEffect(()=>{
        const IsSearch=location.pathname==='/search'
        setIsSearchPage(IsSearch)
    },[location])

    const redirectToSearchPgae=()=>{
        navigate("/search")
    }
    console.log("search",isSearchPage)

  return (
    <div  className='w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-gray-400 bg-slate-50 group focus-within:border-blue-500  group focus-within:shadow-md'>
        <div>
            
            {
                (isMobile && isSearchPage ) ? (
                    <Link to={"/"} className=' p-3 flex justify-center items-center h-full  text-gray-900 '>
                        <IoIosArrowRoundBack  size={25}/>
                    </Link>
                ):(
                    <button className='flex justify-center items-center h-full p-5 text-gray-800'>
                        <FaSearch size={16} />
                    </button>
                )
            }
            
        </div>

         <div className='w-full h-full'>
            {
                !isSearchPage ? (
                    //not in search page
                    <div onClick={redirectToSearchPgae} className='w-full h-full items-center flex'>
                        <TypeAnimation
                        sequence={[
                            'Search "Milk" ',
                            1000, 
                            'Search "Bread" ',
                            1000,
                            'Search "Panner" ',
                            1000,
                            'Search "Sugar" ',
                            1000,
                            'Search "Chocolate" ',
                            1000,
                            'Search "Curd" ',
                            1000,
                            'Search "Egg" ',
                            1000,
                            'Search "Rice" ',
                        ]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                        />
                    </div>
                ):(
                    //on search page
                    <div className='w-full h-full'> 
                        <input
                        type="text"
                        autoFocus
                        placeholder='Search for atta dal and more'
                        className='w-full h-full outline-none'
                        ></input>
                    </div>
                )
            }
         </div>
    </div>
  )
}

export default Search