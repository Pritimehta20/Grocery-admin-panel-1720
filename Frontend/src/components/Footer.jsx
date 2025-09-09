import React from 'react'
import { FaInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className='border-t pb-0'>
        <div className='container mx-auto p-3 text-center font-semibold'>
            <h2> &copy; All Rights Reserverd By Green 2025</h2>  
            <div className='flex items-center justify-center gap-3 mt-3 text-xl'>
                <a href='' className='hover:text-3xl'><FaFacebook /></a>
                <a href=''className='hover:text-3xl'><FaInstagram /></a>
                <a href=''className='hover:text-3xl'><FaTwitter /></a>
                <a href=''className='hover:text-3xl'><FaLinkedin /></a>
            </div>
        </div> 
    </footer>
  )
}

export default Footer