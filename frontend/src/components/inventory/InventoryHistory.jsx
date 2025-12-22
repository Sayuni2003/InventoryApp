import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { auth } from "../../firebase/firebaseConfig";

const InventoryHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axiosInstance.get(
          "/api/inventory/adjustments/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <p className="text-neutral-400 mt-4">Loading history...</p>;
  }

  const downloadInventoryPdf = async () => {
    try {
      const token = await auth.currentUser.getIdToken();

      const res = await axiosInstance.get("/api/inventory/export/pdf", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // 🔑 VERY IMPORTANT
      });

      // Create blob URL
      const file = new Blob([res.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      // Trigger download
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "inventory-report.pdf";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("PDF download failed", error);
    }
  };

  return (
    <>
      <button
        onClick={() => downloadInventoryPdf()}
        className="inline-flex items-center gap-2
             bg-blue-600 hover:bg-blue-700
             text-white text-sm font-medium
             px-4 py-2 rounded-lg mt-4"
      >
        Download the report
      </button>
      <div className="mt-6 border border-neutral-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-800 text-neutral-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Reason</th>
                <th className="px-4 py-3 text-left">Adjusted By</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-700">
              {history.map((h) => (
                <tr key={h._id}>
                  <td className="px-4 py-3 text-neutral-100">
                    {h.inventory?.name}
                  </td>
                  <td
                    className={`px-4 py-3 font-medium ${
                      h.type === "increase" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {h.type}
                  </td>
                  <td className="px-4 py-3 text-neutral-300">{h.amount}</td>
                  <td className="px-4 py-3 text-neutral-300">{h.reason}</td>
                  <td className="px-4 py-3 text-neutral-400">
                    {h.adjustedBy?.email}
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    {new Date(h.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default InventoryHistory;
