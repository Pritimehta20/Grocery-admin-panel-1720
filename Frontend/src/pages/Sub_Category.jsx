import React, { useEffect } from 'react'
import { useState } from 'react';
import { FaPlus } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { MdDelete  } from "react-icons/md";
import { HiPencil } from "react-icons/hi";
import { createColumnHelper } from '@tanstack/react-table'
import toast from 'react-hot-toast';
import ConfirmBox from '../components/ConfirmBox';
import ViewImage from '../components/ViewImage'
import summaryApi, { baseUrl } from '../common/summaryApi';
import UploadSubCategory from '../components/UploadSubCategory';
import DisplayTable from '../components/DisplayTable';
import EditSubCategory from '../components/EditSubCategory';
import AxiosToastError from '../utils/AxiosToastError.js';
import Axios from '../utils/Axios.js';

const Sub_Category = () => {
const [openAddSubCategory,setOpenAddSubCategory] = useState(false)
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [ImageURL,setImageURL] = useState("")
  const [openEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({
    _id : ""
  })
  const [deleteSubCategory,setDeleteSubCategory] = useState({
      _id : ""
  })
  const [openDeleteConfirmBox,setOpenDeleteConfirmBox] = useState(false)

  const fetchSubCategory = async()=>{
    try {
        setLoading(true)
        const response = await Axios({
          method: summaryApi.getSubCategory.method,
          url: baseUrl+ summaryApi.getSubCategory.url,
          data: {}
        })
       console.log("API Response:", response);
        if(response.status === 200){
          console.log("Response Data:", response.data);
          if(response.data.success){
            setData(response.data.data)
            console.log("Subcategory Data:", response.data.data);
          } else {
            console.log("Error fetching subcategories:", response.data.message);
          }
        } else {
          console.log("Error:", response.statusText);
        }
    } catch (error) {
       AxiosToastError(error)
       console.log("Error:", error);
    } finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    console.log("fetching subcategory..")
    fetchSubCategory()
  },[])

console.log("subcategorydata",data)

  const column = [
    columnHelper.accessor('name',{
      header : "Name"
    }),
    columnHelper.accessor('image',{
      header : "Image",
      cell : ({row})=>{
        console.log("row",)
        return <div className='flex justify-center items-center'>
            <img 
                src={row.original.image}
                alt={row.original.name}
                className='w-8 h-8 cursor-pointer'
                onClick={()=>{   
                  setImageURL(row.original.image)
                }}      
            />
        </div>
      }
    }),
    columnHelper.accessor("category",{
       header : "Category",
       cell : ({row})=>{
        return(
          <>
            {
              row.original.category.map((c,index)=>{
                return(
                  <p key={c._id+"table"} className='shadow-md px-1 inline-block'>{c.name}</p>
                )
              })
            }
          </>
        )
       }
    }),
    columnHelper.accessor("_id",{
      header : "Action",
      cell : ({row})=>{
        return(
          <div className='flex items-center justify-center gap-3'>
              <button onClick={()=>{
                  setOpenEdit(true)
                  setEditData(row.original)
              }} className='p-2 bg-green-100 rounded-full hover:text-green-600'>
                  <HiPencil size={20}/>
              </button>
              <button onClick={()=>{
                setOpenDeleteConfirmBox(true)
                setDeleteSubCategory(row.original)
              }} className='p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600'>
                  <MdDelete  size={20}/>
              </button>
          </div>
        )
      }
    })
  ]

  const handleDeleteSubCategory = async()=>{
      try {
          const response = await Axios({
              ...summaryApi.deleteSubCategory,
              data : deleteSubCategory
          })
          
          const { data : responseData } = response

          if(responseData.success){
             toast.success(responseData.message)
             fetchSubCategory()
             setOpenDeleteConfirmBox(false)
             setDeleteSubCategory({_id : ""})
          }
      } catch (error) {
        AxiosToastError(error)
      }
  }

  return (
    <section>
          <div className='p-3 flex items-center justify-between bg-white shadow-md'>
            <h2 className='font-semibold'>Sub-Category</h2>
            <button  onClick={()=>setOpenAddSubCategory(true)} className='text-md border-3 border-green-600
             hover:bg-green-800 hover:text-white font-semibold px-3 py-1 rounded-md'><FaPlus /></button>
          </div>
            <div className='overflow-auto w-full max-w-[95vw] '>
            <DisplayTable
                data={data}
                column={column}
            />
        </div>
          

        {
          openAddSubCategory && (
            <UploadSubCategory
              close={()=>setOpenAddSubCategory(false)}
              fetchData={fetchSubCategory}
            />
          )
        }

        {
          ImageURL &&
          <ViewImage url={ImageURL} close={()=>setImageURL("")}/>
        }

        {
          openEdit && 
          <EditSubCategory
            data={editData} 
            close={()=>setOpenEdit(false)}
            fetchData={fetchSubCategory}
          />
        }

        {
          openDeleteConfirmBox && (
            <ConfirmBox
              cancel={()=>setOpenDeleteConfirmBox(false)}
              close={()=>setOpenDeleteConfirmBox(false)}
              confirm={handleDeleteSubCategory}
            />
          )
        }
    </section>
  )
}

export default Sub_Category