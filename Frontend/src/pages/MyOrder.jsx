import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Axios from '../utils/Axios'
import summaryApi from '../common/summaryApi'
import { handleSetOrders } from '../store/orderSlice'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import fetchUserDetails from '../utils/fetchUserDetails'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import {
  FaRotateRight,
  FaClock,
  FaCheck,
  FaBox,
  FaTruck,
  FaCircleCheck,
  FaBagShopping,
} from 'react-icons/fa6'

const ORDER_STEPS = ['pending', 'confirmed', 'dispatched', 'shipped', 'delivered']

const stepIcons = {
  pending: FaClock,
  confirmed: FaCheck,
  dispatched: FaBox,
  shipped: FaTruck,
  delivered: FaCircleCheck,
}

const stepLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  dispatched: 'Dispatched',
  shipped: 'Shipped',
  delivered: 'Delivered',
}

const statusClasses = {
  pending: {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    card: 'from-amber-50 via-white to-white',
    accent: 'bg-amber-400',
  },
  confirmed: {
    badge: 'bg-sky-100 text-sky-800 border-sky-200',
    card: 'from-sky-50 via-white to-white',
    accent: 'bg-sky-400',
  },
  dispatched: {
    badge: 'bg-violet-100 text-violet-800 border-violet-200',
    card: 'from-violet-50 via-white to-white',
    accent: 'bg-violet-400',
  },
  shipped: {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    card: 'from-blue-50 via-white to-white',
    accent: 'bg-blue-500',
  },
  delivered: {
    badge: 'bg-green-100 text-green-800 border-green-200',
    card: 'from-green-50 via-white to-white',
    accent: 'bg-green-500',
  },
  cancelled: {
    badge: 'bg-red-100 text-red-800 border-red-200',
    card: 'from-red-50 via-white to-white',
    accent: 'bg-red-500',
  },
  paid: 'bg-green-100 text-green-800 border-green-200',
  unpaid: 'bg-orange-100 text-orange-800 border-orange-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
}

const MyOrder = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const orders = useSelector((state) => state.order.orders)
  const user = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    if (!user?._id) {
      const userDetails = await fetchUserDetails()
      if (!userDetails) {
        navigate('/login')
        return
      }
    }

    try {
      setLoading(true)
      const response = await Axios(summaryApi.getUserOrders)
      if (response?.data?.success) {
        dispatch(handleSetOrders(response.data.data || []))
      }
    } catch (error) {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const getStepIndex = (status) => {
    const normalized = status?.toLowerCase?.() || 'pending'
    const index = ORDER_STEPS.indexOf(normalized)
    return index >= 0 ? index : 0
  }

  const formatOrderId = (id) => `#${id?.slice(-8)?.toUpperCase() || 'ORDER'}`

  const CompactTracking = ({ status }) => {
    const normalized = status?.toLowerCase?.() || 'pending'
    const currentStep = getStepIndex(normalized)
    const progressWidth =
      ORDER_STEPS.length > 1
        ? `${(currentStep / (ORDER_STEPS.length - 1)) * 100}%`
        : '0%'

    if (normalized === 'cancelled') {
      return (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
          <p className="text-[11px] font-medium text-red-700 sm:text-xs">
            Order cancelled
          </p>
        </div>
      )
    }

    return (
      <div className="mt-3 overflow-hidden">
        <div className="relative px-1 sm:px-2">
          <div className="absolute left-4 right-4 top-3 h-[3px] rounded-full bg-slate-200 sm:left-5 sm:right-5"></div>

          <div
            className="absolute left-4 top-3 h-[3px] rounded-full bg-green-500 transition-all duration-500 sm:left-5"
            style={{ width: `calc(${progressWidth} - 0.25rem)` }}
          ></div>

          <div className="relative z-10 grid grid-cols-5 gap-1">
            {ORDER_STEPS.map((step, index) => {
              const Icon = stepIcons[step]
              const done = index < currentStep
              const current = index === currentStep

              return (
                <div key={step} className="flex min-w-0 flex-col items-center text-center">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border shadow-sm sm:h-8 sm:w-8 ${
                      done
                        ? 'border-green-500 bg-green-500 text-white'
                        : current
                        ? 'border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-100'
                        : 'border-slate-300 bg-white text-slate-400'
                    }`}
                  >
                    <Icon className="text-[9px] sm:text-[11px]" />
                  </div>

                  <p
                    className={`mt-1 max-w-[52px] break-words text-center text-[8px] leading-3 sm:max-w-none sm:text-[10px] ${
                      done
                        ? 'font-medium text-green-700'
                        : current
                        ? 'font-semibold text-blue-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {stepLabels[step]}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 px-1">
          <p className="text-[10px] uppercase tracking-wide text-slate-500 sm:text-[11px]">
            Tracking
          </p>
          <p className="truncate text-[11px] font-medium capitalize text-blue-700 sm:text-xs">
            {normalized}
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <section className="min-h-[60vh] bg-gradient-to-b from-slate-50 to-white px-2 py-4 sm:px-4 sm:py-6">
        <div className="mx-auto w-full max-w-4xl space-y-3">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-28 rounded bg-slate-200" />
                  <div className="h-3 w-20 rounded bg-slate-200" />
                </div>
                <div className="h-6 w-16 rounded-full bg-slate-200" />
              </div>
              <div className="mt-4 h-14 rounded-xl bg-slate-100" />
              <div className="mt-3 h-10 rounded-xl bg-slate-100" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-[60vh] bg-gradient-to-b from-slate-50 via-white to-sky-50/40 px-2 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-slate-900 sm:text-xl">
                My Orders
              </h1>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {orders?.length || 0} {orders?.length === 1 ? 'order' : 'orders'}
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 text-xs font-medium text-sky-700 transition hover:bg-sky-100 sm:h-10 sm:text-sm"
            >
              <FaRotateRight className="text-[10px] sm:text-xs" />
              Refresh
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center shadow-sm sm:px-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
              <FaBagShopping className="text-lg" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-slate-900 sm:text-lg">
              No orders yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
              Your order history will appear here after you place your first order.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-5 inline-flex items-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-700"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order) => {
              const totalItems =
                order?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

              const normalizedStatus = order?.status?.toLowerCase?.() || 'pending'
              const statusTheme =
                statusClasses[normalizedStatus] || statusClasses.pending

              return (
                <div
                  key={order._id}
                  className={`overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${statusTheme.card} shadow-sm transition hover:shadow-md`}
                >
                  <div className={`h-1.5 w-full ${statusTheme.accent}`}></div>

                  <div className="px-3 py-3 sm:px-5 sm:py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                          {formatOrderId(order._id)}
                        </h3>
                        <p className="mt-1 text-[11px] text-slate-500 sm:text-sm">
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`rounded-full border px-2 py-1 text-[10px] font-medium capitalize sm:px-2.5 sm:text-[11px] ${statusTheme.badge}`}
                        >
                          {order.status}
                        </span>
                        <div className="text-sm font-semibold text-slate-900 sm:text-base">
                          {DisplayPriceInRupees(order.totalAmount)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-white/70 bg-white/80 px-2.5 py-2 shadow-sm backdrop-blur-sm">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                          Items
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-800 sm:text-sm">
                          {totalItems}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/70 bg-white/80 px-2.5 py-2 shadow-sm backdrop-blur-sm">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                          Payment
                        </p>
                        <p
                          className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${
                            statusClasses[order?.paymentStatus?.toLowerCase?.()] ||
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {order.paymentStatus || 'pending'}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/70 bg-white/80 px-2.5 py-2 shadow-sm backdrop-blur-sm">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                          Updated
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-800 sm:text-sm">
                          {new Date(order.updatedAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <CompactTracking status={order.status} />

                    <div className="mt-3">
                      <p className="mb-2 text-xs font-medium text-slate-700 sm:text-sm">
                        Items
                      </p>

                      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                        {order?.items?.map((item, index) => (
                          <div
                            key={index}
                            className="w-[84px] shrink-0 rounded-xl border border-white/70 bg-white/85 p-2 shadow-sm sm:w-[96px]"
                          >
                            <div className="mb-2 overflow-hidden rounded-lg bg-slate-50">
                              <img
                                src={item.productId?.image?.[0] || '/vite.svg'}
                                alt={item.productId?.name || 'Product'}
                                className="h-14 w-full object-contain sm:h-16"
                              />
                            </div>
                            <p className="line-clamp-2 text-[10px] font-medium leading-4 text-slate-700 sm:text-[11px]">
                              {item.productId?.name}
                            </p>
                            <div className="mt-1 inline-flex rounded-full border border-sky-100 bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                              Qty {item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default MyOrder