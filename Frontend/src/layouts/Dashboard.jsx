import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
   const user = useSelector(state => state.user)

  console.log("user dashboard",user)

  return (
    <section className='bg-white'>
      <div className='container mx-4 p-3 grid lg:grid-cols-[250px_1fr]'>

        {/* left for menu  */}
        <div className='overflow-y-auto py-4  max-h-[calc(100vh-96px)] sticky top-24 hidden lg:block border-r-2'>
          <UserMenu/>
        </div>


        {/* right for content */}
        <div className='bg-white min-h-[75vh] '>
          <Outlet/>
        </div>
      </div>
    </section>
  )
}

export default Dashboard