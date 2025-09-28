import React from 'react'
import nothing_yet_here from '../assets/nothing_here_yet.webp'
const Nodata = () => {
  return (
    <div className='flex flex-col items-center gap-2 p-4 justify-center'>
        <img src={nothing_yet_here}
        alt='no data'
        className='w-36'
        ></img>
        <p className='text-neutral-800 '>No Data</p>
    </div>
  )
}

export default Nodata