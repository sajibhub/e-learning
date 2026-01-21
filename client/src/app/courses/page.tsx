"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";

// TypeScript interfaces
interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  image: string;
  level: string;
  duration: string;
  lessons: number;
  students: number;
  category: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  tags: string[];
  lastUpdated: string;
  language: string;
  subtitle: string;
}

// Extended mock course data
const courseData: Course[] = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp 2023",
    description: "Learn web development with HTML, CSS, JS, React, Node, and more in this comprehensive course.",
    instructor: "Dr. Angela Yu",
    instructorAvatar: "/instructor1.jpg",
    rating: 4.7,
    reviews: 13245,
    price: 89.99,
    originalPrice: 199.99,
    image: "/course1.jpg",
    level: "Beginner",
    duration: "65.5 hours",
    lessons: 614,
    students: 324567,
    category: "Development",
    isBestSeller: true,
    tags: ["Web Dev", "JavaScript", "React"],
    lastUpdated: "11/2023",
    language: "English",
    subtitle: "English"
  },
  {
    id: 2,
    title: "The Complete JavaScript Course 2023: From Zero to Expert!",
    description: "The modern JavaScript course for everyone! Master JavaScript with projects, challenges and theory.",
    instructor: "Jonas Schmedtmann",
    instructorAvatar: "/instructor2.jpg",
    rating: 4.8,
    reviews: 25678,
    price: 84.99,
    originalPrice: 189.99,
    image: "/course2.jpg",
    level: "All Levels",
    duration: "68 hours",
    lessons: 534,
    students: 287456,
    category: "Development",
    isBestSeller: true,
    tags: ["JavaScript", "Programming"],
    lastUpdated: "10/2023",
    language: "English",
    subtitle: "English"
  },
  {
    id: 3,
    title: "Python for Data Science and Machine Learning Bootcamp",
    description: "Learn how to use NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, and more!",
    instructor: "Jose Portilla",
    instructorAvatar: "/instructor3.jpg",
    rating: 4.6,
    reviews: 18934,
    price: 94.99,
    originalPrice: 199.99,
    image: "/course3.jpg",
    level: "Beginner",
    duration: "25 hours",
    lessons: 165,
    students: 412789,
    category: "Data Science",
    isBestSeller: true,
    tags: ["Python", "Data Science", "Machine Learning"],
    lastUpdated: "9/2023",
    language: "English",
    subtitle: "English"
  },
  {
    id: 4,
    title: "AWS Certified Solutions Architect - Associate 2023",
    description: "Pass the AWS Certified Solutions Architect - Associate SAA-C03 Exam with this hands-on course!",
    instructor: "Stephane Maarek",
    instructorAvatar: "/instructor4.jpg",
    rating: 4.7,
    reviews: 21567,
    price: 89.99,
    originalPrice: 199.99,
    image: "/course4.jpg",
    level: "Intermediate",
    duration: "30 hours",
    lessons: 384,
    students: 523456,
    category: "IT & Software",
    isBestSeller: true,
    tags: ["AWS", "Cloud Computing"],
    lastUpdated: "11/2023",
    language: "English",
    subtitle: "English"
  },
  {
    id: 5,
    title: "UI/UX Design Bootcamp: Sketch, Figma, Adobe XD, UI/UX",
    description: "Become a UX/UI designer with hands-on training and portfolio projects.",
    instructor: "Daniel Scott",
    instructorAvatar: "/instructor5.jpg",
    rating: 4.5,
    reviews: 9876,
    price: 84.99,
    originalPrice: 189.99,
    image: "/course5.jpg",
    level: "Beginner",
    duration: "28 hours",
    lessons: 265,
    students: 198765,
    category: "Design",
    isNew: true,
    tags: ["UI/UX", "Design", "Figma"],
    lastUpdated: "11/2023",
    language: "English",
    subtitle: "English"
  },
  {
    id: 6,
    title: "React - The Complete Guide (incl. Hooks, Redux, Next.js)",
    description: "Dive in and learn React.js from scratch! Learn React, Redux, React Router, and more.",
    instructor: "Maximilian Schwarzmüller",
    instructorAvatar: "/instructor6.jpg",
    rating: 4.7,
    reviews: 22345,
    price: 89.99,
    originalPrice: 199.99,
    image: "/course6.jpg",
    level: "Intermediate",
    duration: "48.5 hours",
    lessons: 507,
    students: 432109,
    category: "Development",
    isBestSeller: true,
    tags: ["React", "JavaScript", "Frontend"],
    lastUpdated: "10/2023",
    language: "English",
    subtitle: "English"
  },
  {
    id: 7,
    title: "Digital Marketing Masterclass",
    description: "23 Marketing Courses in 1. Complete Digital Marketing: SEO, Social Media, and more.",
    instructor: "Phil Ebiner",
    instructorAvatar: "/instructor7.jpg",
    rating: 4.4,
    reviews: 7654,
    price: 74.99,
    originalPrice: 174.99,
    image: "/course7.jpg",
    level: "Beginner",
    duration: "23.5 hours",
    lessons: 156,
    students: 145678,
    category: "Marketing",
    tags: ["Marketing", "SEO", "Social Media"],
    lastUpdated: "9/2023",
    language: "English",
    subtitle: "English"
  },
  {
    id: 8,
    title: "Microsoft Excel - Excel from Beginner to Advanced",
    description: "Master Excel with this A-Z Microsoft Excel Course. Excel 2013, Excel 2016, Excel 2019",
    instructor: "Kyle Pew",
    instructorAvatar: "/instructor8.jpg",
    rating: 4.6,
    reviews: 14567,
    price: 54.99,
    originalPrice: 154.99,
    image: "/course8.jpg",
    level: "All Levels",
    duration: "15 hours",
    lessons: 128,
    students: 278901,
    category: "Office Productivity",
    tags: ["Excel", "Microsoft Office", "Data Analysis"],
    lastUpdated: "8/2023",
    language: "English",
    subtitle: "English"
  },
  {
    id: 9,
    title: "The Complete Financial Analyst Course 2023",
    description: "Excel, Accounting, Financial Statement Analysis, Financial Math, Finance: Complete Training",
    instructor: "365 Careers",
    instructorAvatar: "/instructor9.jpg",
    rating: 4.5,
    reviews: 11234,
    price: 94.99,
    originalPrice: 194.99,
    image: "/course9.jpg",
    level: "Beginner",
    duration: "17 hours",
    lessons: 156,
    students: 187654,
    category: "Finance",
    tags: ["Finance", "Accounting", "Excel"],
    lastUpdated: "10/2023",
    language: "English",
    subtitle: "English"
  },
  {
    id: 10,
    title: "iOS & Swift - The Complete iOS App Development Bootcamp",
    description: "From Beginner to iOS App Developer with Just One Course! Fully Updated with a Comprehensive Module Dedicated to SwiftUI.",
    instructor: "Angela Yu",
    instructorAvatar: "/instructor1.jpg",
    rating: 4.8,
    reviews: 28976,
    price: 94.99,
    originalPrice: 199.99,
    image: "/course10.jpg",
    level: "Beginner",
    duration: "59.5 hours",
    lessons: 500,
    students: 398765,
    category: "Development",
    isBestSeller: true,
    tags: ["iOS", "Swift", "Mobile Dev"],
    lastUpdated: "11/2023",
    language: "English",
    subtitle: "English"
  },
  {
    id: 11,
    title: "Graphic Design Masterclass - Learn GREAT Design",
    description: "Learn Graphic Design using Adobe Illustrator, Photoshop, InDesign, and many more software programs!",
    instructor: "Derrick Mitchell",
    instructorAvatar: "/instructor11.jpg",
    rating: 4.6,
    reviews: 8765,
    price: 84.99,
    originalPrice: 189.99,
    image: "/course11.jpg",
    level: "All Levels",
    duration: "25.5 hours",
    lessons: 189,
    students: 123456,
    category: "Design",
    tags: ["Graphic Design", "Adobe", "Illustrator"],
    lastUpdated: "9/2023",
    language: "English",
    subtitle: "English"
  },
  {
    id: 12,
    title: "The Complete SQL Bootcamp: Go from Zero to Hero",
    description: "Learn how to use SQL quickly and effectively with this course! You'll learn how to read and write complex queries.",
    instructor: "Jose Portilla",
    instructorAvatar: "/instructor3.jpg",
    rating: 4.7,
    reviews: 19876,
    price: 84.99,
    originalPrice: 189.99,
    image: "/course12.jpg",
    level: "Beginner",
    duration: "8 hours",
    lessons: 84,
    students: 234567,
    category: "Development",
    isBestSeller: true,
    tags: ["SQL", "Database", "Analytics"],
    lastUpdated: "10/2023",
    language: "English",
    subtitle: "English"
  }
];

// Star rating component
const StarRating = ({ rating, size = "text-sm" }: { rating: number; size?: string }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex">
      {Array(fullStars).fill(0).map((_, i) => (
        <Icon key={`full-${i}`} icon="tabler:star-filled" className={`text-yellow-500 ${size}`} />
      ))}
      {hasHalfStar && <Icon icon="tabler:star-half-filled" className={`text-yellow-500 ${size}`} />}
      {Array(emptyStars).fill(0).map((_, i) => (
        <Icon key={`empty-${i}`} icon="tabler:star-filled" className={`text-gray-300 ${size}`} />
      ))}
    </div>
  );
};

// Skeleton component for course cards
const CourseSkeleton = () => (
  <div className='bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse'>
    <div className="h-56 bg-gray-300"></div>
    <div className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-20 bg-gray-300 rounded"></div>
        <div className="h-5 w-16 bg-gray-300 rounded"></div>
      </div>
      <div className="h-6 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-3"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-4 w-4 bg-gray-300 rounded"></div>
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
        <div className="h-4 w-20 bg-gray-300 rounded"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-6 w-12 bg-gray-300 rounded"></div>
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
        </div>
        <div className="h-6 w-16 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
);

// Course card component
const CourseCard = ({ course }: { course: Course }) => (
  <div className='bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group'>
    <div className="relative overflow-hidden h-56">
      <Image 
        src={course.image} 
        alt={course.title} 
        width={400} 
        height={250} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      {course.isBestSeller && (
        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          Bestseller
        </div>
      )}
      {course.isNew && (
        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          New
        </div>
      )}
    </div>
    <div className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{course.category}</span>
        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{course.level}</span>
      </div>
      <Link href={`/courses/${course.id}`} className='text-xl font-bold text-gray-900 inline-block hover:text-blue-600 transition-colors mb-2 line-clamp-2 group-hover:text-blue-600'>
        {course.title}
      </Link>
      <p className='text-sm text-gray-600 mb-3 line-clamp-2'>{course.description}</p>
      <p className='text-sm font-medium text-gray-700 mb-4 flex items-center gap-2'>
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        {course.instructor}
      </p>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-gray-900">{course.rating}</span>
          <StarRating rating={course.rating} size="text-sm" />
        </div>
        <span className="text-sm text-gray-500">({course.reviews.toLocaleString()})</span>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          {course.originalPrice && (
            <span className="text-gray-400 line-through text-sm mr-2">${course.originalPrice}</span>
          )}
          <span className="text-2xl font-bold text-gray-900">${course.price}</span>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105">
          Enroll Now
        </button>
      </div>
      
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Icon icon="solar:clock-circle-outline" className="text-gray-400" />
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon icon="solar:notebook-minimalistic-outline" className="text-gray-400" />
          <span>{course.lessons} lessons</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon icon="solar:users-group-rounded-linear" className="text-gray-400" />
          <span>{(course.students / 1000).toFixed(0)}k</span>
        </div>
      </div>
    </div>
  </div>
);

// Main component
const CoursesPage = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("mostPopular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSearch, setShowSearch] = useState(false);
  
  const coursesPerPage = 12;
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setCourses(courseData);
      setFilteredCourses(courseData);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);
  
  // Filter and sort courses
  useEffect(() => {
    let filtered = courses;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Sort
    switch (sortBy) {
      case "mostPopular":
        filtered.sort((a, b) => b.students - a.students);
        break;
      case "highestRated":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => {
          const aDate = new Date(a.lastUpdated);
          const bDate = new Date(b.lastUpdated);
          return bDate.getTime() - aDate.getTime();
        });
        break;
      case "priceLowToHigh":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceHighToLow":
        filtered.sort((a, b) => b.price - a.price);
        break;
    }
    
    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [courses, searchTerm, sortBy]);
  
  // Get current courses for pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  
  // Handle pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-6 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Discover Your Perfect Course
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Explore {courseData.length}+ courses from expert instructors and advance your career
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for courses, topics, or instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                  className="w-full px-6 py-4 pr-12 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all duration-300 shadow-lg"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Icon icon="solar:close-circle-bold" className="text-gray-400 text-xl" />
                    </button>
                  )}
                  <Icon icon="solar:magnifer-bold" className="text-blue-600 text-2xl" />
                </div>
              </div>
              
              {/* Search Suggestions Dropdown */}
              {showSearch && searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl p-4 z-10">
                  <p className="text-sm text-gray-500 mb-3">Suggestions:</p>
                  <div className="space-y-2">
                    {courses
                      .filter(course => 
                        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        course.category.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .slice(0, 3)
                      .map(course => (
                        <button
                          key={course.id}
                          onClick={() => setSearchTerm(course.title)}
                          className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <p className="font-medium text-gray-900">{course.title}</p>
                          <p className="text-sm text-gray-500">{course.category}</p>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="flex justify-center gap-12 mt-12">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{courseData.length}+</p>
                <p className="text-gray-600">Courses</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">50+</p>
                <p className="text-gray-600">Instructors</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">100k+</p>
                <p className="text-gray-600">Students</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Results */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {searchTerm ? `Search Results for "${searchTerm}"` : "All Courses"}
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                >
                  <Icon icon="solar:grid-2" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                >
                  <Icon icon="solar:list" />
                </button>
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mostPopular">Most Popular</option>
                  <option value="highestRated">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <Icon icon="solar:alt-arrow-down" className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Courses Grid/List */}
          {loading ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "space-y-4"}>
              {Array(8).fill(0).map((_, i) => (
                <CourseSkeleton key={i} />
              ))}
            </div>
          ) : currentCourses.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "space-y-4"}>
              {currentCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Icon icon="solar:confounded-square-bold" className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-medium text-gray-700 mb-2">No courses found</h3>
              <p className="text-gray-500 mb-6">Try searching with different keywords</p>
              <button 
                onClick={clearSearch}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
              >
                Clear Search
              </button>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-3 rounded-xl ${currentPage === 1 ? "text-gray-300 cursor-not-allowed bg-gray-100" : "text-gray-700 hover:bg-gray-100 bg-white shadow-sm"}`}
                >
                  <Icon icon="solar:alt-arrow-left" className="text-xl" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${currentPage === page ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-gray-700 hover:bg-gray-100 bg-white shadow-sm"}`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-3 rounded-xl ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed bg-gray-100" : "text-gray-700 hover:bg-gray-100 bg-white shadow-sm"}`}
                >
                  <Icon icon="solar:alt-arrow-right" className="text-xl" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of students who are already learning with us</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105">
              Browse All Courses
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-bold transition-all duration-300">
              Become an Instructor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;