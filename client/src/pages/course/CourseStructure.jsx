import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCourseStructureApi } from "../../api/course.api";
import { 
  FaPlay, 
  FaCheckCircle, 
  FaLock, 
  FaSpinner, 
  FaExclamationTriangle,
  FaBook,
  FaVideo,
  FaExpand,
  FaCompress,
  FaList,
  FaTh,
  FaShoppingCart,
  FaEyeSlash
} from "react-icons/fa";

// Skeleton Loading Component
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

// Video Skeleton Component
const VideoSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg w-full h-64 md:h-96"></div>
    <div className="mt-4 h-6 bg-gray-200 rounded w-3/4"></div>
    <div className="mt-2 h-4 bg-gray-200 rounded w-full"></div>
    <div className="mt-2 h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

const CourseStructure = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [fullscreen, setFullscreen] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [isSubscription, setIsSubscription] = useState(false);

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getCourseStructureApi(courseId);
        
        if (res.data && res.data.data) {
          setModules(res.data.data);
          setIsSubscription(res.data.isSubscription || false);
          
          // Set the first video as active if available and user has subscription
          if (res.data.isSubscription && res.data.data.length > 0 && res.data.data[0].videos.length > 0) {
            setActiveVideo(res.data.data[0].videos[0]);
          }
          
          // Initialize all modules as collapsed (false)
          const initialExpandedState = {};
          res.data.data.forEach(module => {
            initialExpandedState[module._id] = false;
          });
          setExpandedModules(initialExpandedState);
        } else {
          setError("No course content available");
        }
      } catch (err) {
        console.error("Error fetching course structure:", err);
        setError(err.response?.data?.message || "Failed to load course content");
      } finally {
        setLoading(false);
      }
    };

    fetchStructure();
  }, [courseId]);

  // Memoize the YouTube embed URL transformation
  const getEmbedUrl = useMemo(() => {
    return (url) => {
      if (!url) return "";
      
      // Handle different YouTube URL formats
      if (url.includes("youtube.com/watch")) {
        return url.replace("watch?v=", "embed/");
      } else if (url.includes("youtu.be/")) {
        return url.replace("youtu.be/", "youtube.com/embed/");
      } else if (url.includes("youtube.com/embed/")) {
        return url; // Already in embed format
      }
      
      // Return as is if it's not a YouTube URL
      return url;
    };
  }, []);

  const handleVideoSelect = (video) => {
    if (!isSubscription) return; // Prevent video selection if not subscribed
    
    setActiveVideo(video);
    setVideoLoading(true);
    // Reset video loading state after a short delay
    setTimeout(() => setVideoLoading(false), 1000);
  };

  const markVideoAsCompleted = (videoId) => {
    if (!isSubscription) return; // Prevent marking as completed if not subscribed
    
    if (!completedVideos.includes(videoId)) {
      setCompletedVideos([...completedVideos, videoId]);
    }
  };

  const toggleModuleExpansion = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleBuyCourse = () => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 p-4">
        {/* Video Player Skeleton */}
        <div className="w-full lg:w-2/3">
          <VideoSkeleton />
        </div>
        
        {/* Course Content Skeleton */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-lg p-6">
          <h2 className="font-bold text-xl mb-4">Course Content</h2>
          <div className="space-y-4">
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center max-w-2xl mx-auto mt-10">
        <FaExclamationTriangle className="text-2xl mr-4" />
        <div>
          <p className="font-bold text-lg">Error loading course</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="text-center py-16">
        <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-xl mb-6">No course content available</p>
        <Link to="/courses" className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">
          Browse Other Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* LEFT: VIDEO PLAYER */}
      <div className={`w-full ${fullscreen ? 'lg:w-full' : 'lg:w-2/3'} bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300`}>
        {isSubscription && activeVideo ? (
          <>
            <div className="relative bg-black">
              <div className="relative w-full pb-[56.25%]">
                {videoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                    <FaSpinner className="animate-spin text-4xl text-blue-500" />
                  </div>
                )}
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={getEmbedUrl(activeVideo.videoUrl)}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setVideoLoading(false)}
                />
              </div>
              
              {/* Fullscreen Toggle */}
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
                title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {fullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  {activeVideo.title}
                </h2>
                <button
                  onClick={() => markVideoAsCompleted(activeVideo._id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    completedVideos.includes(activeVideo._id)
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {completedVideos.includes(activeVideo._id) ? (
                    <span className="flex items-center">
                      <FaCheckCircle className="mr-2" /> Completed
                    </span>
                  ) : (
                    "Mark as Complete"
                  )}
                </button>
              </div>
              
              {activeVideo.description && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-700">Description</h3>
                  <p className="text-gray-600">{activeVideo.description}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-20">
            {isSubscription ? (
              <>
                <FaVideo className="text-6xl mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Select a video to start learning 🎓</p>
              </>
            ) : (
              <>
                <div className="max-w-md mx-auto">
                  <FaLock className="text-6xl mx-auto mb-4 text-gray-300" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">This Course is Locked</h2>
                  <p className="text-gray-600 mb-6">Purchase this course to access all videos and materials</p>
                  <button
                    onClick={handleBuyCourse}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                  >
                    <FaShoppingCart className="mr-2" />
                    Buy This Course
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: COURSE CONTENT */}
      <div className={`w-full ${fullscreen ? 'lg:w-0 lg:overflow-hidden' : 'lg:w-1/3'} bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300`}>
        {/* Course Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <h2 className="font-bold text-xl mb-2">Course Content</h2>
          
          {/* View Mode Toggle */}
          <div className="flex justify-end">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white bg-opacity-20' : ''}`}
              title="List View"
            >
              <FaList />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ml-2 ${viewMode === 'grid' ? 'bg-white bg-opacity-20' : ''}`}
              title="Grid View"
            >
              <FaTh />
            </button>
          </div>
        </div>
        
        {/* Course Modules */}
        <div className="p-6 max-h-[600px] overflow-y-auto">
          {!isSubscription && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
              <div className="flex items-center">
                <FaEyeSlash className="mr-2" />
                <span>Purchase this course to unlock all content</span>
              </div>
            </div>
          )}
          
          {modules.map((module, moduleIndex) => (
            <div key={module._id} className="mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleModuleExpansion(module._id)}
              >
                <h3 className="font-semibold text-blue-600 flex items-center">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                    {moduleIndex + 1}
                  </span>
                  {module.title}
                </h3>
                <span className="text-gray-400 text-sm">
                  {expandedModules[module._id] ? '−' : '+'}
                </span>
              </div>
              
              {expandedModules[module._id] && (
                <ul className={`mt-3 space-y-2 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-2' : ''}`}>
                  {module.videos.map((video, videoIndex) => {
                    const isCompleted = completedVideos.includes(video._id);
                    const isActive = activeVideo?._id === video._id;
                    
                    return (
                      <li
                        key={video._id}
                        onClick={() => handleVideoSelect(video)}
                        className={`cursor-pointer p-3 rounded-lg flex items-center transition-all ${
                          !isSubscription
                            ? "opacity-60"
                            : isActive 
                              ? "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600" 
                              : "hover:bg-gray-100 border-l-4 border-transparent"
                        }`}
                      >
                        <span className="mr-3">
                          {!isSubscription ? (
                            <FaLock className="text-gray-400" />
                          ) : isCompleted ? (
                            <FaCheckCircle className="text-green-500" />
                          ) : (
                            <FaPlay className="text-gray-400" />
                          )}
                        </span>
                        <span className="flex-1 text-sm">
                          {videoIndex + 1}. {video.title}
                        </span>
                        {video.isLocked && <FaLock className="text-gray-400 ml-2" />}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
          
          {!isSubscription && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleBuyCourse}
                className="flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                <FaShoppingCart className="mr-2" />
                Buy Course to Unlock
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseStructure;