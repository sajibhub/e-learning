// src/pages/admin/OrderManagementPage.js
import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaSearch, FaCheck, FaTimes, FaEye, FaUndo } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  getAllOrders, 
  updateOrderStatus, 
  clearError, 
  clearSuccessMessage, 
  setFilters, 
  resetFilters 
} from "../redux/slices/order/orderSlice.js";

// Order Row Component
const OrderRow = ({ order, index, page, limit, onUpdateStatus, onViewDetails }) => {
  const serial = (page - 1) * limit + (index + 1);
  
  return (
    <tr className="border-t border-[#374151] hover:bg-[#252d3a]">
      <td className="px-3 py-2 md:px-4 md:py-3 text-white">{serial}</td>
      <td className="px-3 py-2 md:px-4 md:py-3">
        <div className="text-white font-medium">{order.trxId}</div>
      </td>
      <td className="px-3 py-2 md:px-4 md:py-3">
        <div>
          <div className="text-white font-medium">{order.user?.name || "—"}</div>
          <div className="text-gray-400 text-sm">{order.user?.email || "—"}</div>
        </div>
      </td>
      <td className="px-3 py-2 md:px-4 md:py-3">
        <div>
          <div className="text-white font-medium">{order.product?.title || "—"}</div>
          <div className="text-gray-400 text-sm">{order.productType}</div>
        </div>
      </td>
      <td className="px-3 py-2 md:px-4 md:py-3 text-white">
        {order.paymentMethod}
      </td>
      <td className="px-3 py-2 md:px-4 md:py-3 text-blue-400 font-semibold">
        ৳{Number(order.product?.price || 0).toLocaleString("en-BD")}
      </td>
      <td className="px-3 py-2 md:px-4 md:py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          order.status === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : order.status === 'failed'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {order.status}
        </span>
      </td>
      <td className="px-3 py-2 md:px-4 md:py-3">
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(order)}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 cursor-pointer shadow-sm"
            title="View Details"
          >
            <FaEye className="w-4 h-4" />
          </button>
          {order.status === 'pending' && (
            <>
              <button
                onClick={() => onUpdateStatus(order._id, 'completed')}
                className="p-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200 cursor-pointer shadow-sm"
                title="Mark as Completed"
              >
                <FaCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => onUpdateStatus(order._id, 'failed')}
                className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-200 cursor-pointer shadow-sm"
                title="Mark as Failed"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </>
          )}
          {order.status === 'completed' && (
            <>
              <button
                onClick={() => onUpdateStatus(order._id, 'pending')}
                className="p-2 rounded-full bg-yellow-600 text-white hover:bg-yellow-700 transition-all duration-200 cursor-pointer shadow-sm"
                title="Mark as Pending"
              >
                <FaUndo className="w-4 h-4" />
              </button>
              <button
                onClick={() => onUpdateStatus(order._id, 'failed')}
                className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-200 cursor-pointer shadow-sm"
                title="Mark as Failed"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </>
          )}
          {order.status === 'failed' && (
            <>
              <button
                onClick={() => onUpdateStatus(order._id, 'pending')}
                className="p-2 rounded-full bg-yellow-600 text-white hover:bg-yellow-700 transition-all duration-200 cursor-pointer shadow-sm"
                title="Mark as Pending"
              >
                <FaUndo className="w-4 h-4" />
              </button>
              <button
                onClick={() => onUpdateStatus(order._id, 'completed')}
                className="p-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200 cursor-pointer shadow-sm"
                title="Mark as Completed"
              >
                <FaCheck className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 md:p-4 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/30">
          <h2 className="text-lg md:text-xl font-bold text-white">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transaction Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">Transaction Details</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction ID:</span>
                  <span className="text-white font-medium">{order.trxId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : order.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Method:</span>
                  <span className="text-white font-medium">{order.paymentMethod}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Number:</span>
                  <span className="text-white font-medium">{order.payNumber}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Created At:</span>
                  <span className="text-white font-medium">{formatDate(order.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">User Details</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white font-medium">{order.user?.name || "—"}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white font-medium">{order.user?.email || "—"}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">User ID:</span>
                  <span className="text-white font-medium text-sm">{order.user?._id || "—"}</span>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">Product Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Product Type:</span>
                    <span className="text-white font-medium">{order.productType}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Product Title:</span>
                    <span className="text-white font-medium text-right max-w-xs">{order.product?.title || "—"}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-blue-400 font-semibold">৳{Number(order.product?.price || 0).toLocaleString("en-BD")}</span>
                  </div>
                  
                  {order.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white font-medium">{order.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Skeleton Row Component
const OrderSkeletonRow = () => (
  <tr className="border-t border-gray-700 animate-pulse">
    <td className="px-3 py-2 md:px-4 md:py-3">
      <div className="h-4 bg-gray-700 rounded w-10"></div>
    </td>
    <td className="px-3 py-2 md:px-4 md:py-3">
      <div className="h-4 bg-gray-700 rounded w-24"></div>
    </td>
    <td className="px-3 py-2 md:px-4 md:py-3">
      <div className="h-4 bg-gray-700 rounded w-32"></div>
    </td>
    <td className="px-3 py-2 md:px-4 md:py-3">
      <div className="h-4 bg-gray-700 rounded w-32"></div>
    </td>
    <td className="px-3 py-2 md:px-4 md:py-3">
      <div className="h-4 bg-gray-700 rounded w-20"></div>
    </td>
    <td className="px-3 py-2 md:px-4 md:py-3">
      <div className="h-4 bg-gray-700 rounded w-16"></div>
    </td>
    <td className="px-3 py-2 md:px-4 md:py-3">
      <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
    </td>
    <td className="px-3 py-2 md:px-4 md:py-3">
      <div className="h-8 w-16 bg-gray-700 rounded-lg"></div>
    </td>
  </tr>
);

// Pagination Component
const Pagination = ({ currentPage, totalPages, onChange }) => {
  const pages = [];
  const maxVisiblePages = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let end = Math.min(totalPages, currentPage + Math.floor(maxVisiblePages / 2));
  
  if (end - start + 1 < maxVisiblePages)
    start = Math.max(1, end - maxVisiblePages + 1);
    
  for (let i = start; i <= end; i++) pages.push(i);
  
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6">
      <button
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm bg-slate-800/80 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
      >
        Prev
      </button>
      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-2 py-2 text-white text-sm">
            ...
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => onChange(page)}
            className={`px-3 py-2 text-sm rounded-lg ${currentPage === page ? "bg-blue-600 text-white" : "bg-slate-800/80 text-white hover:bg-slate-700"} transition-colors`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm bg-slate-800/80 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 md:p-4 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-md overflow-y-auto shadow-2xl">
        <div className="p-4 md:p-6">
          <h3 className="text-lg font-bold text-white mb-4">Confirm Action</h3>
          <p className="text-gray-300 mb-6">{message}</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Order Management Page
const OrderManagementPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State for modals
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Search and filter states
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Debounce timer ref
  const debounceTimerRef = useRef(null);

  // Redux state
  const { 
    orders, 
    loading, 
    updateLoading, 
    error, 
    successMessage,
    currentPage, 
    totalPages, 
    limit,
    filters
  } = useSelector((state) => state.order);

  // Initialize search values from URL params
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const initialType = queryParams.get("type") || "";

  useEffect(() => {
    setSearchInput(initialSearch);
    dispatch(setFilters({ search: initialSearch, type: initialType }));
  }, [dispatch, initialSearch, initialType]);

  // Effect to fetch orders when search, type, or page changes
  useEffect(() => {
    dispatch(getAllOrders({
      page: currentPage,
      limit,
      search: filters.search,
      type: filters.type,
    }));
  }, [dispatch, currentPage, limit, filters.search, filters.type]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  // Debounced search function
  const debouncedSearch = useCallback((searchValue) => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer
    debounceTimerRef.current = setTimeout(() => {
      dispatch(setFilters({ search: searchValue }));
      setIsSearching(false);
      
      // Update URL
      const params = new URLSearchParams();
      if (searchValue.trim()) params.set("search", searchValue.trim());
      if (filters.type) params.set("type", filters.type);

      navigate({
        pathname: `/orders/1/${limit}`,
        search: params.toString(),
      });
    }, 500); // 500ms delay
  }, [filters.type, limit, navigate, dispatch]);

  // Handle search input change
  const handleSearchInputChange = (value) => {
    setSearchInput(value);
    setIsSearching(true);
    debouncedSearch(value);
  };

  const handleTypeChange = (value) => {
    dispatch(setFilters({ type: value }));
    
    // Update URL
    const params = new URLSearchParams();
    if (filters.search.trim()) params.set("search", filters.search.trim());
    if (value) params.set("type", value);

    navigate({
      pathname: `/orders/1/${limit}`,
      search: params.toString(),
    });
  };

  const handlePageChange = (newPage) => {
    // Update URL
    const params = new URLSearchParams();
    if (filters.search.trim()) params.set("search", filters.search.trim());
    if (filters.type) params.set("type", filters.type);

    navigate({
      pathname: `/orders/${newPage}/${limit}`,
      search: params.toString(),
    });
  };

  const handleUpdateStatus = (orderId, status) => {
    setConfirmAction(() => () => {
      dispatch(updateOrderStatus({ transactionId: orderId, status }))
        .then((result) => {
          // Check if there was an error
          if (result.error) {
            // Show error message from the backend
            setConfirmMessage(result.error.message);
          } else {
            // Refresh orders list
            dispatch(getAllOrders({
              page: currentPage,
              limit,
              search: filters.search,
              type: filters.type,
            }));
            setIsConfirmModalOpen(false);
          }
        });
    });
    
    setConfirmMessage(
      `Are you sure you want to mark this order as ${status}?`
    );
    setIsConfirmModalOpen(true);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Order Management</h1>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-600/20 border border-green-600/50 rounded-lg text-green-400">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-600/20 border border-red-600/50 rounded-lg text-red-400">
          {error}
          <button 
            onClick={() => dispatch(clearError())}
            className="ml-4 text-white hover:text-gray-300"
          >
            ×
          </button>
        </div>
      )}

      {/* Search & Filter Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:max-w-60">
            <input
              type="text"
              placeholder="Search by transaction ID..."
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              className="w-full border border-white/60 bg-gray-800 text-white py-2 md:py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            <div className="absolute inset-y-0 left-2 flex items-center px-2 text-primary">
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
              ) : (
                <FaSearch />
              )}
            </div>
          </div>

          <select
            className="w-full sm:max-w-40 border border-white/60 bg-gray-800 text-white py-2 md:py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            value={filters.type}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="course">Courses</option>
            <option value="product">Products</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#1E2939] rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#334155] text-[#94a3b8] text-left">
            <tr>
              <th className="px-3 py-2 md:px-4 md:py-3">Sl</th>
              <th className="px-3 py-2 md:px-4 md:py-3">Transaction ID</th>
              <th className="px-3 py-2 md:px-4 md:py-3">User</th>
              <th className="px-3 py-2 md:px-4 md:py-3">Product</th>
              <th className="px-3 py-2 md:px-4 md:py-3">Payment Method</th>
              <th className="px-3 py-2 md:px-4 md:py-3">Price</th>
              <th className="px-3 py-2 md:px-4 md:py-3">Status</th>
              <th className="px-3 py-2 md:px-4 md:py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {loading ? (
              Array(10)
                .fill(0)
                .map((_, i) => <OrderSkeletonRow key={i} />)
            ) : orders && orders.length > 0 ? (
              orders.map((order, index) => (
                <OrderRow
                  key={order._id || index}
                  order={order}
                  index={index}
                  page={currentPage}
                  limit={limit}
                  onUpdateStatus={handleUpdateStatus}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400">
                  No orders found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={handlePageChange}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmAction}
        message={confirmMessage}
        loading={updateLoading}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderManagementPage;