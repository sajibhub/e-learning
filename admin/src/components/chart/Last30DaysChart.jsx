import {  useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
} from "recharts";

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 p-3 rounded shadow-lg border border-gray-700 text-white">
        <p className="font-semibold">Date: {label}</p>
        <p>Amount: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// Skeleton Loader for Line Chart
const ChartSkeleton = () => (
  <div className="bg-gray-800 p-5 rounded-xl shadow-lg mt-8">
    <div className="h-6 w-56 bg-gray-700 rounded mb-4 animate-pulse"></div>
    <div className="h-64 w-full bg-gray-700 rounded animate-pulse"></div>
    <div className="flex justify-between mt-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-10 h-4 bg-gray-700 rounded animate-pulse"></div>
      ))}
    </div>
  </div>
);

const Last30DaysChart = () => {
  
  const { chart, loading } = useSelector((state) => state.chart);

 
  if (loading || !chart?.last30DaysArray) {
    return <ChartSkeleton />;
  }

  const today = new Date();

  const data = chart.last30DaysArray.map((amount, index) => {
    const date = new Date();
    date.setDate(today.getDate() - (29 - index)); // oldest -> left, today -> right
    const dayLabel = `${date.getMonth() + 1}/${date.getDate()}`;
    return { day: dayLabel, amount };
  });

  const avgAmount = data.reduce((sum, d) => sum + d.amount, 0) / data.length;

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-lg mt-8 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-white font-semibold mb-4">Last 30 Days Transactions</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="day" stroke="#fff" tick={{ fontSize: 12 }} />
          <YAxis stroke="#fff" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />

          {/* Average Line */}
          <ReferenceLine
            y={avgAmount}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{
              value: `Avg: ${avgAmount.toFixed(2)}`,
              fill: "#f59e0b",
              position: "top",
            }}
          />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            dot={{ r: 5, fill: "#4ade80", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 7 }}
            isAnimationActive={true}
          >
            <LabelList
              dataKey="amount"
              position="top"
              fill="#fff"
              fontSize={12}
            />
          </Line>

          {/* Gradient for line */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#16a34a" stopOpacity={0.3} />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Last30DaysChart;
