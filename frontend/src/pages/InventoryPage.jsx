import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { auth } from "../firebase/firebaseConfig";
import axiosInstance from "../api/axiosInstance";
import InventoryHistory from "../components/inventory/InventoryHistory";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-toastify";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [adjustItem, setAdjustItem] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const [adjustData, setAdjustData] = useState({
    type: "increase", // or "decrease"
    amount: "",
    reason: "",
  });

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = await auth.currentUser.getIdToken();

        const res = await axiosInstance.get("/api/inventory", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setInventory(res.data);
      } catch (error) {
        console.error("Fetch inventory failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    reorderLevel: "",
    measurements: "kg",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Get Firebase token
      const token = await auth.currentUser.getIdToken();

      // 2️⃣ Send request WITH token
      const res = await axiosInstance.post(
        "/api/inventory",
        {
          name: formData.name,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
          reorderLevel: Number(formData.reorderLevel),
          measurement: formData.measurements,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 3️⃣ Update UI from backend response
      setInventory((prev) => [...prev, res.data]);

      setFormData({
        name: "",
        price: "",
        quantity: "",
        reorderLevel: "",
        measurements: "kg",
      });

      setShowForm(false);
    } catch (error) {
      console.error("Add inventory failed:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleAdjust = (id) => {};

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await auth.currentUser.getIdToken();

      const res = await axiosInstance.patch(
        `/api/inventory/${adjustItem._id}/adjust`,
        {
          type: adjustData.type,
          amount: Number(adjustData.amount),
          reason: adjustData.reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (adjustData.reason.trim().length < 6) {
        toast.error("Reason must be at least 6 characters long");
        return;
      }

      // Update UI with backend result
      setInventory((prev) =>
        prev.map((item) =>
          item._id === res.data.inventory._id ? res.data.inventory : item
        )
      );

      // Close modal
      setAdjustItem(null);
    } catch (error) {
      console.error("Adjust inventory failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-8 ">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-white text-center">
          Inventories
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="mt-3 inline-flex items-center gap-2
               bg-blue-600 hover:bg-blue-700
               text-white text-sm font-medium
               px-4 py-2 rounded-lg
               transition-colors"
        >
          + Add Inventory
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Add Inventory
            </h2>

            <form onSubmit={handleAddInventory} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm mb-1 text-neutral-300">
                  Item Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-neutral-800
                 text-white border border-neutral-700
                 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm mb-1 text-neutral-300">
                  Price (Rs.)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-neutral-800
                 text-white border border-neutral-700
                 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm mb-1 text-neutral-300">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-neutral-800
                 text-white border border-neutral-700
                 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Reorder Level */}
              <div>
                <label className="block text-sm mb-1 text-neutral-300">
                  Reorder Level
                </label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-neutral-800
                 text-white border border-neutral-700
                 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Measurement */}
              <div>
                <label className="block text-sm mb-1 text-neutral-300">
                  Measurement Unit
                </label>
                <select
                  name="measurements"
                  value={formData.measurements}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-neutral-800
                 text-white border border-neutral-700
                 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="L">L</option>
                  <option value="ml">ml</option>
                  <option value="pcs">pcs</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600
                 hover:bg-blue-700 text-white font-medium"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*Adjust inventory modal*/}
      {adjustItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Adjust Inventory
            </h2>

            {/* Read-only info */}
            <div className="mb-4 text-sm text-neutral-300 space-y-1">
              <p>
                <span className="text-neutral-400">Item:</span>{" "}
                {adjustItem.name}
              </p>
              <p>
                <span className="text-neutral-400">Current Quantity:</span>{" "}
                {adjustItem.quantity}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleAdjustSubmit}>
              {/* Adjustment Type */}
              <div>
                <label className="block text-sm mb-1 text-neutral-300">
                  Adjustment Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-neutral-300">
                    <input
                      type="radio"
                      name="type"
                      value="increase"
                      checked={adjustData.type === "increase"}
                      onChange={(e) =>
                        setAdjustData({ ...adjustData, type: e.target.value })
                      }
                    />
                    Increase
                  </label>

                  <label className="flex items-center gap-2 text-neutral-300">
                    <input
                      type="radio"
                      name="type"
                      value="decrease"
                      checked={adjustData.type === "decrease"}
                      onChange={(e) =>
                        setAdjustData({ ...adjustData, type: e.target.value })
                      }
                    />
                    Decrease
                  </label>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm mb-1 text-neutral-300">
                  Quantity Change
                </label>
                <input
                  type="number"
                  min="1"
                  value={adjustData.amount}
                  onChange={(e) =>
                    setAdjustData({ ...adjustData, amount: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg bg-neutral-800
                       text-white border border-neutral-700
                       focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm mb-1 text-neutral-300">
                  Reason (Required)
                </label>
                <textarea
                  value={adjustData.reason}
                  onChange={(e) =>
                    setAdjustData({ ...adjustData, reason: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-neutral-800
                       text-white border border-neutral-700
                       focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setAdjustItem(null)}
                  className="px-4 py-2 text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600
                       hover:bg-blue-700 text-white font-medium"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <p className="text-neutral-400">Loading inventory...</p>}

      {!loading && inventory.length === 0 && (
        <div
          className="mt-8 flex flex-col items-center justify-center
                  border border-dashed border-neutral-700
                  rounded-xl p-10 text-center"
        >
          <p className="text-neutral-300 text-lg font-medium">
            No inventories yet
          </p>
          <p className="text-neutral-500 text-sm mt-1">
            Click{" "}
            <span className="text-blue-400 font-medium">“Add Inventory”</span>{" "}
            to start tracking your stock.
          </p>
        </div>
      )}

      {!loading && inventory.length > 0 && (
        <>
          <div className="bg-neutral-900 rounded-xl shadow-lg border border-neutral-700 overflow-hidden">
            {/* TABLE HERE */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-800 text-neutral-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Quantity</th>
                    <th className="px-6 py-3 text-left">Reorder Level</th>
                    <th className="px-6 py-3 text-left">Created On</th>
                    <th className="px-6 py-3 text-left">Price</th>
                    <th className="px-6 py-3 text-left">Measurement</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-700">
                  {inventory.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-neutral-800 transition"
                    >
                      <td className="px-6 py-4 font-medium text-neutral-100">
                        {item.name}
                      </td>

                      <td
                        className={`px-6 py-4 font-medium ${
                          item.quantity <= item.reorderLevel
                            ? "text-red-400"
                            : "text-neutral-300"
                        }`}
                      >
                        {item.quantity}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`font-medium ${
                            item.quantity <= item.reorderLevel
                              ? "text-red-400"
                              : "text-neutral-300"
                          }`}
                        >
                          {item.reorderLevel}
                        </span>

                        {item.quantity <= item.reorderLevel && (
                          <span className="ml-2 text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                            Low stock
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-neutral-400">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-neutral-300">
                        {item.price}
                      </td>
                      <td className="px-6 py-4 text-neutral-300">
                        {item.measurement}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setAdjustItem(item);
                            setAdjustData({
                              type: "increase",
                              amount: "",
                              reason: "",
                            });
                          }}
                          className="inline-flex items-center gap-2
             bg-blue-600 hover:bg-blue-700
             text-white text-sm font-medium
             px-4 py-2 rounded-lg"
                        >
                          Adjust
                          <Pencil size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            {/* SHOW HISTORY BUTTON */}
            <button
              onClick={() => setShowHistory((prev) => !prev)}
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
            >
              {showHistory ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
              {showHistory
                ? "Hide adjustment history"
                : "Show adjustment history"}
            </button>

            {showHistory && <InventoryHistory />}
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryPage;
