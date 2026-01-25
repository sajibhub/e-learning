import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaTimes } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllModules,
  createModule,
  updateModule,
  deleteModule,
  fetchCourseList,
} from "../redux/slices/course/courseModuleSlice.js";

// --------------------- HOOK ---------------------
const useQuery = () => new URLSearchParams(useLocation().search);

// --------------------- MODULE MODAL ---------------------
const ModuleModal = ({ isOpen, onClose, mode = "create", module = null }) => {
  const dispatch = useDispatch();
  const { courses = [], courseListLoading = false, courseError = null } = useSelector((state) => state.modules || {});
  const [formData, setFormData] = useState({ title: "", courseId: "" });

  useEffect(() => {
    dispatch(fetchCourseList());
  }, [dispatch]);

  useEffect(() => {
    if (mode === "update" && module) {
      setFormData({
        title: module.title || "",
        courseId: module.courseId || "",
      });
    } else {
      setFormData({ title: "", courseId: "" });
    }
  }, [mode, module, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.courseId) return;

    if (mode === "create") {
      dispatch(createModule(formData))
        .unwrap()
        .then(() => {
          onClose();
          // Refresh modules list
          dispatch(fetchAllModules());
        })
        .catch((error) => {
          console.error("Create module error:", error);
        });
    } else if (mode === "update" && module) {
      dispatch(updateModule({ moduleId: module._id, ...formData }))
        .unwrap()
        .then(() => {
          onClose();
          // Refresh modules list
          dispatch(fetchAllModules());
        })
        .catch((error) => {
          console.error("Update module error:", error);
        });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {mode === "create" ? "Create Module" : "Update Module"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        
        {/* Course Error Display */}
        {courseError && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-red-100 px-4 py-3 rounded-lg mb-4">
            {courseError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Module Title
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
              Course
            </label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={courseListLoading}
            >
              <option value="">
                {courseListLoading ? "Loading courses..." : "Select a course"}
              </option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
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
              {mode === "create" ? "Create" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --------------------- FILTER BAR ---------------------
const FilterBar = ({ search, course, setQueryParam, onOpenModuleModal }) => {
  const { courses = [], courseListLoading = false, courseError = null } = useSelector((state) => state.modules || {});
  
  // Handle retry for course list
  const handleRetryFetchCourses = () => {
    dispatch(fetchCourseList());
  };
  
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
      <div className="flex flex-wrap gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search modules..."
            value={search}
            onChange={(e) => setQueryParam("search", e.target.value)}
            className="w-full bg-gray-800 text-white py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
          />
        </div>
        <div className="relative">
          <select
            value={course}
            onChange={(e) => setQueryParam("course", e.target.value)}
            className="w-40 bg-gray-800 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 appearance-none"
            disabled={courseListLoading}
          >
            <option value="">
              {courseListLoading ? "Loading courses..." : "All Courses"}
            </option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
          {courseListLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {courseError && (
          <button
            onClick={handleRetryFetchCourses}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Retry loading courses
          </button>
        )}
        <button
          onClick={onOpenModuleModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="inline mr-2" /> Add Module
        </button>
      </div>
    </div>
  );
};

// --------------------- MODULE ROW ---------------------
const ModuleRow = ({ module, index, page, limit, onEdit, onDelete, courses = [] }) => {
  if (!module) return null;
  const serial = (page - 1) * limit + (index + 1);
  const courseTitle = courses.find((c) => c._id === module.courseId)?.title || "—";
  return (
    <tr className="hover:bg-gray-800 transition-colors duration-150 border-b border-gray-700">
      <td className="py-4 px-4 text-white">{serial}</td>
      <td className="py-4 px-4 text-white">
        {new Date(module.createdAt).toLocaleDateString("en-GB")}
        <br />
        <span className="text-gray-400 text-xs">
          {new Date(module.createdAt).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      </td>
      <td className="py-4 px-4 text-white font-medium">{module.title}</td>
      <td className="py-4 px-4 text-white">{courseTitle}</td>
      <td className="py-4 px-4">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(module)}
            className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700"
          >
            <FiEdit size={18} />
          </button>
          <button
            onClick={() => onDelete(module._id)}
            className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

// --------------------- PAGINATION ---------------------
const Pagination = ({ currentPage, totalPages, setQueryParam }) => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, currentPage + Math.floor(maxVisible / 2));
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex justify-center mt-6">
      <nav className="flex items-center space-x-2">
        <button
          onClick={() => setQueryParam("page", Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-4 py-1 text-white">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => setQueryParam("page", p)}
              className={`px-4 py-1 rounded-md ${
                currentPage === p
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => setQueryParam("page", Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  );
};

// --------------------- MAIN PAGE ---------------------
const ModuleManagementPage = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const search = query.get("search") || "";
  const course = query.get("course") || "";
  const currentPage = parseInt(query.get("page") || "1", 10);
  const limit = parseInt(query.get("limit") || "10", 10);

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleModalMode, setModuleModalMode] = useState("create");
  const [selectedModule, setSelectedModule] = useState(null);

  // Make sure to handle the case where state.modules might be undefined
  const modulesState = useSelector((state) => state.modules || {});
  const { 
    modules = [], 
    loading = false, 
    courses = [], 
    courseListLoading = false,
    error = null,
    courseError = null
  } = modulesState;

  // Fetch modules & courses
  useEffect(() => {
    dispatch(fetchAllModules({ courseId: course }));
    dispatch(fetchCourseList());
  }, [dispatch, course]);

  const setQueryParam = (key, value) => {
    const newQuery = new URLSearchParams(query.toString());
    if (!value) newQuery.delete(key);
    else newQuery.set(key, value);
    navigate({ search: newQuery.toString() ? `?${newQuery.toString()}` : "" });
  };

  const handleEditModule = (module) => {
    setSelectedModule(module);
    setModuleModalMode("update");
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = (id) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      dispatch(deleteModule(id))
        .unwrap()
        .then(() => {
          dispatch(fetchAllModules({ courseId: course }));
        })
        .catch((error) => {
          console.error("Delete module error:", error);
        });
    }
  };

  const handleOpenModuleModal = () => {
    setModuleModalMode("create");
    setSelectedModule(null);
    setIsModuleModalOpen(true);
  };

  // Client-side pagination
  const totalModules = modules.length;
  const totalPages = Math.ceil(totalModules / limit);
  const currentModules = modules.slice((currentPage - 1) * limit, currentPage * limit);

  return (
    <div className="bg-gray-900 min-h-screen shadow-lg p-2">
      <h2 className="text-white text-2xl font-bold mb-2">Module Management</h2>
      <p className="text-gray-400 mb-6">View and manage all course modules</p>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-red-100 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          {error}
          <button onClick={() => dispatch(clearError())} className="ml-4 text-white hover:text-gray-300">
            <FaTimes />
          </button>
        </div>
      )}

      <FilterBar
        search={search}
        course={course}
        setQueryParam={setQueryParam}
        onOpenModuleModal={handleOpenModuleModal}
      />

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
                Module Info
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Course
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
                .map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3">
                      <div className="h-4 w-10 bg-gray-700 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-24 bg-gray-700 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-32 bg-gray-700 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-20 bg-gray-700 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-8 w-16 bg-gray-700 rounded-lg"></div>
                    </td>
                  </tr>
                ))
            ) : currentModules.length > 0 ? (
              currentModules.map((module, idx) => (
                <ModuleRow
                  key={module._id || idx}
                  module={module}
                  index={idx}
                  page={currentPage}
                  limit={limit}
                  onEdit={handleEditModule}
                  onDelete={handleDeleteModule}
                  courses={courses}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  {courseListLoading ? "Loading modules..." : "No modules found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setQueryParam={setQueryParam}
        />
      )}

      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        mode={moduleModalMode}
        module={selectedModule}
      />
    </div>
  );
};

export default ModuleManagementPage;