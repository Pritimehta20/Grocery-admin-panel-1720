import { Outlet, useLocation } from 'react-router-dom';
import './index.css'
import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { useDispatch } from 'react-redux';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice';
import Axios from './utils/Axios';
import summaryApi from './common/summaryApi';
import GlobalProvider from './provider/GlobalProvider';

function App() {

  const dispatch=useDispatch()
  const location = useLocation()

  const fetchUser = async () => {
  const userData = await fetchUserDetails()
  if (userData?.data) {
    dispatch(setUserDetails(userData.data))
  } else {
    console.warn("User not logged in or unauthorized")
  }
}
const fetchCategory=async()=>{
  try{
    dispatch(setLoadingCategory(true))
    const response=await Axios({
      ...summaryApi.getCategory
    })

    const {data:responseData}=response

    if(responseData.success){
      console.log("response data",responseData.data)
      dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
    }
  }
  catch(error){

  }
  finally{
    dispatch(setLoadingCategory(false))
  }
}
const fetchSubCategory = async()=>{
    try {
        const response = await Axios({
            ...summaryApi.getSubCategory
        })
        const { data : responseData } = response

        if(responseData.success){
           dispatch(setAllSubCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name)))) 
        }
    } catch (error) {
        
    }finally{
    }
  }
  
  useEffect(()=>{
    fetchUser()
    fetchCategory()
    fetchSubCategory()
  },[])
  return (
    <GlobalProvider> 
    <Header/>
      <main className='min-h-[78vh]'>
        <Outlet/>
      </main>
    <Footer/>
    <Toaster/>
    </GlobalProvider>
  )
}

export default App
