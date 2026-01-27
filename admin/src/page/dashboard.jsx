import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StatCard from "../components/card/startCard.jsx";
import {
  FaUsers,
  FaStore,
  FaDollarSign,
  FaPercentage,
  FaArrowDown,
  FaArrowUp,
  FaLink,
  FaExchangeAlt,
  FaRegMoneyBillAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaWallet,
} from "react-icons/fa";



import { getChart } from "../redux/slices/overview/chartSlice.js";

// ---------------- Skeleton Card ----------------
const SkeletonCard = () => (
  <div className="relative rounded-xl shadow-lg p-6 overflow-hidden animate-pulse bg-gray-700/20 border border-white/20 h-32 flex flex-col justify-between">
    <div className="flex items-center justify-between mb-4">
      <div className="w-24 h-4 bg-gray-500 rounded"></div>
      <div className="w-10 h-10 rounded-full bg-gray-500/50"></div>
    </div>
    <div className="w-3/4 h-8 bg-gray-500 rounded mb-2"></div>
    <div className="w-1/2 h-4 bg-gray-500 rounded"></div>
  </div>
);

// ---------------- Chart Skeletons ----------------

const Dashboard = () => {
  const { loading } = useSelector((state) => state.overview);


  const cardColors = {
    // "Total Users": "from-green-400 to-green-600",
   
  };

  const paymentData = [
    // { title: "Total Users", value: overview?.totalUsers, icon: <FaUsers /> },
  ];


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {loading
          ? Array.from({ length: paymentData.length }).map((_, index) => <SkeletonCard key={index} />)
          : paymentData.map((item, index) => (
            <StatCard
              key={index}
              title={item.title}
              value={item.value !== undefined && item.value !== null ? item.value : "0"}
              icon={item.icon}
              color={cardColors[item.title] || "from-gray-400 to-gray-600"}
            />
          ))}
      </div>

    </div>
  );
};

export default Dashboard;
