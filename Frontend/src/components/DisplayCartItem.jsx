import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoClose } from 'react-icons/io5'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from "react-icons/fa";
import AddToCartButton from './AddToCartButton'
import toast from 'react-hot-toast'
import empty_cart from '../assets/empty_cart.webp'
import { PriceWithDiscount } from '../utils/PriceWithDiscount'
import Axios from '../utils/Axios'
import summaryApi from '../common/summaryApi'
import { handleSetOrders } from '../store/orderSlice'

const DisplayCartItem = ({close}) => {
  const { notDiscountTotalPrice, totalPrice ,totalQty, fetchCartItem } = useGlobalContext()
  const dispatch = useDispatch()
  const cartItem  = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('')
  const [loading, setLoading] = useState(false)

  const loadRazorpay = () => {
    return new Promise(resolve => {
      if (window.razorpay) {
        resolve(window.razorpay)
      } else {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
          resolve(window.Razorpay)
        }
        script.onerror = () => resolve(null)
        document.body.appendChild(script)
      }
    })
  }

  const fetchOrders = async () => {
    try {
      const response = await Axios(summaryApi.getUserOrders)
      if (response.data.success) {
        dispatch(handleSetOrders(response.data.data))
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error('Select payment method')
      return
    }

    setLoading(true)

    try {
      let placeOrderResponse
      if (paymentMethod === 'COD') {
        placeOrderResponse = await Axios({
          ...summaryApi.placeOrder,
          data: { 
            paymentMethod: 'COD', 
            totalAmount: parseFloat(totalPrice)
          }
        })
      } else {
        const res = await loadRazorpay()
        if (!res) {
          toast.error('Payment gateway failed to load')
          return
        }

        const options = {
          key: 'rzp_test_your_key_here', // Replace with real key
          amount: parseFloat(totalPrice) * 100,
          currency: 'INR',
          name: 'Grocery App',
          description: 'Order Payment',
          handler: async function (response) {
            const verifyResponse = await Axios({
              ...summaryApi.placeOrder,
              data: {
                paymentMethod: 'ONLINE',
                totalAmount: parseFloat(totalPrice),
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              }
            })
            if (verifyResponse.data?.success) {
              await fetchOrders()
              toast.success('Payment successful! Order placed.')
              if (fetchCartItem) await fetchCartItem()
              close?.()
              navigate('/dashboard/myorder')
            } else {
              toast.error('Payment verification failed')
            }
          },
          prefill: {
            name: user?.name || 'Customer',
            contact: user?.phone || ''
          },
          theme: {
            color: '#10b981'
          }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
        return // Exit early for async handler
      }

      // COD/Online placeOrder response
      if (placeOrderResponse.data?.success) {
        await fetchOrders()
        toast.success('Order placed successfully!')
        if (fetchCartItem) await fetchCartItem()
        close?.()
        navigate('/dashboard/myorder')
      } else {
        toast.error('Order placement failed')
      }
    } catch (error) {
      toast.error('Order failed: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='bg-neutral-900/70 fixed top-0 bottom-0 right-0 left-0  z-50'>
        <div className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto'>
            <div className='flex items-center p-4 shadow-md gap-3 justify-between'>
                <h2 className='font-semibold'>Cart & Checkout</h2>
                <button onClick={close} className='hidden lg:block'>
                    <IoClose size={25}/>
                </button>
            </div>

            <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-250px)] bg-blue-50 p-2 flex flex-col gap-4 overflow-auto'>
                {cartItem.length === 0 ? (
                    <div className='bg-white flex flex-col justify-center items-center'>
                        <img src={empty_cart} className='w-48 h-48 object-contain mb-4' alt='Empty cart'/>
                        <p className='text-gray-500 mb-4'>Your cart is empty</p>
                        <button onClick={close} className='bg-green-600 text-white px-6 py-2 rounded-lg font-semibold'>Continue Shopping</button>
                    </div>
                ) : (
                    <>
                        <div className='flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full'>
                            <p>Your total savings</p>
                            <p>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice )}</p>
                        </div>
                        
                        <div className='bg-white rounded-lg p-4 grid gap-5'>
                            {cartItem.map((item) => (
                                <div key={item?._id+"cartItemDisplay"} className='flex w-full gap-4'>
                                    <div className='w-16 h-16 min-h-16 min-w-16 bg-white border rounded overflow-hidden flex pt-2'>
                                        <img src={item?.productId?.image[0]} className='w-full h-full object-contain'/>
                                    </div>
                                    <div className='w-full max-w-sm text-xs'>
                                        <p className='font-semibold text-ellipsis line-clamp-2'>{item?.productId?.name}</p>
                                        <p className='text-neutral-400'>{item?.productId?.unit}</p>
                                        <p className='font-semibold'>{DisplayPriceInRupees(PriceWithDiscount(item?.productId?.price,item?.productId?.discount))}</p>
                                    </div>
                                    <AddToCartButton data={item?.productId}/>
                                </div>
                            ))}
                        </div>

                        <div className='bg-white p-4 rounded-lg'>
                            <h3 className='font-semibold mb-3'>Bill details</h3>
                            <div className='flex justify-between text-sm mb-1'>
                                <span>Items total ({totalQty} items)</span>
                                <span className='flex items-center gap-1'>
                                    <span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                                    <span className='font-semibold'>{DisplayPriceInRupees(totalPrice)}</span>
                                </span>
                            </div>
                            <div className='flex justify-between text-sm mb-3'>
                                <span>Delivery Charge</span>
                                <span>Free</span>
                            </div>
                            <div className='flex justify-between text-lg font-bold border-t pt-2'>
                                <span>Grand Total</span>
                                <span>{DisplayPriceInRupees(totalPrice)}</span>
                            </div>
                        </div>

                        <div className='bg-white p-4 rounded-lg'>
                            <h3 className='font-semibold mb-4'>Select Payment Method</h3>
                            <div className='space-y-3'>
                                <label className='flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50'>
                                    <input
                                        type='radio'
                                        name='payment'
                                        value='COD'
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className='mr-3 w-5 h-5 text-green-600 focus:ring-green-500'
                                    />
                                    <div>
                                        <div className='font-medium'>Cash on Delivery</div>
                                        <div className='text-sm text-gray-500'>Pay when you receive the order</div>
                                    </div>
                                </label>
                                <label className='flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50'>
                                    <input
                                        type='radio'
                                        name='payment'
                                        value='ONLINE'
                                        checked={paymentMethod === 'ONLINE'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className='mr-3 w-5 h-5 text-green-600 focus:ring-green-500'
                                    />
                                    <div>
                                        <div className='font-medium'>Online Payment (UPI/Card)</div>
                                        <div className='text-sm text-gray-500'>Secure payment via Razorpay</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {cartItem.length > 0 && (
                <div className='p-4 bg-white border-t shadow-lg'>
                    <button 
                        onClick={handlePayment}
                        disabled={loading || !paymentMethod}
                        className='w-full bg-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 active:scale-95 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Processing...' : 'Place Order'}
                        {!paymentMethod && !loading && <span className='ml-2 text-sm'>(Select payment method)</span>}
                    </button>
                </div>
            )}
        </div>
    </section>
  )
}

export default DisplayCartItem

