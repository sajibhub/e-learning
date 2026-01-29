import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCourseByIdApi } from "../api/course.api";
import PaymentModal from "../components/payment/PaymentModal";
import { FaClock, FaTag, FaCalendar, FaStar, FaRegStar, FaUsers, FaCheckCircle, FaPlay } from "react-icons/fa";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseByIdApi(id);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-xl mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course || !course.course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Link to="/courses" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  const isEnrolled = false; // later from backend
  const courseData = course.course;
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm text-gray-500">
          <Link to="/courses" className="hover:text-blue-600">Courses</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{courseData.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Image */}
            <div className="relative rounded-xl overflow-hidden mb-6 group">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              )}
              <img
                src={courseData.image}
                alt={courseData.title}
                className={`w-full h-96 object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://picsum.photos/seed/course/800/400.jpg";
                }}
              />
              
            </div>

            {/* Course Title and Info */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{courseData.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
              
              <div className="flex items-center gap-1">
                <FaTag />
                <span>{courseData.category.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaCalendar />
                <span>Updated {formatDate(courseData.updatedAt)}</span>
              </div>
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {courseData.courseDetails}
                </p>
              </div>
            </div>

            
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="text-3xl font-bold text-blue-600 mb-4">
                ৳ {courseData.coursePrice}
              </div>
              
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Buy Now
                </button>
                
               
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-800 mb-4">This Course Includes</h3>
                <ul className="space-y-2">
                  {[
                    { icon: <FaClock />, text: "Lifetime access" },
                    { icon: <FaUsers />, text: "Access to student community" },
                    { icon: <FaCheckCircle />, text: "Certificate of completion" }
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700">
                      <span className="text-blue-600">{item.icon}</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          productId={id}
          productType="course"
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default CourseDetails;