import {  useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TransactionPieChart = () => {

  const { chart, loading,  } = useSelector((state) => state.chart);


  const total =
    (chart?.transactionFromP2c || 0) + (chart?.transactionFromLink || 0);

  const data = [
    { name: "P2C Transactions", value: chart?.transactionFromP2c || 0 },
    { name: "Link Transactions", value: chart?.transactionFromLink || 0 },
  ];

  const COLORS = ["#3b82f6", "#f59e0b"]; // blue & orange

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percent = total ? ((value / total) * 100).toFixed(2) : 0;
      return (
        <div className="bg-gray-900 text-white p-3 rounded shadow-lg border border-gray-700">
          <p className="font-semibold">{name}</p>
          <p>Count: {value}</p>
          <p>Percentage: {percent}%</p>
        </div>
      );
    }
    return null;
  };

  // Skeleton loader for chart
  const ChartSkeleton = () => (
    <div className="bg-gray-800 p-5 rounded-xl shadow-lg mt-8">
      <div className="h-6 w-48 bg-gray-700 rounded mb-4 animate-pulse"></div>
      <div className="flex justify-center items-center">
        <div className="relative">
          {/* Circle skeleton */}
          <div className="w-48 h-48 rounded-full bg-gray-700 animate-pulse"></div>
          {/* Inner circle for donut look */}
          <div className="absolute inset-10 rounded-full bg-gray-800"></div>
        </div>
      </div>
      {/* Legend skeleton */}
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-700 rounded-full animate-pulse"></div>
          <div className="w-24 h-4 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-700 rounded-full animate-pulse"></div>
          <div className="w-24 h-4 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {loading ? (
        <ChartSkeleton />
      ) : (
        <div className="bg-gray-800 p-5 rounded-xl shadow-lg mt-8 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-white mb-4">
            Transactions by Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                isAnimationActive={true}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default TransactionPieChart;
