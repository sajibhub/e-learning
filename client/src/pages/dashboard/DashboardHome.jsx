import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaBook, 
  FaShoppingBag, 
  FaCertificate, 
  FaClock,
  FaTrophy
} from "react-icons/fa";

const DashboardHome = ({ user }) => {
  const navigate = useNavigate();

  // Card items with icons and descriptions
  const cards = [
    { 
      title: "Profile", 
      path: "/dashboard/profile", 
      icon: <FaUser className="text-blue-500" />,
      color: "from-blue-400 to-blue-600",
      description: "Manage your personal information"
    },
    { 
      title: "My Courses", 
      path: "/dashboard/courses", 
      icon: <FaBook className="text-green-500" />,
      color: "from-green-400 to-green-600",
      description: "Access your enrolled courses"
    },
    { 
      title: "My Products", 
      path: "/dashboard/products", 
      icon: <FaShoppingBag className="text-purple-500" />,
      color: "from-purple-400 to-purple-600",
      description: "View your purchased products"
    },
    { 
      title: "Certificates", 
      path: "/dashboard/certificates", 
      icon: <FaCertificate className="text-orange-500" />,
      color: "from-orange-400 to-orange-600",
      description: "Download your certificates"
    },
  ];

  // Stats data (in a real app, this would come from an API)
  const stats = [
    { label: "Courses Enrolled", value: "12", icon: <FaBook />, color: "bg-blue-100 text-blue-600" },
    { label: "Products Purchased", value: "8", icon: <FaShoppingBag />, color: "bg-green-100 text-green-600" },
    { label: "Certificates Earned", value: "5", icon: <FaCertificate />, color: "bg-purple-100 text-purple-600" },
    { label: "Hours Learned", value: "48", icon: <FaClock />, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
            <p className="opacity-90">Continue your learning journey and explore new opportunities.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <FaTrophy className="text-yellow-300" />
              <span className="font-medium">Level 5 Learner</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Cards */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Access</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
              <div className="p-6">
                <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
              <div className="px-6 pb-4">
                <span className={`text-sm font-medium bg-gradient-to-r ${card.color} bg-clip-text text-transparent group-hover:underline`}>
                  Access →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;