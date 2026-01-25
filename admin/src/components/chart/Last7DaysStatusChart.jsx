import {  useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 p-3 rounded shadow-lg border border-gray-700 text-white">
        <p className="font-semibold">Day: {label}</p>
        {payload.map((p, idx) => (
          <p key={idx} style={{ color: p.stroke }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Skeleton Loader
const ChartSkeleton = () => (
  <div className="bg-gray-800 p-4 rounded-xl shadow-lg mt-8">
    <div className="h-6 w-72 bg-gray-700 rounded mb-4 animate-pulse"></div>
    <div className="h-64 w-full bg-gray-700 rounded animate-pulse"></div>
    <div className="flex justify-between mt-3">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="w-10 h-4 bg-gray-700 rounded animate-pulse"
        ></div>
      ))}
    </div>
  </div>
);

const Last7DaysStatusChart = () => {
 
  const { chart, loading } = useSelector((state) => state.chart);


  if (loading || !chart?.last7DaysSuccess) {
    return <ChartSkeleton />;
  }

  // Prepare data
  const data = chart.last7DaysSuccess.map((_, index) => ({
    day: `Day ${index + 1}`,
    Success: chart.last7DaysSuccess[index] || 0,
    Failed: chart.last7DaysFailed[index] || 0,
    Cancelled: chart.last7DaysCancelled[index] || 0,
  }));

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg mt-8 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-white font-semibold mb-4">
        Last 7 Days Transactions Status
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="day" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" wrapperStyle={{ color: "#fff" }} />

          <Line
            type="monotone"
            dataKey="Success"
            stroke="#4ade80"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="Failed"
            stroke="#f87171"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="Cancelled"
            stroke="#facc15"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Last7DaysStatusChart;
