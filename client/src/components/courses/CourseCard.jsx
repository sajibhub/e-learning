import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCardClick = () => {
    navigate(`/courses/${course._id}`);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        <img
          src={course.image}
          alt={course.title}
          className={`w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://picsum.photos/seed/course/400/300.jpg";
          }}
        />
      
      </div>

      {/* Course Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.courseDetails?.substring(0, 80)}...
        </p>
        
        {/* Price Section */}
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-blue-600">৳ {course.coursePrice}</p>
          {course.originalPrice && (
            <p className="text-sm text-gray-400 line-through">৳ {course.originalPrice}</p>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default CourseCard;