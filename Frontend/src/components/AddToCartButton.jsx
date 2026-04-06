import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { useSelector } from 'react-redux'
import summaryApi from '../common/summaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaMinus, FaPlus } from "react-icons/fa6";
import Loadingg from './loadingg'

const AddToCartButton = ({ data }) => {
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
  const [loading, setLoading] = useState(false)
  const cartItem = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const [isAvailableCart, setIsAvailableCart] = useState(false)
  const [qty, setQty] = useState(0)
  const [cartItemDetails, setCartItemsDetails] = useState(null)

  const handleADDTocart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Check if logged in
    if (!user?._id) {
      toast.error('Please login or register first')
      navigate('/login')
      return
    }

    // Check if user has addresses
    if (!user.address_details || !Array.isArray(user.address_details) || user.address_details.length === 0) {
      toast.error('Please add your delivery address in Profile first')
    navigate('/dashboard/profile')
      return
    }

    try {
      setLoading(true)

      const response = await Axios({
        ...summaryApi.addTocart,
        data: {
          productId: data?._id
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchCartItem) {
          await fetchCartItem() // ✅ refresh Redux cart
        }
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  // check if this item is in cart
  useEffect(() => {
    const product = cartItem.find(item => item.productId?._id === data._id)

    if (product) {
      setIsAvailableCart(true)
      setQty(product.quantity)
      setCartItemsDetails(product)
    } else {
      setIsAvailableCart(false)
      setQty(0)
      setCartItemsDetails(null)
    }
  }, [data, cartItem])

  const increaseQty = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const response = await updateCartItem(cartItemDetails?._id, qty + 1)

    if (response.success) {
      toast.success("Item added")
      if (fetchCartItem) await fetchCartItem() // refresh cart
    }
  }

  const decreaseQty = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (qty === 1) {
      try {
        await deleteCartItem(cartItemDetails?._id)
        toast.success("Item removed")
        setQty(0)
        setCartItemsDetails(null)
        setIsAvailableCart(false)
        if (fetchCartItem) await fetchCartItem() // ✅ refresh Redux cart after deletion
      } catch (error) {
        AxiosToastError(error)
      }
    } else {
      const response = await updateCartItem(cartItemDetails?._id, qty - 1)
      if (response.success) {
        toast.success("Item removed")
        if (fetchCartItem) await fetchCartItem() // refresh cart
      }
    }
  }

  return (
    <div className='w-full max-w-[150px]'>
      {isAvailableCart ? (
        <div className='flex w-full h-full'>
          <button
            onClick={decreaseQty}
            className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'
          >
            <FaMinus />
          </button>

          <p className='flex-1 w-full font-semibold px-1 flex items-center justify-center'>{qty}</p>

          <button
            onClick={increaseQty}
            className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleADDTocart}
          className='bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded'
        >
          {loading ? <Loadingg/> : "Add"}
        </button>
      )}
    </div>
  )
}

export default AddToCartButton
