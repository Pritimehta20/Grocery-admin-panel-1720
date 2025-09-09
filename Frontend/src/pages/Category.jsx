import React, { useEffect, useState } from 'react'
import Uploadcategory from '../components/Uploadcategory'
import { FaPlus } from "react-icons/fa";
import Nodata from '../components/Nodata';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import EditCategory from '../components/EditCategory';
import ConfirmBox from '../components/ConfirmBox';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';

import { useSelector } from 'react-redux';
import Loading from '../components/loading';

const Category = () => {
  const [openuploadcategory,setopenupload]=useState(false)
  const [loading,setLoading] = useState(false)
  const[categoryData,setCategoryData]=useState([])
  const[openEdit,setOpenEdit]=useState(false)

  const[openConfirmBoxDelete,setOpenConfirmBoxDelete]=useState(false)

  const [deleteCategory,setDeleteCategory] = useState({
        _id : ""
    })
  
  const allCategory= useSelector(state => state.product.allCategory)
  
  console.log("all category redux",allCategory)

    useEffect(()=>{
        setCategoryData(allCategory)
    },[allCategory])

  const [editData,setEditData]=useState({
    name:"",
    image:"",
  })

  const fetchCategory = async()=>{
        try {
            setLoading(true)
            const response = await Axios({
                ...summaryApi.getCategory
            })
            const { data : responseData } = response

            if(responseData.success){
                setCategoryData(responseData.data)
            }
        } catch (error) {
            
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchCategory()
    },[])

  const handleDeleteCategory = async()=>{
        try {
            const response = await Axios({
                ...summaryApi.deleteCategory,
                data : deleteCategory
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

  return (
    <section>
      <div className='p-3 flex items-center justify-between bg-white shadow-md'>
        <h2 className='font-semibold'>Category</h2>
        <button  onClick={()=>setopenupload(true)} className='text-md border-3 border-green-600
         hover:bg-green-800 hover:text-white font-semibold px-3 py-1 rounded-md'><FaPlus /></button>
      </div>
      {
            !categoryData[0] && !loading && (
                <Nodata/>
            )
        }
          <div className='p-6 grid  grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'>
         {
          categoryData.map((category,index)=>{
            return(
              <div className='w-37 h-56 rounded shadow-md' key={category._id}>
                  <img 
                      alt={category.name}
                      src={category.image}
                      className='max-h-28 w-auto object-contain'
                  />
                  <div className='text-s font-semibold m-3 flex items-center justify-center'>
                    <p>{category.name}</p>
                  </div>
                  <div className='items-center max-h-7 flex gap-1'>
                    <button onClick={()=>{
                      setOpenEdit(true)
                      setEditData(category)
                    }} className='flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium py-1 rounded'>Edit
                    </button>
                    <button onClick={()=>{
                      setOpenConfirmBoxDelete(true)
                      setDeleteCategory(category)
                      }} className='flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-1 rounded'>Delete
                      </button>
                    </div>
              </div>
              )})
              }
              </div>
      {
            !loading && (
                <Loading/>
            )
        }
      
      {
        openuploadcategory &&(
          <Uploadcategory fetchData={fetchCategory} close={()=>setopenupload(false)}/>
        )
      }
      {
            openEdit && (
                <EditCategory data={editData} close={()=>setOpenEdit(false)} fetchData={fetchCategory}/>
            )
        }
        {
           openConfirmBoxDelete && (
            <ConfirmBox close={()=>setOpenConfirmBoxDelete(false)} cancel={()=>setOpenConfirmBoxDelete(false)} confirm={handleDeleteCategory}/>
           ) 
        }
    </section>
  )
}

export default Category