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

import { useNavigate } from "react-router-dom";
import { getOverView } from "../redux/slices/overview/overview.js";

import TransactionPieChart from "../components/chart/TransactionPieChart.jsx";
import Last30DaysChart from "../components/chart/Last30DaysChart.jsx";
import Last7DaysStatusChart from "../components/chart/Last7DaysStatusChart.jsx";
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, overview } = useSelector((state) => state.overview);
  const { chart } = useSelector((state) => state.chart);

  useEffect(() => {
    if (!overview) dispatch(getOverView());
    if (!chart) {
      dispatch(getChart());
    }
    if (status === 401) navigate("/login");
  }, [navigate]);

  const cardColors = {
    "Total Users": "from-green-400 to-green-600",
    "Total Balance": "from-sky-400 to-sky-600",
    "Total Amount": "from-indigo-400 to-indigo-600",
    "Total Fee": "from-red-400 to-red-600",
    "Today Amount": "from-purple-400 to-purple-600",
    "Today Fee": "from-pink-400 to-pink-600",
    "Yesterday Amount": "from-teal-400 to-teal-600",
    "Yesterday Fee": "from-orange-400 to-orange-500",
    "Last 7 Days Amount": "from-blue-300 to-blue-500",
    "Last 7 Days Fee": "from-red-300 to-red-500",
    "Last 30 Days Amount": "from-indigo-300 to-indigo-500",
    "Last 30 Days Fee": "from-purple-300 to-purple-500",
    "Payment From Link": "from-lime-400 to-lime-600",
    "Transaction From P2": "from-yellow-400 to-yellow-600",
    "Total Settlement Amount": "from-cyan-400 to-cyan-600",
    "Total Merchant": "from-amber-400 to-amber-600"
  };

  const paymentData = [
    { title: "Total Users", value: overview?.totalUsers, icon: <FaUsers /> },
    { title: "Total Balance", value: overview?.totalBalance, icon: <FaWallet /> },
    { title: "Total Amount", value: overview?.totalAmount, icon: <FaDollarSign /> },
    { title: "Total Fee", value: overview?.totalFee, icon: <FaPercentage /> },
    { title: "Today Amount", value: overview?.todayAmount, icon: <FaArrowDown /> },
    { title: "Today Fee", value: overview?.todayFee, icon: <FaArrowUp /> },
    { title: "Yesterday Amount", value: overview?.yesterdayAmount, icon: <FaArrowDown /> },
    { title: "Yesterday Fee", value: overview?.yesterdayFee, icon: <FaArrowUp /> },
    { title: "Last 7 Days Amount", value: overview?.last7DaysAmount, icon: <FaCalendarAlt /> },
    { title: "Last 7 Days Fee", value: overview?.last7DaysFee, icon: <FaMoneyBillWave /> },
    { title: "Last 30 Days Amount", value: overview?.last30DaysAmount, icon: <FaCalendarAlt /> },
    { title: "Last 30 Days Fee", value: overview?.last30DaysFee, icon: <FaWallet /> },
    { title: "Payment From Link", value: overview?.paymentFromLink, icon: <FaLink /> },
    { title: "Transaction From P2", value: overview?.transactionFromP2c, icon: <FaExchangeAlt /> },
    { title: "Total Settlement Amount", value: overview?.totalSettlementAmount, icon: <FaRegMoneyBillAlt /> },
    { title: "Total Merchant", value: overview?.totalMerchant, icon: <FaStore /> },
  ];


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Payment Overview</h2>

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
