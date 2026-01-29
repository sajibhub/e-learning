import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause } from "react-icons/fa";

const images = [
  {
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    title: "Mountain Adventure",
    description: "Explore the breathtaking mountain ranges"
  },
  {
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    title: "Ocean Paradise",
    description: "Discover the beauty of pristine beaches"
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    title: "Desert Safari",
    description: "Experience the magic of golden sand dunes"
  }
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(
    new Array(images.length).fill(false)
  );
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  // Navigation functions
  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  // Auto slide functionality
  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Toggle auto-play
  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      startAutoSlide();
    } else {
      stopAutoSlide();
    }
  };

  // Touch/swipe handlers for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartPos(e.touches[0].clientX);
    stopAutoSlide();
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentPosition = e.touches[0].clientX;
    const diff = startPos - currentPosition;
    setTranslateX(-diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Determine swipe direction
    if (translateX > 50) {
      nextSlide();
    } else if (translateX < -50) {
      prevSlide();
    }
    
    setTranslateX(0);
    if (isPlaying) startAutoSlide();
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos(e.clientX);
    stopAutoSlide();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentPosition = e.clientX;
    const diff = startPos - currentPosition;
    setTranslateX(-diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Determine swipe direction
    if (translateX > 50) {
      nextSlide();
    } else if (translateX < -50) {
      prevSlide();
    }
    
    setTranslateX(0);
    if (isPlaying) startAutoSlide();
  };

  // Handle image load
  const handleImageLoad = (index) => {
    setImagesLoaded((prev) => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  // Start auto-slide on mount
  useEffect(() => {
    if (isPlaying) {
      startAutoSlide();
    }
    return () => stopAutoSlide();
  }, [isPlaying]);

  // Pause on hover
  const handleMouseEnter = () => {
    if (isPlaying) stopAutoSlide();
  };

  const handleMouseLeave = () => {
    if (isPlaying) startAutoSlide();
  };

  return (
    <div className="w-full  mx-auto my-8 md:my-12 px-4">
      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl group"
        ref={sliderRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Images Container */}
        <div
          className="flex transition-transform duration-500 ease-out h-64 sm:h-80 md:h-96 lg:h-[500px]"
          style={{
            transform: `translateX(calc(-${current * 100}% + ${translateX}px))`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {images.map((img, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              {!imagesLoaded[index] && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              )}
              <img
                src={img.url}
                alt={img.title}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imagesLoaded[index] ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => handleImageLoad(index)}
              />
              {/* Overlay with text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8 text-white">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                  {img.title}
                </h3>
                <p className="text-sm sm:text-base opacity-90 max-w-lg">
                  {img.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Next slide"
        >
          <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={toggleAutoPlay}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/80 backdrop-blur-sm text-gray-800 p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50 z-10"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <FaPause className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <FaPlay className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                current === index
                  ? "bg-white w-6 sm:w-8"
                  : "bg-white/50 hover:bg-white/70 w-2 sm:w-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}