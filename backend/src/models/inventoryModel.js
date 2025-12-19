import mongoose from "mongoose";

// 1-create schema
const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    reorderLevel: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    measurement: {
      type: String,
      required: true,
      enum: ["kg", "g", "L", "ml", "pcs"],
      default: "kg",
    },
  },
  { timestamps: true } //createdAt, updatedAt
);

// 2-model based of thar schema
const inventory = mongoose.model("inventory", inventorySchema);

export default inventory;
