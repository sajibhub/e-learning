import React, { useEffect, useRef, useState } from "react";

export default function TrustedCompanies() {
  const [isPaused, setIsPaused] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const scrollerRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimestampRef = useRef(0);
  const [logosLoaded, setLogosLoaded] = useState(false);

  const logos = [
    { name: "Microsoft", url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "Amazon", url: "/company/amazon.jpeg" },
    { name: "ClickOne", url: "/company/clickone.jpeg" },
    { name: "Click", url: "/company/click.jpeg" },
    { name: "Netflix", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Apple", url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "Meta", url: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" }
  ];

  // Duplicate logos for continuous scrolling
  const duplicatedLogos = [...logos, ...logos];

  useEffect(() => {
    // Set logos as loaded after component mounts
    setLogosLoaded(true);
  }, []);

  // Animation function using requestAnimationFrame for smooth control
  const animate = (timestamp) => {
    if (!lastTimestampRef.current) {
      lastTimestampRef.current = timestamp;
    }

    const elapsed = timestamp - lastTimestampRef.current;
    lastTimestampRef.current = timestamp;

    if (!isPaused) {
      // Move at a consistent speed (pixels per millisecond)
      const speed = 0.01; // Adjust this value to change speed
      setTranslateX((prevTranslateX) => {
        const newTranslateX = prevTranslateX - speed * elapsed;
        
        // Reset to 0 when we've scrolled through the first set of logos
        if (newTranslateX <= -50) {
          return 0;
        }
        
        return newTranslateX;
      });
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    // Reset timestamp to avoid a jump when resuming
    lastTimestampRef.current = 0;
  };

  return (
    <div className="relative overflow-hidden py-12 md:py-16 bg-gradient-to-r from-gray-50 to-gray-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Leading Companies</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Join thousands of companies that trust our platform for their business needs
          </p>
        </div>

        {/* Logo Slider Container */}
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-gray-100 to-transparent z-10"></div>

          {/* Scrolling Logos */}
          <div className="overflow-hidden">
            <div 
              ref={scrollerRef}
              className="flex gap-8 md:gap-16"
              style={{
                transform: `translateX(${translateX}%)`,
                width: 'fit-content'
              }}
            >
              {duplicatedLogos.map((logo, index) => (
                <div 
                  key={`${logo.name}-${index}`} 
                  className="flex-shrink-0 flex items-center justify-center h-16 md:h-20 transition-all duration-300 hover:scale-110"
                >
                  <div className="relative group">
                    <img
                      src={logo.url}
                      alt={logo.name}
                      className={`h-12 md:h-16 w-auto object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 ${logosLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => setLogosLoaded(true)}
                    />
                    <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Content */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center p-1 bg-white rounded-full shadow-md">
            <div className="flex items-center space-x-1 px-4 py-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Trusted by industry leaders worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}