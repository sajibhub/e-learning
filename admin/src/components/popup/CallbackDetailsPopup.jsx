import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaCopy, FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getSingleTransactions, setCallbackModal } from "../../redux/slices/transaction/singleTransaction";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-700 rounded ${className}`} />
);

const CallbackDetailsPopup = ({ transactionId }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const dispatch = useDispatch();
  const { transaction, isModalOpen, loading } = useSelector((state) => state.transaction);

  useEffect(() => {
    if (transactionId) dispatch(getSingleTransactions(transactionId));
  }, [dispatch, transactionId]);

  const onClose = () => dispatch(setCallbackModal(false));

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "url") setCopiedUrl(true);
    else setCopiedPayload(true);
    setTimeout(() => {
      setCopiedUrl(false);
      setCopiedPayload(false);
    }, 2000);
  };

  const formatLocalTime = (time) => {
    if (!time) return "N/A";
    const date = new Date(time);
    return date.toLocaleString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "bg-green-600 text-white";
      case "failed":
        return "bg-red-600 text-white";
      case "pending":
        return "bg-yellow-500 text-black";
      case "cancelled":  
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };


  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 md:p-8">

        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 bg-white/5 backdrop-blur-md z-10 p-4 rounded-t-xl border-b border-white/20">
          <h2 className="text-white cursor-pointer text-2xl font-bold">Transaction Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full transition-colors"
          >
            <IoMdClose size={26} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 mt-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : transaction ? (
            <>
              {/* Transaction Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <h1 className="text-white text-2xl font-bold">
                  Transaction #{transaction.transactionId || transaction._id}
                </h1>
                <span
                  className={`px-4 py-1 rounded-full font-medium ${getStatusBadge(
                    transaction.status
                  )}`}
                >
                  {transaction.status || "Unknown"}
                </span>
              </div>

              {/* Created Time */}
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-sm">
                <h3 className="text-gray-300 text-sm mb-1">Created Time</h3>
                <p className="text-white text-sm font-medium">
                  {formatLocalTime(transaction.createdAt)}
                </p>
              </div>

              {/* Callback URL */}
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <h3 className="text-gray-300 text-sm">Callback URL</h3>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <p className="text-white text-sm break-all bg-gray-700/30 p-2 rounded flex-1">
                    {`${transaction.callback}?paymentID=${transaction.paymentId}`}
                  </p>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${transaction.callback}?paymentID=${transaction.paymentId}`,
                        "url"
                      )
                    }
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded transition-colors"
                  >
                    {copiedUrl ? <FaCheck className="mr-1" /> : <FaCopy className="mr-1" />}
                    {copiedUrl ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Full Response */}
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-sm">
                <h3 className="text-gray-300 text-sm mb-2">Response Payload</h3>
                <pre className="text-gray-100 text-xs overflow-auto h-64 font-mono bg-gray-700/30 p-3 rounded-lg">
                  {JSON.stringify(transaction, null, 2)}
                </pre>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(transaction, null, 2), "payload")}
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded mt-2 transition-colors"
                >
                  {copiedPayload ? <FaCheck className="mr-1" /> : <FaCopy className="mr-1" />}
                  {copiedPayload ? "Copied!" : "Copy JSON"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-white text-center text-lg">No transaction found.</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-700 cursor-pointer hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallbackDetailsPopup;
