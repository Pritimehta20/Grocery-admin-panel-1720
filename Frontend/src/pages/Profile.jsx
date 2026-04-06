import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUser, FaMapMarkerAlt, FaPlus, FaLocationArrow } from "react-icons/fa";
import UserAvatarEdit from '../components/UserAvatarEdit';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';
import Loadingg from '../components/loadingg';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const user = useSelector(state => state.user)
  const [openAvatarEdit, setopenAvatarEdit] = useState(false)
  const navigate = useNavigate()

  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  })
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    lat: null,
    lng: null,
    isDefault: false
  })
  const [addressLoading, setAddressLoading] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [geolocationLoading, setGeolocationLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    })
    if (user.address_details && Array.isArray(user.address_details)) {
      setAddresses(user.address_details)
    }
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
        const updatedUser = await fetchUserDetails()
        dispatch(setUserDetails(updatedUser.data))
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported')
      return
    }
    setGeolocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setAddressForm(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          street: `Current Location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`
        }))
        setGeolocationLoading(false)
        toast.success('Location detected! Fill other details.')
      },
      (error) => {
        setGeolocationLoading(false)
        toast.error('Unable to get location: ' + error.message)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    try {
      setAddressLoading(true)
      const response = await Axios({
        ...summaryApi.addUserAddress,
        data: addressForm
      })
      const { data: responseData } = response
      if (responseData.success) {
        toast.success('Address saved successfully!')
        setShowAddressForm(false)
        setAddressForm({
          street: '',
          city: '',
          state: '',
          pincode: '',
          lat: null,
          lng: null,
          isDefault: false
        })
        const updatedUser = await fetchUserDetails()
        dispatch(setUserDetails(updatedUser.data))
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setAddressLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Responsive Typography Base */}
      <style jsx>{`
        :global(html) {
          font-size: 16px;
        }
        :global(@media (max-width: 640px)) {
          :global(html) { font-size: 14px; }
        }
        :global(.text-hero) {
          font-size: clamp(1.75rem, 5vw, 2.5rem);
        }
        :global(.text-section) {
          font-size: clamp(1.25rem, 4vw, 1.75rem);
        }
        :global(.text-card-title) {
          font-size: clamp(1.125rem, 3.5vw, 1.5rem);
        }
        :global(.text-label) {
          font-size: clamp(0.875rem, 2.5vw, 1rem);
        }
        :global(.font-light) {
          font-weight: 400;
        }
        :global(.font-normal) {
          font-weight: 500;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-hero font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-emerald-900 bg-clip-text text-transparent mb-4 sm:mb-6 drop-shadow-lg">
            My Profile
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Manage your personal information and delivery addresses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Personal Info Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl border border-white/50 p-6 lg:p-8">
              <h2 className="text-section font-bold text-gray-900 mb-6 lg:mb-8 flex items-center gap-2 lg:gap-3">
                <FaUser className="text-xl sm:text-2xl lg:text-3xl text-indigo-600 flex-shrink-0" />
                <span>Personal Information</span>
              </h2>
              
              {/* Avatar */}
              <div className="flex flex-col items-center mb-8 lg:mb-10">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex items-center justify-center rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl lg:shadow-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-white">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-2xl sm:text-3xl lg:text-4xl text-white drop-shadow-lg" />
                  )}
                </div>
                <button
                  onClick={() => setopenAvatarEdit(true)}
                  className="mt-4 px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm sm:text-base rounded-xl lg:rounded-2xl hover:from-indigo-700 hover:to-purple-700 shadow-lg lg:shadow-xl hover:shadow-xl lg:hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 text-center"
                >
                  Edit Avatar
                </button>
              </div>

              {openAvatarEdit && <UserAvatarEdit close={() => setopenAvatarEdit(false)} />}

              {/* Basic Info Form */}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-label font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleOnChange}
                    className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl lg:rounded-2xl bg-white/60 backdrop-blur-sm focus:ring-3 lg:focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 shadow-sm transition-all hover:shadow-md text-base"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-label font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleOnChange}
                    className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl lg:rounded-2xl bg-white/60 backdrop-blur-sm focus:ring-3 lg:focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 shadow-sm transition-all hover:shadow-md text-base"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-label font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={userData.mobile || ''}
                    onChange={handleOnChange}
                    className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl lg:rounded-2xl bg-white/60 backdrop-blur-sm focus:ring-3 lg:focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 shadow-sm transition-all hover:shadow-md text-base"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    disabled={loading}
                    className="w-full py-3.5 sm:py-4 px-6 sm:px-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm sm:text-base lg:text-lg rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl hover:from-emerald-700 hover:to-teal-700 focus:ring-3 lg:focus:ring-4 focus:ring-emerald-300 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-2xl lg:hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : '💾 Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Addresses Card */}
          <div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl border border-white/50 p-6 lg:p-8 sticky top-6 lg:top-8">
              <div className="flex items-center gap-2 lg:gap-3 mb-6 lg:mb-8">
                <FaMapMarkerAlt className="text-lg sm:text-xl lg:text-3xl text-emerald-600 flex-shrink-0" />
                <div>
                  <h2 className="text-card-title font-bold text-gray-900">Delivery Addresses</h2>
                  <p className="text-emerald-700 font-semibold text-sm">{addresses.length} saved</p>
                </div>
              </div>

              {showAddressForm ? (
                <div className="border-2 border-dashed border-emerald-200 rounded-2xl lg:rounded-3xl p-6 lg:p-8 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 mb-6 lg:mb-8">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 lg:mb-6 text-gray-800 flex items-center gap-2 lg:gap-3">
                    ➕ Add New Address
                    <button 
                      type="button" 
                      onClick={() => setShowAddressForm(false)}
                      className="ml-auto text-gray-500 hover:text-gray-700 text-lg lg:text-xl font-normal"
                    >
                      ✕
                    </button>
                  </h3>
                  
                  <form onSubmit={handleAddAddress} className="space-y-3 lg:space-y-4">
                    <div>
                      <label className="block text-label font-semibold text-gray-700 mb-2">Street Address *</label>
                      <input
                        name="street"
                        value={addressForm.street}
                        onChange={handleAddressChange}
                        className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl lg:rounded-2xl bg-white focus:ring-3 lg:focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 shadow-sm transition-all text-base"
                        placeholder="House no, street, landmark"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                      <div>
                        <label className="block text-label font-semibold text-gray-700 mb-2">City *</label>
                        <input
                          name="city"
                          value={addressForm.city}
                          onChange={handleAddressChange}
                          className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl lg:rounded-2xl bg-white focus:ring-3 lg:focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 shadow-sm transition-all text-base"
                          placeholder="City"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-label font-semibold text-gray-700 mb-2">State *</label>
                        <input
                          name="state"
                          value={addressForm.state}
                          onChange={handleAddressChange}
                          className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl lg:rounded-2xl bg-white focus:ring-3 lg:focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 shadow-sm transition-all text-base"
                          placeholder="State"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                      <div>
                        <label className="block text-label font-semibold text-gray-700 mb-2">Pincode *</label>
                        <input
                          name="pincode"
                          type="number"
                          value={addressForm.pincode}
                          onChange={handleAddressChange}
                          className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl lg:rounded-2xl bg-white focus:ring-3 lg:focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 shadow-sm transition-all text-base"
                          placeholder="400001"
                          required
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={handleUseCurrentLocation}
                          disabled={geolocationLoading}
                          className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm sm:text-base rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl hover:shadow-xl lg:hover:shadow-2xl transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-center"
                        >
                          {geolocationLoading ? 'Detecting...' : '🔍 Use Current Location'}
                        </button>
                      </div>
                    </div>
                    <label className="flex items-center gap-3 p-3 lg:p-4 bg-gray-50 rounded-xl lg:rounded-2xl cursor-pointer hover:bg-gray-100 transition-all">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={addressForm.isDefault}
                        onChange={handleAddressChange}
                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-label font-semibold text-gray-800">⭐ Set as default address</span>
                    </label>
                    <button
                      type="submit"
                      disabled={addressLoading}
                      className="w-full py-3.5 sm:py-4 px-6 sm:px-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm sm:text-base lg:text-lg rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl hover:shadow-2xl lg:hover:shadow-3xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      {addressLoading ? 'Saving...' : '💾 Save Address'}
                    </button>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full py-3.5 sm:py-4 px-6 sm:px-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm sm:text-base lg:text-lg rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl hover:shadow-xl lg:hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 lg:gap-3 justify-center"
                >
                  ➕ Add New Address
                </button>
              )}

              {/* Addresses List */}
              <div className="space-y-4 mt-6">
                {addresses.length === 0 ? (
                  <div className="text-center py-8 lg:py-12 border-2 border-dashed border-gray-300 rounded-2xl lg:rounded-3xl bg-gradient-to-r from-gray-50 to-gray-100">
                    <FaMapMarkerAlt className="mx-auto text-4xl sm:text-5xl lg:text-6xl text-gray-400 mb-4 lg:mb-6" />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2 lg:mb-3">No addresses saved</h3>
                    <p className="text-sm lg:text-base text-gray-500 mb-6 lg:mb-8">Add your first delivery address to start shopping</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="px-6 py-2.5 sm:px-8 sm:py-3 bg-emerald-600 text-white font-semibold text-sm sm:text-base rounded-xl lg:rounded-2xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div key={address._id} className="group p-4 lg:p-6 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl lg:rounded-3xl shadow-md hover:shadow-xl lg:hover:shadow-2xl hover:-translate-y-0.5 lg:hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:border-emerald-300">
                      <div className="flex items-start gap-3 lg:gap-4 mb-3 lg:mb-4">
                        <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl lg:rounded-2xl flex items-center justify-center">
                          <FaMapMarkerAlt className="text-white text-sm lg:text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-card-title font-bold text-gray-900 mb-1 leading-tight line-clamp-1">{address.street}</h4>
                          <p className="text-sm lg:text-base text-gray-700 mb-1">{address.city}, {address.state}</p>
                          <p className="font-mono text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full inline-block text-xs lg:text-sm font-bold">
                            {address.pincode}
                          </p>
                          {address.lat && address.lng && (
                            <p className="text-xs lg:text-sm text-gray-500 mt-1 italic">
                              📍 Geo-located
                            </p>
                          )}
                        </div>
                        {address.isDefault && (
                          <span className="px-3 py-1.5 lg:px-4 lg:py-2 bg-emerald-100 text-emerald-800 text-xs lg:text-sm font-bold rounded-full flex-shrink-0">
                            ⭐ Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile