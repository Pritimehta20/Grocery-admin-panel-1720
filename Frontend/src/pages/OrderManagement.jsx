import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Axios from '../utils/Axios.js'
import summaryApi from '../common/summaryApi.js'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees.js'
import toast from 'react-hot-toast'

const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingOrder, setUpdatingOrder] = useState(null)
  const [filters, setFilters] = useState({ search: '', status: '', dateFrom: '', dateTo: '' })
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [page, setPage] = useState(1)
  const itemsPerPage = 10
  const user = useSelector(state => state.user)

  // Status stats
  const stats = useMemo(() => {
    const statsObj = { pending: 0, confirmed: 0, dispatched: 0, shipped: 0, delivered: 0, cancelled: 0 }
    orders.forEach(order => statsObj[order.status]++)
    return statsObj
  }, [orders])

  useEffect(() => {
    fetchAllOrders()
  }, [])

  // Debounced search
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout)
    const timeout = setTimeout(() => {
      fetchAllOrders()
    }, 300)
    setSearchTimeout(timeout)
    return () => clearTimeout(timeout)
  }, [filters.search, filters.status, filters.dateFrom, filters.dateTo])

  const fetchAllOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters)
      const url = params.toString() ? `${summaryApi.getAllOrders.url}?${params.toString()}` : summaryApi.getAllOrders.url
      const response = await Axios({ method: 'get', url })
      if (response.data.success) {
        setOrders(response.data.data)
        setPage(1)
      }
    } catch (error) {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId)
      const response = await Axios({
        ...summaryApi.updateOrderStatus,
        url: summaryApi.updateOrderStatus.url.replace(':id', orderId),
        method: 'put',
        data: { status: newStatus }
      })
      if (response.data.success) {
        toast.success('Status updated')
        fetchAllOrders()
      }
    } catch (error) {
      toast.error('Update failed')
    } finally {
      setUpdatingOrder(null)
    }
  }

  const statusOptions = ['pending', 'confirmed', 'dispatched', 'shipped', 'delivered', 'cancelled']

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      dispatched: 'bg-indigo-100 text-indigo-800',
      confirmed: 'bg-orange-100 text-orange-800',
      pending: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const startIndex = (page - 1) * itemsPerPage
  const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(orders.length / itemsPerPage)

  if (loading) return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
    </div>
  )

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-indigo-50 via-white to-pink-50 rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8 p-2 sm:p-4 bg-white/60 backdrop-blur-sm rounded-2xl">
        {Object.entries(stats).map(([status, count]) => (
          <div key={status} className="p-3 sm:p-4 bg-white/80 hover:bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 hover:border-indigo-200 transition-all group">
            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mx-auto mb-1 sm:mb-2 ${getStatusColor(status).replace('text-', 'bg-').replace('-800', '-500 opacity-30')}`}></div>
            <div className={`font-bold text-base sm:text-lg group-hover:scale-105 transition-transform ${getStatusColor(status).split(' ')[1] || 'text-gray-800'}`}>
              {count}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 capitalize font-medium">{status}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6 sm:mb-8 pb-6 border-b border-gray-200/70">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
            Order Management
          </h1>
          <p className="text-gray-600 font-medium mt-1">{orders.length} total orders</p>
        </div>
        <button 
          onClick={fetchAllOrders}
          className="px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 active:translate-y-0 min-w-[120px] text-sm sm:text-base"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8 p-4 sm:p-6 bg-gradient-to-b from-white/70 to-white/40 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 hover:shadow-3xl transition-all">
        <input
          placeholder="🔍 Search customer..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
          className="p-4 border border-gray-200/70 rounded-2xl focus:ring-4 focus:ring-indigo-200/50 focus:border-indigo-400 bg-white/80 backdrop-blur-sm transition-all hover:border-gray-300"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
          className="p-4 border border-gray-200/70 rounded-2xl focus:ring-4 focus:ring-indigo-200/50 appearance-none bg-white/80 backdrop-blur-sm transition-all hover:border-gray-300 cursor-pointer"
        >
          <option value="">All Status</option>
          {statusOptions.map(stat => (
            <option key={stat} value={stat}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</option>
          ))}
        </select>
        <input 
          type="date" 
          value={filters.dateFrom} 
          onChange={(e) => setFilters(prev => ({...prev, dateFrom: e.target.value}))} 
          className="p-4 border border-gray-200/70 rounded-2xl focus:ring-4 focus:ring-indigo-200/50 bg-white/80 backdrop-blur-sm transition-all hover:border-gray-300" 
        />
        <input 
          type="date" 
          value={filters.dateTo} 
          onChange={(e) => setFilters(prev => ({...prev, dateTo: e.target.value}))} 
          className="p-4 border border-gray-200/70 rounded-2xl focus:ring-4 focus:ring-indigo-200/50 bg-white/80 backdrop-blur-sm transition-all hover:border-gray-300" 
        />
        <button 
          onClick={() => setFilters({ search: '', status: '', dateFrom: '', dateTo: '' })} 
          className="p-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base"
        >
          Clear All
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {paginatedOrders.map(order => (
          <div 
            key={order._id} 
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl hover:-translate-y-1 hover:border-indigo-200/50 transition-all duration-300 p-4 sm:p-6 lg:p-8 group"
          >
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-4 sm:pb-6 border-b border-gray-100/50">
              <div className="min-w-0">
                <div className="font-black text-xl sm:text-2xl text-indigo-900 truncate"># {order._id.slice(-8).toUpperCase()}</div>
                <div className="text-gray-600 text-sm sm:text-base font-medium truncate max-w-full">{order.userId?.name} • {order.userId?.phone || order.userId?.email}</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end sm:items-center pt-2 sm:pt-0">
                <div className="font-black text-xl sm:text-2xl lg:text-3xl text-gray-900 drop-shadow-sm">
                  {DisplayPriceInRupees(order.totalAmount)}
                </div>
                <span className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-bold shadow-md ${getStatusColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl backdrop-blur-sm">
                <span className="text-indigo-600">📦</span>
                <div>
                  <span className="text-xs sm:text-sm font-medium text-gray-500 block sm:inline">Items</span>
                  <div className="font-bold text-indigo-700 text-base sm:text-lg">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-2xl backdrop-blur-sm">
                <span className={`text-lg ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  💳
                </span>
                <span className={`px-2 py-1 rounded-lg text-xs sm:text-sm font-bold shadow-sm ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {order.paymentStatus?.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gradient-to-r from-gray-50/50 to-blue-50/50 rounded-2xl backdrop-blur-sm">
                <span className="text-blue-600">📅</span>
                <div>
                  <span className="text-xs sm:text-sm font-medium text-gray-500 block sm:inline">Date</span>
                  <div className="font-bold text-gray-900 text-sm sm:text-base">{new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 p-3 bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-2xl backdrop-blur-sm">
                <span className="text-purple-600 lg:hidden block text-lg mb-1 lg:mb-0">⚙️</span>
                <span className="text-sm lg:text-base font-medium text-gray-600 lg:hidden block">Status:</span>
                <span className="hidden lg:inline lg:text-sm lg:font-medium lg:text-gray-600">Update Status:</span>
                <select 
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  disabled={updatingOrder === order._id}
                  className={`flex-1 p-3 rounded-2xl font-bold text-sm sm:text-base shadow-md focus:ring-4 focus:ring-indigo-300/50 transition-all border-2 ${
                    updatingOrder === order._id 
                      ? 'bg-gray-100/70 cursor-not-allowed border-gray-300' 
                      : 'border-transparent bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:shadow-xl hover:border-indigo-200/50 hover:-translate-y-0.5'
                  }`}
                >
                  {statusOptions.map(stat => (
                    <option key={stat} value={stat} className="font-bold">
                      {stat.charAt(0).toUpperCase() + stat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 p-6 sm:p-8 bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 font-bold rounded-2xl hover:from-indigo-100 hover:to-indigo-200 disabled:from-gray-100 disabled:to-gray-200 disabled:text-gray-400 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 min-w-[140px] text-sm sm:text-base disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="font-black text-xl sm:text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 min-w-[140px] text-sm sm:text-base disabled:from-indigo-300 disabled:to-purple-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {orders.length === 0 && !loading && (
        <div className="text-center py-24 px-4">
          <div className="text-6xl sm:text-8xl mb-8 mx-auto w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-indigo-200/50 animate-pulse">
            📦
          </div>
          <h3 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4 drop-shadow-lg">
            No Orders Yet
          </h3>
          <p className="text-xl sm:text-2xl text-gray-500 font-semibold mb-8 max-w-lg mx-auto leading-relaxed">
            Orders will appear here once customers start shopping. Try adjusting your filters above.
          </p>
          <button 
            onClick={fetchAllOrders}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-3xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            🔄 Refresh Orders
          </button>
        </div>
      )}
    </div>
  )
}

export default OrderManagement

