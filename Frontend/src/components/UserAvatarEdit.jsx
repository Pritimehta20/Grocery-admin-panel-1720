import React, { useState } from 'react'
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { updatedAvatar } from '../store/userSlice'
import { IoClose } from "react-icons/io5";

const UserAvatarEdit = ({ close }) => {
  const user = useSelector(state => state.user)
  const [loading, setloading] = useState(false)
  const dispatch = useDispatch()

  const handleUploadImg = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      setloading(true)
      const response = await Axios({
        ...summaryApi.uploadAvatar,
        data: formData
      })
      const { data: responseData } = response
      dispatch(updatedAvatar(responseData.data.avatar))

      console.log(response)
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setloading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <section className="fixed inset-0 bg-black/50 p-4 flex items-center justify-center z-50">
      <div className="bg-white w-80 rounded-xl shadow-lg p-6 relative">
        
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          <IoClose size={24} />
        </button>

        {/* Title */}
        <p className="text-lg font-semibold text-center text-green-700 mb-4">
          Update Profile Picture
        </p>

        {/* Avatar Preview */}
        <div className="w-24 h-24 mx-auto flex items-center justify-center rounded-full overflow-hidden shadow bg-gray-100">
          {user.avatar ? (
            <img
              alt={user.name}
              src={user.avatar}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser size={60} className="text-gray-500" />
          )}
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col items-center">
          <label htmlFor="uploadprofile">
            <div className="cursor-pointer px-5 py-2 rounded-md bg-green-600 text-white font-medium shadow hover:bg-green-700 transition">
              {loading ? "Uploading..." : "Choose File"}
            </div>
          </label>
          <input
            onChange={handleUploadImg}
            type="file"
            id="uploadprofile"
            className="hidden"
          />
        </form>
      </div>
    </section>
  )
}

export default UserAvatarEdit
