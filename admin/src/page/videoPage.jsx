import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaTimes, FaPlay } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllVideos,
  createVideo,
  updateVideo,
  deleteVideo,
} from "../redux/slices/course/courseVideoSlice.js";
import { getAllCourses } from "../redux/slices/course/courseSlice.js";
import { fetchAllModules } from "../redux/slices/course/courseModuleSlice.js";

// --------------------- HOOK ---------------------
const useQuery = () => new URLSearchParams(useLocation().search);

// --------------------- VIDEO MODAL ---------------------
const VideoModal = ({ isOpen, onClose, mode = "create", video = null }) => {
  const dispatch = useDispatch();
  const { courses = [] } = useSelector((state) => state.course || {});
  const { modules = [] } = useSelector((state) => state.modules || {});
  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
    courseId: "",
    moduleId: "",
  });

  // Fetch courses and modules when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(getAllCourses({ page: 1, limit: 100 }));
      dispatch(fetchAllModules()); // Fetch all modules initially
    }
  }, [dispatch, isOpen]);

  // Populate form when in update mode
  useEffect(() => {
    if (mode === "update" && video) {
      setFormData({
        title: video.title || "",
        videoUrl: video.videoUrl || "",
        courseId: video.courseId || "",
        moduleId: video.moduleId || "",
      });
      // If video has a courseId, fetch modules for that specific course
      if (video.courseId) {
        dispatch(fetchAllModules({ courseId: video.courseId }));
      }
    } else {
      setFormData({ title: "", videoUrl: "", courseId: "", moduleId: "" });
    }
  }, [mode, video, isOpen, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setFormData((prev) => ({ ...prev, courseId, moduleId: "" })); // Reset module
    if (courseId) {
      dispatch(fetchAllModules({ courseId })); // Fetch modules for selected course
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.videoUrl || !formData.courseId || !formData.moduleId) return;

    const action = mode === "create" 
      ? createVideo(formData) 
      : updateVideo({ videoId: video._id, ...formData });

    dispatch(action)
      .unwrap()
      .then(() => {
        onClose();
        // Refresh video list
        const query = new URLSearchParams(useLocation().search);
        dispatch(fetchAllVideos({ courseId: query.get("course"), moduleId: query.get("module") }));
      })
      .catch((error) => console.error(`${mode} video error:`, error));
  };

  if (!isOpen) return null;

  // Filter modules based on selected course
  const availableModules = modules.filter(m => !formData.courseId || m.courseId === formData.courseId);

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {mode === "create" ? "Create New Video" : "Update Video"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Video Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Video URL</label>
            <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Course</label>
            <select name="courseId" value={formData.courseId} onChange={handleCourseChange} className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="">Select a course</option>
              {courses.map((c) => (<option key={c._id} value={c._id}>{c.title}</option>))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Module</label>
            <select name="moduleId" value={formData.moduleId} onChange={handleChange} className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={!formData.courseId}>
              <option value="">{formData.courseId ? "Select a module" : "Select a course first"}</option>
              {availableModules.map((m) => (<option key={m._id} value={m._id}>{m.title}</option>))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{mode === "create" ? "Create" : "Update"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --------------------- VIDEO PLAYER MODAL ---------------------
const VideoPlayerModal = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  // Transform normal YouTube link to embed URL if needed
  const embedUrl = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")
    ? `https://www.youtube.com/embed/${videoUrl.split("v=")[1]?.split("&")[0]}`
    : videoUrl;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Video Player</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><FaTimes size={20} /></button>
        </div>
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          {videoUrl.includes("youtube") || videoUrl.includes("youtu.be") ? (
            <iframe
              src={embedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded"
            ></iframe>
          ) : (
            <video src={videoUrl} controls autoPlay className="w-full h-full rounded">
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  );
};


// --------------------- FILTER BAR ---------------------
const FilterBar = ({ search, course, module, setQueryParam, onOpenVideoModal }) => {
  const { courses = [] } = useSelector((state) => state.course || {});
  const { modules = [] } = useSelector((state) => state.modules || {});
  
  // Filter modules based on selected course
  const availableModules = modules.filter(m => !course || m.courseId === course);
  console.log(modules)

  return (
    <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
      <div className="flex flex-wrap gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaSearch className="text-gray-400" /></div>
          <input type="text" placeholder="Search videos..." value={search} onChange={(e) => setQueryParam("search", e.target.value)} className="w-full bg-gray-800 text-white py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" />
        </div>
        <select value={course} onChange={(e) => setQueryParam("course", e.target.value)} className="w-40 bg-gray-800 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700">
          <option value="">All Courses</option>
          {courses.map((c) => (<option key={c._id} value={c._id}>{c.title}</option>))}
        </select>
        <select value={module} onChange={(e) => setQueryParam("module", e.target.value)} className="w-40 bg-gray-800 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" disabled={!course}>
          <option value="">All Modules</option>
          {availableModules.map((m) => (<option key={m._id} value={m._id}>{m.title}</option>))}
        </select>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={onOpenVideoModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"><FaPlus className="inline mr-2" />Add Video</button>
      </div>
    </div>
  );
};

// --------------------- VIDEO ROW ---------------------
const VideoRow = ({ video, index, page, limit, onEdit, onDelete, onPlay, courses, modules }) => {
  if (!video) return null;
  const serial = (page - 1) * limit + (index + 1);
  const courseTitle = courses.find((c) => c._id === video.courseId)?.title || "—";
  const moduleTitle = modules.find((m) => m._id === video.moduleId)?.title || "—";
  
  return (
    <tr className="hover:bg-gray-800 transition-colors duration-150 border-b border-gray-700">
      <td className="py-4 px-4 text-white">{serial}</td>
      <td className="py-4 px-4 text-white">{new Date(video.createdAt).toLocaleDateString("en-GB")}<br /><span className="text-gray-400 text-xs">{new Date(video.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true })}</span></td>
      <td className="py-4 px-4 text-white"><div className="font-medium">{video.title}</div><div className="text-gray-400 text-sm truncate max-w-xs">{video.videoUrl}</div></td>
      <td className="py-4 px-4 text-white">{courseTitle}</td>
      <td className="py-4 px-4 text-white">{moduleTitle}</td>
      <td className="py-4 px-4">
        <div className="flex space-x-2">
          <button onClick={() => onPlay(video.videoUrl)} className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700" title="Play Video"><FaPlay size={14} /></button>
          <button onClick={() => onEdit(video)} className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700" title="Edit"><FiEdit size={18} /></button>
          <button onClick={() => onDelete(video._id)} className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700" title="Delete"><FiTrash2 size={18} /></button>
        </div>
      </td>
    </tr>
  );
};

// --------------------- PAGINATION ---------------------
const Pagination = ({ currentPage, totalPages, setQueryParam }) => {
  const pages = []; const maxVisible = 5; let start = Math.max(1, currentPage - Math.floor(maxVisible / 2)); let end = Math.min(totalPages, currentPage + Math.floor(maxVisible / 2));
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages) { if (end < totalPages - 1) pages.push("..."); pages.push(totalPages); }
  return (
    <div className="flex justify-center mt-6">
      <nav className="flex items-center space-x-2">
        <button onClick={() => setQueryParam("page", Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-4 py-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
        {pages.map((p, idx) => p === "..." ? (<span key={idx} className="px-4 py-1 text-white">...</span>) : (<button key={idx} onClick={() => setQueryParam("page", p)} className={`px-4 py-1 rounded-md ${currentPage === p ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>{p}</button>))}
        <button onClick={() => setQueryParam("page", Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-4 py-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
      </nav>
    </div>
  );
};

// --------------------- MAIN PAGE ---------------------
const VideoManagementPage = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const search = query.get("search") || "";
  const course = query.get("course") || "";
  const module = query.get("module") || "";
  const currentPage = parseInt(query.get("page") || "1", 10);
  const limit = parseInt(query.get("limit") || "10", 10);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [videoModalMode, setVideoModalMode] = useState("create");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  const { videos = [], loading = false, error = null } = useSelector((state) => state.video || {});
  const { courses = [] } = useSelector((state) => state.course || {});
  const { modules = [] } = useSelector((state) => state.module || {});

  // Fetch videos, courses, and modules
  useEffect(() => {
    dispatch(fetchAllVideos({ courseId: course, moduleId: module }));
  }, [dispatch, course, module]);

  useEffect(() => {
    dispatch(getAllCourses({ page: 1, limit: 100 }));
    dispatch(fetchAllModules()); // Fetch all modules for the filter
  }, [dispatch]);
  
  // NEW: Fetch modules when course changes
  useEffect(() => {
    if (course) {
      dispatch(fetchAllModules({ courseId: course }));
    } else {
      // If no course is selected, fetch all modules
      dispatch(fetchAllModules());
    }
  }, [dispatch, course]);

  const setQueryParam = (key, value) => {
    const newQuery = new URLSearchParams(query.toString());
    if (!value) newQuery.delete(key); else newQuery.set(key, value);
    navigate({ search: newQuery.toString() ? `?${newQuery.toString()}` : "" });
  };

  const handleEditVideo = (video) => { setSelectedVideo(video); setVideoModalMode("update"); setIsVideoModalOpen(true); };
  const handleDeleteVideo = (id) => { if (window.confirm("Are you sure you want to delete this video?")) { dispatch(deleteVideo(id)).unwrap().then(() => dispatch(fetchAllVideos({ courseId: course, moduleId: module }))).catch(err => console.error(err)); } };
  const handlePlayVideo = (videoUrl) => { setCurrentVideoUrl(videoUrl); setIsPlayerModalOpen(true); };
  const handleOpenVideoModal = () => { setVideoModalMode("create"); setSelectedVideo(null); setIsVideoModalOpen(true); };

  // Client-side pagination
  const totalVideos = videos.length;
  const totalPages = Math.ceil(totalVideos / limit);
  const currentVideos = videos.slice((currentPage - 1) * limit, currentPage * limit);

  return (
    <div className="bg-gray-900 min-h-screen shadow-lg p-2">
      <h2 className="text-white text-2xl font-bold mb-2">Video Management</h2>
      <p className="text-gray-400 mb-6">View and manage all course videos</p>

      {error && (<div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-red-100 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">{error}<button onClick={() => dispatch(clearError())} className="ml-4 text-white hover:text-gray-300"><FaTimes /></button></div>)}

      <FilterBar search={search} course={course} module={module} setQueryParam={setQueryParam} onOpenVideoModal={handleOpenVideoModal} />

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-750"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Sl</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Video Info</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Course</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Module</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th></tr></thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {loading ? (Array(10).fill(0).map((_, i) => (<tr key={i} className="animate-pulse"><td className="px-4 py-3"><div className="h-4 w-10 bg-gray-700 rounded"></div></td><td className="px-4 py-3"><div className="h-4 w-24 bg-gray-700 rounded"></div></td><td className="px-4 py-3"><div className="h-4 w-32 bg-gray-700 rounded"></div></td><td className="px-4 py-3"><div className="h-4 w-20 bg-gray-700 rounded"></div></td><td className="px-4 py-3"><div className="h-4 w-20 bg-gray-700 rounded"></div></td><td className="px-4 py-3"><div className="h-8 w-16 bg-gray-700 rounded-lg"></div></td></tr>))) : 
              currentVideos.length > 0 ? (currentVideos.map((video, idx) => (<VideoRow key={video._id || idx} video={video} index={idx} page={currentPage} limit={limit} onEdit={handleEditVideo} onDelete={handleDeleteVideo} onPlay={handlePlayVideo} courses={courses} modules={modules} />))) : 
              (<tr><td colSpan={6} className="py-8 text-center text-gray-400">No videos found.</td></tr>)}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (<Pagination currentPage={currentPage} totalPages={totalPages} setQueryParam={setQueryParam} />)}

      <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} mode={videoModalMode} video={selectedVideo} />
      <VideoPlayerModal isOpen={isPlayerModalOpen} onClose={() => setIsPlayerModalOpen(false)} videoUrl={currentVideoUrl} />
    </div>
  );
};

export default VideoManagementPage;