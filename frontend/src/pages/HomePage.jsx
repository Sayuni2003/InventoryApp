import { Package, History, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-neutral-900 p-8 text-white">
      {/* Header */}
      <h1 className="text-3xl font-semibold mb-2">
        Welcome to <span className="text-blue-500">InventoryApp</span>
      </h1>

      <p className="text-neutral-400 max-w-2xl mb-8">
        A centralized inventory management system to track stock levels, record
        adjustments, and maintain accurate audit history for accountability and
        decision making.
      </p>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <Link
          to="/inventories"
          className="bg-neutral-800 hover:bg-neutral-700
                     border border-neutral-700 rounded-xl p-6
                     transition group"
        >
          <Package className="text-blue-500 mb-3" size={28} />
          <h3 className="text-lg font-semibold mb-1">View Inventory</h3>
          <p className="text-sm text-neutral-400">
            Check current stock levels and item details.
          </p>
        </Link>

        <Link
          to="/inventories"
          className="bg-neutral-800 hover:bg-neutral-700
                     border border-neutral-700 rounded-xl p-6
                     transition group"
        >
          <PlusCircle className="text-green-500 mb-3" size={28} />
          <h3 className="text-lg font-semibold mb-1">Add Inventory</h3>
          <p className="text-sm text-neutral-400">
            Register new items into the system.
          </p>
        </Link>

        <Link
          to="/inventories"
          className="bg-neutral-800 hover:bg-neutral-700
                     border border-neutral-700 rounded-xl p-6
                     transition group"
        >
          <History className="text-purple-500 mb-3" size={28} />
          <h3 className="text-lg font-semibold mb-1">Adjustment History</h3>
          <p className="text-sm text-neutral-400">
            Review all stock changes with reasons.
          </p>
        </Link>
      </div>

      {/* Highlights */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">What we offer</h2>

        <ul className="space-y-3 text-neutral-300 text-sm leading-relaxed">
          <li>
            ✔ Track all inventory items with quantities, prices, and measurement
            units in one centralized place.
          </li>

          <li>
            ✔ Monitor stock levels in real time and get clear visibility when
            items are running low.
          </li>

          <li>
            ✔ Adjust inventory safely by increasing or decreasing quantities
            with a mandatory reason for every change.
          </li>

          <li>
            ✔ Maintain a complete history of all stock adjustments for
            transparency and accountability.
          </li>

          <li>
            ✔ Ensure accurate records for daily operations, audits, and
            decision-making without manual tracking.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
