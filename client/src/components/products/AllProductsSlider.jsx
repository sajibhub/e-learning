// src/components/products/AllProductsSlider.jsx
import { useRef, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { FaChevronLeft, FaChevronRight, FaShoppingBag, FaBox } from "react-icons/fa";

const AllProductsSlider = ({ products, title = "All Products", showViewAll = true }) => {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  // Check if we can scroll left or right
  const checkScrollPosition = () => {
    if (!sliderRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
  };

  // Check scroll position on mount and when products change
  useEffect(() => {
    checkScrollPosition();
    window.addEventListener("resize", checkScrollPosition);
    return () => window.removeEventListener("resize", checkScrollPosition);
  }, [products]);

  // Scroll functions
  const scrollLeftHandler = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
    setTimeout(checkScrollPosition, 300); // Check after scroll animation completes
  };

  const scrollRightHandler = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
    setTimeout(checkScrollPosition, 300); // Check after scroll animation completes
  };

  // Touch/drag handlers for mobile
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftPos(sliderRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    sliderRef.current.scrollLeft = scrollLeftPos - walk;
  };

  // Handle scroll events to update button states
  const handleScroll = () => {
    checkScrollPosition();
  };

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="my-10 px-4">
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaBox className="text-gray-400 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No products available</h3>
          <p className="text-gray-500">Check back later for new products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative my-10 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FaShoppingBag className="text-blue-600 text-xl" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
        </div>
        {showViewAll && (
          <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Slider container */}
      <div className="relative">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-6 scrollbar-hide scroll-smooth py-2"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <div 
              key={product._id} 
              className="shrink-0 w-72 md:w-80 lg:w-96 transform transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={scrollLeftHandler}
          className={`absolute top-1/2 left-0 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 z-10 ${
            canScrollLeft ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          aria-label="Previous products"
        >
          <FaChevronLeft />
        </button>

        <button
          onClick={scrollRightHandler}
          className={`absolute top-1/2 right-0 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 z-10 ${
            canScrollRight ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          aria-label="Next products"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Scroll Indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: Math.min(5, products.length) }).map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === 0 ? "w-8 bg-blue-600" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AllProductsSlider;