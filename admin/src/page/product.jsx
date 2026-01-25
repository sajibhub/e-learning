import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
  setCreateProductModal,
  setUpdateProductModal,
  setSelectedProduct
} from "../redux/slices/product/productSlice.js";

import {
  createProductCategory,
  deleteProductCategory,
  getAllProductCategories,
  updateProductCategory,
  setCreateCategoryModal,
  setUpdateCategoryModal,
  setSelectedCategory
} from "../redux/slices/product/productCategorySlice.js";

// Product Category Modal Component
const ProductCategoryModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { categories, loading, currentPage, totalPages } = useSelector((state) => state.productCategory);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllProductCategories({ page, limit }));
    }
  }, [dispatch, isOpen, page, limit]);

  const handleCreateCategory = () => {
    if (categoryName.trim()) {
      dispatch(createProductCategory({ name: categoryName }))
        .then(() => {
          setCategoryName("");
          setIsCreateMode(false);
          dispatch(getAllProductCategories({ page, limit }));
        });
    }
  };

  const handleUpdateCategory = () => {
    const { selectedCategory } = useSelector((state) => state.productCategory);
    if (selectedCategory && categoryName.trim()) {
      dispatch(updateProductCategory({ id: selectedCategory._id, name: categoryName }))
        .then(() => {
          setCategoryName("");
          setIsUpdateMode(false);
          dispatch(getAllProductCategories({ page, limit }));
        });
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteProductCategory({ id }))
        .then(() => {
          dispatch(getAllProductCategories({ page, limit }));
        });
    }
  };

  const handleEditCategory = (category) => {
    dispatch(setSelectedCategory(category));
    setCategoryName(category.name);
    setIsUpdateMode(true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 md:p-4 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/30">
          <h2 className="text-lg md:text-xl font-bold text-white">Product Categories</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <IoClose className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        {/* Create Category Form */}
        {isCreateMode && (
          <div className="p-4 md:p-6 border-b border-white/20">
            <h3 className="text-white font-medium mb-4">Create New Category</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1 bg-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCreateCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreateMode(false);
                  setCategoryName("");
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Update Category Form */}
        {isUpdateMode && (
          <div className="p-4 md:p-6 border-b border-white/20">
            <h3 className="text-white font-medium mb-4">Update Category</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1 bg-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUpdateCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setIsUpdateMode(false);
                  setCategoryName("");
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="p-4 md:p-6">
          {!isCreateMode && !isUpdateMode && (
            <button
              onClick={() => setIsCreateMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4"
            >
              <FaPlus className="inline mr-2" />
              Add New Category
            </button>
          )}

          {loading ? (
            <div className="text-center py-4 text-white">Loading...</div>
          ) : categories && categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td className="px-4 py-3 text-white">{category.name}</td>
                      <td className="px-4 py-3 text-gray-300">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700"
                            title="Delete"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">No categories found</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center p-4">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded-md ${page === pageNum
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Modal Component
const ProductModal = ({ isOpen, onClose, mode = "create", product = null }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.productCategory);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    price: "",
    details: "",
    productImage: null,
    productZipFile: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const imageInputRef = useRef(null);
  const zipInputRef = useRef(null);

  useEffect(() => {
    if (mode === "update" && product) {
      setFormData({
        title: product.productTitle || "",
        categoryId: product.category || "",
        price: product.productPrice || "",
        details: product.productDetails || "",
        productImage: null,
        productZipFile: null,
      });
      setImagePreview(product.productImages || "");
    } else {
      setFormData({
        title: "",
        categoryId: "",
        price: "",
        details: "",
        productImage: null,
        productZipFile: null,
      });
      setImagePreview("");
    }
  }, [mode, product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, productImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleZipChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, productZipFile: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mode === "create") {
      dispatch(createProduct(formData))
        .then(() => {
          onClose();
          // Refresh products list
          dispatch(getAllProducts({ page: 1, limit: 10 }));
        });
    } else if (mode === "update" && product) {
      dispatch(updateProduct({ productId: product._id, ...formData }))
        .then(() => {
          onClose();
          // Refresh products list
          dispatch(getAllProducts({ page: 1, limit: 10 }));
        });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 md:p-4 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/30">
          <h2 className="text-lg md:text-xl font-bold text-white">
            {mode === "create" ? "Create New Product" : "Update Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <IoClose className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          <div className="space-y-4">
            {/* Product Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Product Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full bg-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories && categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Price */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full bg-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Product Details */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Details
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows="4"
                className="w-full bg-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            {/* Product Image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Image
              </label>
              <div className="flex items-center space-x-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                >
                  {imagePreview ? "Change Image" : "Select Image"}
                </button>
              </div>
            </div>

            {/* Product Zip File */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Zip File
              </label>
              <div className="flex items-center space-x-4">
                <input
                  ref={zipInputRef}
                  type="file"
                  accept=".zip"
                  onChange={handleZipChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => zipInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                >
                  {formData.productZipFile ? formData.productZipFile.name : "Select Zip File"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {mode === "create" ? "Create Product" : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Product Row Component
const ProductRow = ({ product, index, page, limit, onEdit, onDelete }) => {
  const serial = (page - 1) * limit + (index + 1);
  
  return (
    <tr className="border-t border-[#374151] hover:bg-[#252d3a]">
      <td className="px-3 py-2 md:px-4 md:py-3 text-white">{serial}</td>
      <td className="px-3 py-2 md:px-4 md:py-3">
        <div className="flex items-center space-x-3">
          {product.productImages ? (
            <img 
              src={product.productImages} 
              alt={product.productTitle} 
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center text-white font-semibold">
              {product.productTitle.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="text-white font-medium">{product.productTitle}</div>
            <div className="text-gray-400 text-sm truncate max-w-xs">
              {product.productDetails}
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 py-2 md:px-4 md:py-3 text-white">
        {product.category?.name || "—"}
      </td>
      <td className="px-3 py-2 md:px-4 md:py-3 text-blue-400 font-semibold">
        ৳{Number(product.productPrice).toLocaleString("en-BD")}
      </td>
      <td className="px-3 py-2 md:px-4 md:py-3">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200 cursor-pointer shadow-sm"
            title="Edit"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-200 cursor-pointer shadow-sm"
            title="Delete"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Product Skeleton Row Component
const ProductSkeletonRow = () => (
  <tr className="border-t border-gray-700 animate-pulse">
    <td className="px-3 py-2 md:px-4 md:py-3">
      <div className="h-4 bg-gray-700 rounded w-10"></div>
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

// Main Product Management Page
const ProductManagementPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { page: pageParam, limit: limitParam } = useParams();
  const dispatch = useDispatch();

  // Convert params to number and give fallback
  const currentPage = Number(pageParam) || 1;
  const pageSize = Number(limitParam) || 10;

  // State for modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState("create");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Search and filter states
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Debounce timer ref
  const debounceTimerRef = useRef(null);

  // Redux state
  const { products, loading, pages: totalPages } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.productCategory);

  // Initialize search values from URL params
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const initialCategory = queryParams.get("categoryId") || "";

  useEffect(() => {
    setSearchInput(initialSearch);
    setSearch(initialSearch);
    setCategoryId(initialCategory);
    
    // Load categories for filter dropdown
    dispatch(getAllProductCategories({ page: 1, limit: 100 }));
  }, [dispatch, initialSearch, initialCategory]);

  // Effect to fetch products when search, category, or page changes
  useEffect(() => {
    dispatch(getAllProducts({
      page: currentPage,
      limit: pageSize,
      search,
      categoryId,
    }));
  }, [dispatch, currentPage, pageSize, search, categoryId]);

  // Debounced search function
  const debouncedSearch = useCallback((searchValue) => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer
    debounceTimerRef.current = setTimeout(() => {
      setSearch(searchValue);
      setIsSearching(false);
      
      // Update URL
      const params = new URLSearchParams();
      if (searchValue.trim()) params.set("search", searchValue.trim());
      if (categoryId) params.set("categoryId", categoryId);

      navigate({
        pathname: `/products/1/${pageSize}`,
        search: params.toString(),
      });
    }, 500); // 500ms delay
  }, [categoryId, pageSize, navigate]);

  // Handle search input change
  const handleSearchInputChange = (value) => {
    setSearchInput(value);
    setIsSearching(true);
    debouncedSearch(value);
  };

  const handleCategoryChange = (value) => {
    setCategoryId(value);
    
    // Update URL
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (value) params.set("categoryId", value);

    navigate({
      pathname: `/products/1/${pageSize}`,
      search: params.toString(),
    });
  };

  const handlePageChange = (newPage) => {
    // Update URL
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (categoryId) params.set("categoryId", categoryId);

    navigate({
      pathname: `/products/${newPage}/${pageSize}`,
      search: params.toString(),
    });
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setProductModalMode("update");
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (product) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct({ productId: product._id }))
        .then(() => {
          // Refresh products list
          dispatch(getAllProducts({
            page: currentPage,
            limit: pageSize,
            search,
            categoryId,
          }));
        });
    }
  };

  const handleOpenProductModal = () => {
    setProductModalMode("create");
    setSelectedProduct(null);
    setIsProductModalOpen(true);
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
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Product Management</h1>

      {/* Search & Add Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:max-w-60">
            <input
              type="text"
              placeholder="Search by title..."
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
            value={categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories && categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Product Category Button */}
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Product Categories
          </button>
          
          {/* Add Product Button */}
          <button
            onClick={handleOpenProductModal}
            className="flex items-center cursor-pointer gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md shadow-md hover:opacity-90 transition"
          >
            <FaPlus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#1E2939] rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#334155] text-[#94a3b8] text-left">
            <tr>
              <th className="px-3 py-2 md:px-4 md:py-3">Sl</th>
              <th className="px-3 py-2 md:px-4 md:py-3">Product Info</th>
              <th className="px-3 py-2 md:px-4 md:py-3">Category</th>
              <th className="px-3 py-2 md:px-4 md:py-3">Price</th>
              <th className="px-3 py-2 md:px-4 md:py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {loading ? (
              Array(10)
                .fill(0)
                .map((_, i) => <ProductSkeletonRow key={i} />)
            ) : products && products.length > 0 ? (
              products.map((product, index) => (
                <ProductRow
                  key={product._id || index}
                  product={product}
                  index={index}
                  page={currentPage}
                  limit={pageSize}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  No products found matching your filters.
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

      {/* Modals */}
      <ProductCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        mode={productModalMode}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductManagementPage;