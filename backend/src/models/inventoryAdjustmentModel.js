import mongoose from "mongoose";

const inventoryAdjustmentSchema = new mongoose.Schema(
  {
    inventory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "inventory",
      required: true,
    },

    type: {
      type: String,
      enum: ["increase", "decrease"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    adjustedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("InventoryAdjustment", inventoryAdjustmentSchema);
