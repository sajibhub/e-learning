import React, { useState, useCallback, useEffect, useRef } from "react";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getUsers, updateUserStatus } from "../redux/slices/users/usersSlice";

// --- User Row Component ---
const UserRow = ({ user, index, page, limit, onToggleStatus }) => {
  const createdAt = user?.createdAt ? new Date(user.createdAt) : new Date();
  const localDate = createdAt.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const localTime = createdAt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const serial = (page - 1) * limit + (index + 1);

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-150 cursor-pointer">
      <td className="py-4 px-4 text-white">{serial}</td>
      <td className="py-4 px-4">
        <div className="text-white">{localDate}</div>
        <div className="text-gray-400 text-sm">{localTime}</div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center space-x-3">
          {user.profile ? (
            <img 
              src={user.profile} 
              alt={user.name} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="text-white font-medium">{user.name}</div>
            <div className="text-gray-400 text-sm">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-gray-300">{user.phone || 'N/A'}</td>
      <td className="py-4 px-4 text-gray-300">{user.address || 'N/A'}</td>
      <td className="py-4 px-4">
        <div className="flex items-center space-x-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <select
              value={user.status}
              onChange={(e) => onToggleStatus(user._id, e.target.value)}
              className={`px-3 py-1 rounded-md text-white text-sm font-medium ${
                user.status === 'active' ? 'bg-green-600' : 
                user.status === 'inactive' ? 'bg-yellow-600' : 
                'bg-red-600'
              }`}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </label>
        </div>
      </td>
    </tr>
  );
};

// --- Loading Skeleton ---
const LoadingSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <tr key={index} className="border-b border-gray-700">
        {Array.from({ length: 6 }).map((_, cellIndex) => (
          <td key={cellIndex} className="py-4 px-4">
            <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
          </td>
        ))}
      </tr>
    ))}
  </>
);

// --- Pagination ---
const Pagination = ({ currentPage, totalPages, onChange, loading }) => {
  const pages = [];
  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, currentPage + 1);
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
  }
  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || loading}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-4 py-2 text-white select-none">...</span>
        ) : (
          <button
            key={idx}
            onClick={() => onChange(page)}
            disabled={loading}
            className={`px-4 py-2 rounded-lg ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-800 text-white hover:bg-gray-700"} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || loading}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

// --- Main Users Page ---
const UsersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { page, limit } = useParams();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(parseInt(page) || 1);
  const [itemsPerPage] = useState(parseInt(limit) || 10);
  const [searchInput, setSearchInput] = useState(""); // New state for input field
  const [search, setSearch] = useState(""); // State for actual search value
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false); // New state to show searching indicator

  // Debounce timer ref
  const debounceTimerRef = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const initialStatus = queryParams.get("status") || "all";

  const { users, loading, totalPages, status } = useSelector((state) => state.users);

  // Initialize search values from URL params
  useEffect(() => {
    setSearchInput(initialSearch);
    setSearch(initialSearch);
    setStatusFilter(initialStatus);
  }, [initialSearch, initialStatus]);

  // Effect to fetch users when search, status, or page changes
  useEffect(() => {
    const query = {};
    if (search.trim()) query.search = search.trim();
    if (statusFilter && statusFilter !== "all") query.status = statusFilter;

    // Dispatch getUsers with params
    dispatch(getUsers({
      page: currentPage,
      limit: itemsPerPage,
      query,
    }));
  }, [dispatch, currentPage, itemsPerPage, search, statusFilter]);

  useEffect(() => {
    if (status === 401) {
      navigate("/login");
    }
  }, [status, navigate]);

  // Debounced search function
  const debouncedSearch = useCallback((searchValue) => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer
    debounceTimerRef.current = setTimeout(() => {
      setSearch(searchValue);
      setCurrentPage(1); // Reset to first page when searching
      setIsSearching(false);
      
      // Update URL
      const params = new URLSearchParams();
      if (searchValue.trim()) params.set("search", searchValue.trim());
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);

      navigate({
        pathname: `/users/1/${itemsPerPage}`,
        search: params.toString(),
      });
    }, 500); // 500ms delay
  }, [statusFilter, itemsPerPage, navigate]);

  // Handle search input change
  const handleSearchInputChange = (value) => {
    setSearchInput(value);
    setIsSearching(true);
    debouncedSearch(value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    
    // Update URL
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);

    navigate({
      pathname: `/users/${newPage}/${itemsPerPage}`,
      search: params.toString(),
    });
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    
    // Update URL
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (value && value !== "all") params.set("status", value);

    navigate({
      pathname: `/users/1/${itemsPerPage}`,
      search: params.toString(),
    });
  };

  const handleToggleStatus = (userId, newStatus) => {
    dispatch(updateUserStatus({ _id: userId, status: newStatus }));
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
    <div className="bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-2xl font-bold">Users Management</h1>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-grow max-w-md w-full">
            <input
              type="text"
              placeholder="Search by name, email"
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              className="w-full bg-gray-800 text-white py-2 pl-3 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            />
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
              ) : (
                <FaSearch />
              )}
            </div>
          </div>

          <div className="relative w-36">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="appearance-none w-full bg-gray-800 text-white py-2 pl-3 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <FaChevronDown />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg border border-gray-700 mt-4">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
              <th className="px-4 py-3 text-left">Sl</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">User Info</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Address</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {loading ? (
              <LoadingSkeleton />
            ) : users && users.length > 0 ? (
              users.map((user, index) => (
                <UserRow
                  key={user._id || index}
                  user={user}
                  index={index}
                  page={currentPage}
                  limit={itemsPerPage}
                  onToggleStatus={handleToggleStatus}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={handlePageChange}
          loading={loading}
        />
      )}
    </div>
  );
};

export default UsersPage;