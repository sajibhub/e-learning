import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-white/80 mb-8">Page Not Found</p>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md border border-white/20">
          <p className="text-white/90 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;