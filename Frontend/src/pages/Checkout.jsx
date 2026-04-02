import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Checkout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    toast.info('Checkout integrated into Cart. Use cart sidebar/full page for payment.')
    navigate('/cart')
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Redirecting to Cart...</h2>
        <p className="text-gray-600">Payment options now available directly in cart/sidebar.</p>
      </div>
    </div>
  )
}

export default Checkout

