import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUser } from "react-icons/fa";

import UserAvatarEdit from '../components/UserAvatarEdit';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const Profile = () => {
  const user = useSelector(state => state.user)
  const [openAvatarEdit, setopenAvatarEdit] = useState(false)

  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    })
  }, [user])

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setUserData((preve) => ({
      ...preve,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await Axios({
        ...summaryApi.updateUserDetails,
        data: userData
      })

      const { data: responseData } = response
      if (responseData.success) {
        toast.success(responseData.message)
        const userData = await fetchUserDetails()
        dispatch(setUserDetails(userData.data))
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container mx-auto px-4 py-10 flex justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-md border border-gray-200 p-6">
        
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 flex items-center justify-center rounded-full overflow-hidden shadow-md bg-gray-100">
            {
              user.avatar ? (
                <img
                  alt={user.name}
                  src={user.avatar}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser size={60} className="text-gray-500" />
              )
            }
          </div>
          <button
            onClick={() => setopenAvatarEdit(true)}
            className="mt-3 px-4 py-1 text-sm bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
          >
            Edit Avatar
          </button>
        </div>

        {openAvatarEdit && (
          <UserAvatarEdit close={() => setopenAvatarEdit(false)} />
        )}

        {/* Form */}
        <form className="my-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              value={userData.name}
              name="name"
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="grid">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              value={userData.email}
              name="email"
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="grid">
            <label className="text-sm font-medium text-gray-700">Mobile</label>
            <input
              type="text"
              placeholder="Enter your mobile"
              className="p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              value={userData.mobile}
              name="mobile"
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            className="mt-4 w-full py-2 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Profile
