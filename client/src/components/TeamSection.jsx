import React, { useState } from "react";
import { FaLinkedin, FaTwitter, FaEnvelope, FaGlobe, FaQuoteLeft } from "react-icons/fa";

const members = [
  {
    id: 1,
    name: "Shoo Thar Mien",
    role: "Senior UX Designer",
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400&auto=format&fit=crop",
    linkedin: "#",
    twitter: "#",
    email: "shoo@example.com",
    bio: "With over 10 years of experience in UX design, I bring a user-centered approach to every project."
  },
  {
    id: 2,
    name: "Alexandra Chen",
    role: "Lead Developer",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    linkedin: "#",
    twitter: "#",
    email: "alex@example.com",
    bio: "Full-stack developer passionate about creating scalable and efficient web applications."
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Product Manager",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=400&auto=format&fit=crop",
    linkedin: "#",
    twitter: "#",
    email: "michael@example.com",
    bio: "Strategic thinker with a track record of launching successful products in competitive markets."
  },
  {
    id: 4,
    name: "Sarah Johnson",
    role: "Marketing Director",
    image: "https://images.unsplash.com/photo-1494790108755-2616b332c1ca?q=80&w=400&auto=format&fit=crop",
    linkedin: "#",
    twitter: "#",
    email: "sarah@example.com",
    bio: "Creative marketing professional with expertise in digital strategy and brand development."
  },
  {
    id: 5,
    name: "David Kim",
    role: "Data Scientist",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    linkedin: "#",
    twitter: "#",
    email: "david@example.com",
    bio: "Data scientist specializing in machine learning and predictive analytics."
  },
  {
    id: 6,
    name: "Emily Watson",
    role: "UI Designer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
    linkedin: "#",
    twitter: "#",
    email: "emily@example.com",
    bio: "UI designer focused on creating beautiful and intuitive user interfaces."
  },
  {
    id: 7,
    name: "James Wilson",
    role: "Backend Engineer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    linkedin: "#",
    twitter: "#",
    email: "james@example.com",
    bio: "Backend engineer with expertise in cloud architecture and microservices."
  },
  {
    id: 8,
    name: "Lisa Anderson",
    role: "Content Strategist",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=400&auto=format&fit=crop",
    linkedin: "#",
    twitter: "#",
    email: "lisa@example.com",
    bio: "Content strategist helping brands tell their stories in compelling ways."
  }
];

export default function TeamSection() {
  const [showAll, setShowAll] = useState(false);
  const [activeMember, setActiveMember] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(
    new Array(members.length).fill(false)
  );

  const displayMembers = showAll ? members : members.slice(0, 4);

  const handleImageLoad = (index) => {
    setImageLoaded((prev) => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  return (
    <section className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 md:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Mentors</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Our team of experienced professionals is dedicated to helping you achieve your goals and reach your full potential.
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {displayMembers.map((member, index) => (
            <div
              key={member.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              onMouseEnter={() => setActiveMember(member.id)}
              onMouseLeave={() => setActiveMember(null)}
            >
              {/* Member Card */}
              <div className="p-4 md:p-6">
                {/* Avatar Container */}
                <div className="relative mx-auto w-28 h-28 md:w-32 md:h-32 mb-4 md:mb-6">
                  {!imageLoaded[index] && (
                    <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"></div>
                  )}
                  <img
                    src={member.image}
                    alt={member.name}
                    className={`w-full h-full rounded-full object-cover border-4 border-white shadow-lg transition-all duration-500 ${
                      imageLoaded[index] ? "opacity-100" : "opacity-0"
                    } ${activeMember === member.id ? "scale-105" : ""}`}
                    onLoad={() => handleImageLoad(index)}
                  />
                  
                  {/* Status Indicator */}
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-3 border-white"></div>
                </div>

                {/* Member Info */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 text-center mb-1 md:mb-2">
                  {member.name}
                </h3>
                <p className="text-sm md:text-base text-gray-600 text-center mb-3 md:mb-4">{member.role}</p>
                
                {/* Bio (shown on hover) */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  activeMember === member.id ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <p className="text-xs md:text-sm text-gray-500 text-center italic mb-3 md:mb-4 px-2">
                    <FaQuoteLeft className="inline mr-1 text-blue-500" />
                    {member.bio}
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-2 md:space-x-3">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 md:p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <FaLinkedin className="w-3 h-3 md:w-4 md:h-4" />
                  </a>
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 md:p-2 bg-sky-100 text-sky-600 rounded-full hover:bg-sky-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                    aria-label={`${member.name}'s Twitter`}
                  >
                    <FaTwitter className="w-3 h-3 md:w-4 md:h-4" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="p-1.5 md:p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                    aria-label={`Email ${member.name}`}
                  >
                    <FaEnvelope className="w-3 h-3 md:w-4 md:h-4" />
                  </a>
                  <a
                    href="#"
                    className="p-1.5 md:p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                    aria-label={`${member.name}'s Website`}
                  >
                    <FaGlobe className="w-3 h-3 md:w-4 md:h-4" />
                  </a>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {members.length > 4 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              {showAll ? "Show Less" : `View All ${members.length} Members`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}