import React from "react";
import { FaRegCopy, FaQrcode, FaTrash } from "react-icons/fa";

const PaymentList = ({ data }) => {
  return (
    <div className="overflow-x-auto bg-white/10 backdrop-blur-md border border-white/20 text-white">
      <table className="w-full text-sm border border-white/20 text-left">
        <thead className="bg-gray-700 text-white text-sm">
          <tr>
            <th className="px-4 py-3">Sl</th>
            <th className="px-4 py-3">Link</th>
            <th className="px-4 py-3 text-center">Copy Link</th>
            <th className="px-4 py-3 text-center">QR Code</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((payment, index) => (
              <tr
                key={index}
                className="border-t border-t-white/20 hover:bg-white/5"
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 text-blue-400 hover:underline cursor-pointer">
                  {payment.link}
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md">
                    <FaRegCopy />
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-md">
                    <FaQrcode />
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-white/70 py-6">
                No payments found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentList;