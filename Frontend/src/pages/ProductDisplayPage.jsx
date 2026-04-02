import React, { useEffect, useRef, useState } from 'react'
import Axios from '../utils/Axios'
import summaryApi from '../common/summaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { useParams, useNavigate } from 'react-router-dom'
import { FaAngleRight, FaAngleLeft, FaArrowLeft, FaStar } from "react-icons/fa6";
import Divider from '../components/Divider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { PriceWithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
import minute_delivery from '../assets/minute_delivery.png'
import Best_Prices_Offers from '../assets/Best_Prices_Offers.png'
import Wide_Assortment from '../assets/Wide_Assortment.png'

const ProductDisplayPage = () => {
  const params = useParams()
  const navigate = useNavigate()
  const productId = params?.product?.split("-")?.slice(-1)[0]
  
  const [data, setData] = useState({ name: "", image: [], description: "", unit: "", price: 0, discount: 0, stock: 0 })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const imageContainer = useRef()

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...summaryApi.getProductDetails,
        data: { productId: productId }
      })
      if (response.data.success) {
        setData(response.data.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProductDetails() }, [params])

  const handleScroll = (direction) => {
    imageContainer.current.scrollLeft += direction === 'left' ? -90 : 90
  }

  const SkeletonLoader = () => (
    <div className='container mx-auto px-4 py-8 space-y-6 animate-pulse'>
      <div className='h-6 w-32 bg-gray-200 rounded-lg'></div>
      <div className='space-y-4'>
        <div className='w-full h-64 sm:h-72 lg:h-[450px] bg-gray-200 rounded-2xl'></div>
        <div className='flex gap-2 px-2'>
          <div className='w-16 h-1 bg-gray-300 rounded-full'></div>
          <div className='w-3 h-1 bg-gray-300 rounded-full'></div>
          <div className='w-3 h-1 bg-gray-300 rounded-full'></div>
        </div>
        <div className='flex gap-2 overflow-hidden'>
          <div className='w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0'></div>
          <div className='w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0'></div>
        </div>
      </div>
      <div className='space-y-4'>
        <div className='h-7 w-48 bg-gray-200 rounded-xl'></div>
        <div className='space-y-3'>
          <div className='h-5 w-3/4 bg-gray-200 rounded-lg'></div>
          <div className='h-12 w-full bg-gray-200 rounded-xl'></div>
        </div>
      </div>
    </div>
  )

  if (loading) return <SkeletonLoader />

  return (
    <section className='container mx-auto px-4 py-6 lg:py-10 max-w-6xl'>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className='flex items-center gap-2 mb-6 p-2 rounded-lg hover:bg-gray-50 transition-colors group'
      >
        <FaArrowLeft className='text-sm group-hover:-translate-x-1 transition-transform' />
        <span className='font-medium text-sm text-gray-700'>Back</span>
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12'>
        
        {/* Images */}
        <div className='space-y-4'>
          {/* Main Image */}
          <div className='relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group'>
            <div className='w-full h-64 sm:h-72 lg:h-[450px] relative'>
              <img
                src={data.image[image]}
                className='w-full h-full object-contain p-6 lg:p-8 transition-transform duration-300 group-hover:scale-105'
                alt={data.name}
              />
            </div>
            
            {/* Dots */}
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
              {data.image.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setImage(index)}
                  className={`h-2 w-2 sm:w-2.5 rounded-full transition-all duration-300 shadow-sm ${
                    index === image 
                      ? 'w-8 sm:w-10 bg-green-600 shadow-green-500/50 scale-110' 
                      : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          <div className='relative'>
            <div ref={imageContainer} className='flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory'>
              {data.image.map((img, index) => (
                <div 
                  key={img + index} 
                  onClick={() => setImage(index)}
                  className={`w-16 h-16 sm:w-18 sm:h-18 rounded-xl border-2 cursor-pointer flex-shrink-0 transition-all duration-200 shadow-sm snap-center hover:shadow-md ${
                    index === image 
                      ? 'border-green-500 ring-2 ring-green-100 scale-105 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                  }`}
                >
                  <img src={img} className='w-full h-full object-cover rounded-lg p-1' alt='thumbnail' />
                </div>
              ))}
            </div>
            {/* Scroll Arrows */}
            <button 
              onClick={() => handleScroll('left')} 
              className='absolute left-0 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-full shadow-md hover:shadow-lg -ml-1'
            >
              <FaAngleLeft size={12} className='text-gray-600' />
            </button>
            <button 
              onClick={() => handleScroll('right')} 
              className='absolute right-0 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-full shadow-md hover:shadow-lg -mr-1'
            >
              <FaAngleRight size={12} className='text-gray-600' />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className='lg:pt-4 space-y-6 lg:space-y-8'>
          
          {/* Header */}
          <div className='space-y-3'>
            <div className='flex items-center gap-3 flex-wrap'>
              <span className='px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full'>
                Top Rated
              </span>
              <span className='text-xs text-gray-500 font-medium'>{data.unit}</span>
            </div>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight line-clamp-2'>
              {data.name}
            </h1>
          </div>

          {/* Price Card */}
          <div className='bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow'>
            <div className='space-y-4'>
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>Price</p>
                  <div className='flex items-baseline gap-3'>
                    <span className='text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900'>
                      {DisplayPriceInRupees(PriceWithDiscount(data.price, data.discount))}
                    </span>
                    {data.discount > 0 && (
                      <span className='text-lg font-medium text-gray-500 line-through'>
                        {DisplayPriceInRupees(data.price)}
                      </span>
                    )}
                  </div>
                </div>
                {data.discount > 0 && (
                  <div className='bg-red-100 text-red-800 px-3 py-1 rounded-lg text-sm font-semibold'>
                    {data.discount}% OFF
                  </div>
                )}
              </div>

              {data.stock === 0 ? (
                <div className='w-full py-4 bg-gray-50 text-gray-500 rounded-xl font-semibold text-center border border-dashed border-gray-200'>
                  Out of Stock
                </div>
              ) : (
                <AddToCartButton 
                  data={data} 
                  className="w-full py-4 text-sm sm:text-base font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95" 
                />
              )}
            </div>
          </div>

          {/* Benefits */}
          <div className='space-y-3'>
            {[
              { img: minute_delivery, title: '10 Min Delivery', desc: 'From local store', color: 'text-green-600' },
              { img: Best_Prices_Offers, title: 'Best Price', desc: 'Lowest in city', color: 'text-blue-600' }
            ].map((item, idx) => (
              <div key={idx} className='flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors'>
                <img src={item.img} alt={item.title} className='w-9 h-9 flex-shrink-0 mt-0.5' />
                <div>
                  <p className='font-semibold text-sm text-gray-900'>{item.title}</p>
                  <p className='text-xs text-gray-600 mt-0.5'>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className='space-y-4 pt-4 border-t border-gray-100'>
            <h3 className='text-lg font-semibold text-gray-900'>Description</h3>
            <p className='text-sm leading-relaxed text-gray-700'>{data.description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDisplayPage