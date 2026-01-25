import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaTimes } from "react-icons/fa";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { 
  getAllCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  setCreateCourseModal,
  setUpdateCourseModal,
  setSelectedCourse
} from "../redux/slices/course/courseSlice";
import { 
  getAllCourseCategories,
  createCourseCategory,
  updateCourseCategory,
  deleteCourseCategory,
  setCreateCategoryModal,
  setUpdateCategoryModal,
  setSelectedCategory
} from "../redux/slices/course/courseCategorySlice";

// Hook: parse query params
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

// Course Category Modal Component
const CourseCategoryModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { categories, loading, currentPage, totalPages } = useSelector((state) => state.courseCategory);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllCourseCategories({ page, limit }));
    }
  }, [dispatch, isOpen, page, limit]);

  const handleCreateCategory = () => {
    if (categoryName.trim()) {
      dispatch(createCourseCategory({ name: categoryName }))
        .then(() => {
          setCategoryName("");
          setIsCreateMode(false);
          dispatch(getAllCourseCategories({ page, limit }));
        });
    }
  };

  const handleUpdateCategory = () => {
    const { selectedCategory } = useSelector((state) => state.courseCategory);
    if (selectedCategory && categoryName.trim()) {
      dispatch(updateCourseCategory({ id: selectedCategory._id, name: categoryName }))
        .then(() => {
          setCategoryName("");
          setIsUpdateMode(false);
          dispatch(getAllCourseCategories({ page, limit }));
        });
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCourseCategory({ id }))
        .then(() => {
          dispatch(getAllCourseCategories({ page, limit }));
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
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Course Categories</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Create Category Form */}
        {isCreateMode && (
          <div className="mb-4 p-4  bg-black/10 backdrop-blur-sm rounded-lg">
            <h3 className="text-white font-medium mb-2">Create New Category</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1 bg-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCreateCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreateMode(false);
                  setCategoryName("");
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Update Category Form */}
        {isUpdateMode && (
          <div className="mb-4 p-4 bg-black/10 backdrop-blur-sm rounded-lg">
            <h3 className="text-white font-medium mb-2">Update Category</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1 bg-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUpdateCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setIsUpdateMode(false);
                  setCategoryName("");
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="mb-4">
          {!isCreateMode && !isUpdateMode && (
            <button
              onClick={() => setIsCreateMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
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
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
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
          <div className="flex justify-center mt-4">
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

// Course Modal Component
const CourseModal = ({ isOpen, onClose, mode = "create", course = null }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.courseCategory);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    details: "",
    price: "",
    category: ""
  });

  useEffect(() => {
    if (mode === "update" && course) {
      setFormData({
        title: course.title || "",
        link: course.videoLink || "",
        details: course.courseDetails || "",
        price: course.coursePrice || "",
        category: course.category?._id || course.category || ""
      });
    } else {
      setFormData({
        title: "",
        link: "",
        details: "",
        price: "",
        category: ""
      });
    }
  }, [mode, course, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mode === "create") {
      dispatch(createCourse(formData))
        .then(() => {
          onClose();
          // Refresh courses list
          dispatch(getAllCourses({ page: 1, limit: 10 }));
        });
    } else if (mode === "update" && course) {
      dispatch(updateCourse({ id: course._id, ...formData }))
        .then(() => {
          onClose();
          // Refresh courses list
          dispatch(getAllCourses({ page: 1, limit: 10 }));
        });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {mode === "create" ? "Create New Course" : "Update Course"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Video Link
            </label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Course Details
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows="4"
              className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {mode === "create" ? "Create Course" : "Update Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Filter Bar Component
const FilterBar = ({ search, category, setQueryParam, onOpenCategoryModal, onOpenCourseModal }) => {
  const { categories } = useSelector((state) => state.courseCategory);
  
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
      <div className="flex flex-wrap gap-4 flex-1">
        {/* Search Input */}
       

        {/* Category Select */}
        <select
          value={category}
          onChange={(e) => setQueryParam("category", e.target.value)}
          className="w-40 bg-gray-800 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
        >
          <option value="">All Categories</option>
          {categories && categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Course Category Button */}
        <button
          onClick={onOpenCategoryModal}
          className="bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Course Categories
        </button>
        
        {/* Add Course Button */}
        <button
          onClick={onOpenCourseModal}
          className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="inline mr-2" />
          Add Course
        </button>
      </div>
    </div>
  );
};

// Course Row Component
const CourseRow = ({ course, index, page, limit, onEdit, onDelete }) => {
  const serial = (page - 1) * limit + (index + 1);
  
  return (
    <tr className="hover:bg-gray-800 transition-colors duration-150 border-b border-gray-700">
      {/* Serial */}
      <td className="py-4 px-4 text-white">{serial}</td>

      {/* Date + Time */}
      <td className="py-4 px-4 text-white">
        {new Date(course.createdAt).toLocaleDateString("en-GB")} <br />
        <span className="text-gray-400 text-xs">
          {new Date(course.createdAt).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      </td>

      {/* Course Info */}
      <td className="py-4 px-4 text-white">
        <div className="font-medium">{course.title}</div>
        <div className="text-gray-400 text-sm truncate max-w-xs">
          {course.courseDetails}
        </div>
      </td>

      {/* Category */}
      <td className="py-4 px-4 text-white">
        {course.category?.name || "—"}
      </td>

      {/* Price */}
      <td className="py-4 px-4 text-blue-400 font-semibold">
        ৳{Number(course.coursePrice).toLocaleString("en-BD")}
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(course)}
            className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
            title="Edit"
          >
            <FiEdit size={18} />
          </button>
          <button
            onClick={() => onDelete(course._id)}
            className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
            title="Delete"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Course Skeleton Row Component
const CourseSkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3">
      <div className="h-4 w-10 bg-gray-300 rounded"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-24 bg-gray-300 rounded"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-32 bg-gray-300 rounded"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-20 bg-gray-300 rounded"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-16 bg-gray-300 rounded"></div>
    </td>
    <td className="px-4 py-3 text-right">
      <div className="h-8 w-16 bg-gray-300 rounded-lg"></div>
    </td>
  </tr>
);

// Pagination Component
const Pagination = ({ currentPage, totalPages, setQueryParam }) => {
  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, currentPage + Math.floor(maxVisiblePages / 2));
  
  if (endPage - startPage + 1 < maxVisiblePages)
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
    
  for (let i = startPage; i <= endPage; i++) pages.push(i);
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex justify-center mt-6">
      <nav className="flex items-center space-x-2">
        <button
          onClick={() => setQueryParam("page", Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={idx} className="px-4 py-1 text-white">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => setQueryParam("page", page)}
              className={`px-4 py-1 rounded-md ${currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                } transition-colors`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() =>
            setQueryParam("page", Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  );
};

// Main Page
const CourseManagementPage = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Query params
  const search = query.get("search") || "";
  const category = query.get("category") || "";
  const currentPage = parseInt(query.get("page") || "1", 10);
  const limit = parseInt(query.get("limit") || "10", 10);

  // State for modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState("create");
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Redux state
  const { courses, loading, totalPages } = useSelector((state) => state.course);

  // Effects
  useEffect(() => {
    dispatch(getAllCourses({ page: currentPage, limit, search, category }));
  }, [dispatch, currentPage, limit, search, category]);

  useEffect(() => {
    // Load categories for filter dropdown
    dispatch(getAllCourseCategories({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Helpers
  const setQueryParam = (key, value) => {
    const newQuery = new URLSearchParams(query.toString());

    if (!value || value === "") {
      newQuery.delete(key);
    } else {
      newQuery.set(key, value);
    }

    const queryString = newQuery.toString();
    navigate({ search: queryString ? `?${queryString}` : "" });
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setCourseModalMode("update");
    setIsCourseModalOpen(true);
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      dispatch(deleteCourse({ id }))
        .then(() => {
          // Refresh courses list
          dispatch(getAllCourses({ page: currentPage, limit, search, category }));
        });
    }
  };

  const handleOpenCourseModal = () => {
    setCourseModalMode("create");
    setSelectedCourse(null);
    setIsCourseModalOpen(true);
  };

  return (
    <div className="bg-gray-900 min-h-screen shadow-lg">
      <h2 className="text-white text-2xl font-bold mb-2">Course Management</h2>
      <p className="text-gray-400 mb-6">
        View and manage all courses and course categories
      </p>

      <FilterBar 
        search={search} 
        category={category}
        setQueryParam={setQueryParam} 
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        onOpenCourseModal={handleOpenCourseModal}
      />

      {/* Courses Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-750">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Sl
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Course Info
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {loading ? (
              Array(10)
                .fill(0)
                .map((_, i) => <CourseSkeletonRow key={i} />)
            ) : courses && courses.length > 0 ? (
              courses.map((course, index) => (
                <CourseRow
                  key={course._id || index}
                  course={course}
                  index={index}
                  page={currentPage}
                  limit={limit}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-400">
                  No courses found matching your filters.
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
          setQueryParam={setQueryParam}
        />
      )}

      {/* Modals */}
      <CourseCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        mode={courseModalMode}
        course={selectedCourse}
      />
    </div>
  );
};

export default CourseManagementPage;