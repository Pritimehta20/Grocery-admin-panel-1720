import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { IoClose, IoArrowBack } from 'react-icons/io5'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { PriceWithDiscount } from '../utils/PriceWithDiscount'
import empty_cart from '../assets/empty_cart.webp'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddToCartButton from '../components/AddToCartButton'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import summaryApi from '../common/summaryApi'
import { handleSetOrders } from '../store/orderSlice'

const CartMobile = () => {
  const dispatch = useDispatch()
  const cartItem = useSelector(state => state.cartItem.cart)
  const { totalPrice, notDiscountTotalPrice, totalQty, fetchCartItem } = useGlobalContext()
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
          key: 'rzp_test_your_key_here',
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
              navigate('/dashboard/myorder')
            } else {
              toast.error('Payment verification failed')
            }
          },
          prefill: {
            name: 'Customer',
            contact: ''
          },
          theme: {
            color: '#10b981'
          }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
        return
      }

      if (placeOrderResponse.data?.success) {
        await fetchOrders()
        toast.success('Order placed successfully!')
        if (fetchCartItem) await fetchCartItem()
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

  if (!cartItem.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <img src={empty_cart} alt="Empty cart" className="w-64 h-64 mx-auto mb-8 object-contain" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <Link 
            to="/" 
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm px-4 py-3 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3">
          <IoArrowBack size={24} />
        </button>
        <h1 className="text-xl font-bold">My Cart & Checkout</h1>
      </div>

      <div className="px-4 py-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full">
          <p>Your total savings</p>
          <p>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</p>
        </div>

        {cartItem.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-start gap-3">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={item.productId?.image[0]} 
                  alt={item.productId?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.productId?.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{item.productId?.unit}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">
                    {DisplayPriceInRupees(PriceWithDiscount(item.productId?.price, item.productId?.discount))}
                  </span>
                  <span className="text-sm text-gray-500">x{item.quantity}</span>
                </div>
                <AddToCartButton data={item.productId} />
              </div>
            </div>
          </div>
        ))}

        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <h3 className="font-semibold mb-4">Bill details</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Items total ({totalQty} items)</span>
              <span className="flex items-center gap-1">
                <span className="line-through text-gray-400">{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                <span className="font-semibold">{DisplayPriceInRupees(totalPrice)}</span>
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery Charge</span>
              <span>Free</span>
            </div>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>Grand Total</span>
            <span className="text-green-600">{DisplayPriceInRupees(totalPrice)}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <h3 className="font-semibold mb-4">Select Payment Method</h3>
          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 w-full">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3 w-5 h-5 text-green-600"
              />
              <div>
                <div className="font-medium">Cash on Delivery</div>
                <div className="text-sm text-gray-500">Pay when you receive</div>
              </div>
            </label>
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 w-full">
              <input
                type="radio"
                name="payment"
                value="ONLINE"
                checked={paymentMethod === 'ONLINE'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3 w-5 h-5 text-green-600"
              />
              <div>
                <div className="font-medium">Online Payment (UPI/Card)</div>
                <div className="text-sm text-gray-500">Razorpay secure checkout</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 bg-white border-t shadow-lg">
        <button
          onClick={handlePayment}
          disabled={loading || !paymentMethod}
          className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 active:scale-95 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
        {!paymentMethod && !loading && (
          <p className="text-center text-sm text-gray-500 mt-2">Select a payment method to continue</p>
        )}
      </div>
    </div>
  )
}

export default CartMobile

