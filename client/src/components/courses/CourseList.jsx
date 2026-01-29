import { useRef, useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import { FaChevronLeft, FaChevronRight, FaBookOpen } from "react-icons/fa";

const CourseListSlider = ({ courses, title = "Courses" }) => {
  const [sliderStates, setSliderStates] = useState({});
  const groupedCourses = courses.reduce((acc, course) => {
    const category = course.category?.name || "Other";
    if (!acc[category]) acc[category] = { courses: [], ref: useRef(null) };
    acc[category].courses.push(course);
    return acc;
  }, {});

  // Initialize slider states
  useEffect(() => {
    const initialStates = {};
    Object.keys(groupedCourses).forEach((category) => {
      initialStates[category] = {
        canScrollLeft: false,
        canScrollRight: true,
      };
    });
    setSliderStates(initialStates);
  }, [courses]);

  // Check if we can scroll left or right for a specific category
  const checkScrollPosition = (category) => {
    const slider = groupedCourses[category].ref.current;
    if (!slider) return;

    const { scrollLeft, scrollWidth, clientWidth } = slider;
    setSliderStates((prev) => ({
      ...prev,
      [category]: {
        canScrollLeft: scrollLeft > 0,
        canScrollRight: scrollLeft < scrollWidth - clientWidth,
      },
    }));
  };

  // Scroll functions for a specific category
  const scrollLeft = (category) => {
    const slider = groupedCourses[category].ref.current;
    if (!slider) return;
    
    slider.scrollBy({
      left: -320,
      behavior: "smooth",
    });
    
    // Check scroll position after animation
    setTimeout(() => checkScrollPosition(category), 300);
  };

  const scrollRight = (category) => {
    const slider = groupedCourses[category].ref.current;
    if (!slider) return;
    
    slider.scrollBy({
      left: 320,
      behavior: "smooth",
    });
    
    // Check scroll position after animation
    setTimeout(() => checkScrollPosition(category), 300);
  };

  // Handle scroll events to update button states
  const handleScroll = (category) => {
    checkScrollPosition(category);
  };

  if (!courses || courses.length === 0) {
    return (
      <div className="my-10 px-4">
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaBookOpen className="text-gray-400 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses available</h3>
          <p className="text-gray-500">Check back later for new courses</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 my-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-2"></div>
      </div>

      {Object.keys(groupedCourses).map((category, categoryIndex) => (
        <div 
          key={category} 
          className="relative px-4 animate-fade-in" 
          style={{ animationDelay: `${categoryIndex * 0.1}s` }}
        >
          {/* Category Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">{category}</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {groupedCourses[category].courses.length} courses
            </span>
          </div>

          {/* Slider Container */}
          <div className="relative">
            <div
              ref={groupedCourses[category].ref}
              className="flex overflow-x-auto gap-6 scrollbar-hide scroll-smooth py-2"
              onScroll={() => handleScroll(category)}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {groupedCourses[category].courses.map((course, courseIndex) => (
                <div
                  key={course._id}
                  className="flex-shrink-0 w-72 md:w-80 lg:w-96 transform transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${(categoryIndex * 0.1) + (courseIndex * 0.05)}s` }}
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() => scrollLeft(category)}
              className={`absolute top-1/2 left-0 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 z-10 ${
                sliderStates[category]?.canScrollLeft ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
              aria-label={`Previous ${category} courses`}
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={() => scrollRight(category)}
              className={`absolute top-1/2 right-0 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 z-10 ${
                sliderStates[category]?.canScrollRight ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
              aria-label={`Next ${category} courses`}
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Scroll Indicators */}
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: Math.min(5, groupedCourses[category].courses.length) }).map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === 0 ? "w-8 bg-blue-600" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CourseListSlider;