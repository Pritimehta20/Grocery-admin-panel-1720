import React from 'react'
import noDataImage from '../assets/nothing here yet.webp'
const Nodata = () => {
  return (
    <div className='flex flex-col items-center gap-2 p-4 justify-center'>
        <img src={noDataImage}
        alt='no data'
        className='w-36'
        ></img>
        <p className='text-neutral-800 '>No Data</p>
    </div>
  )
}

export default Nodata