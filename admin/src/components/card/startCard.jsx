import { useEffect, useState } from "react";

const StatCard = ({ title, value, icon, color = "from-gray-700 to-gray-800", unit, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof value !== "number") return;

    let start = 0;
    const end = value;
    const increment = end / (duration / 16);
    const step = () => {
      start += increment;
      if (start >= end) {
        setCount(end);
      } else {
        setCount(Math.ceil(start));
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  const displayValue = () => {
    const display = typeof value === "number" ? count : value;

    if (unit) return `${display.toLocaleString()} ${unit}`;
    if (title === "Total Users") return `${display.toLocaleString()} users`;
    if (title === "Total Merchant") return `${display.toLocaleString()} Merchant`;
    return `৳${display.toLocaleString()}`;
  };

  return (
    <div
      className={`relative rounded-xl shadow-lg p-6 overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${color}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white/80">{title}</h3>
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full text-lg text-white/90 bg-white/20`}
        >
          {icon}
        </div>
      </div>

      <div className="mb-2">
        <p className="text-3xl font-bold text-white">{displayValue()}</p>
      </div>
    </div>
  );
};

export default StatCard;
