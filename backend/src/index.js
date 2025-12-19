import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import inventory from "./routes/inventoryRoute.js";
import { connectDB } from "./config/db.js";

dotenv.config();

//express app
const app = express();

const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running...");
});

//routes
app.use("/api/inventory", inventory);
app.use("/api/auth", authRoutes);

//connect at db
connectDB();

app.listen(PORT, () => {
  console.log(" connecting to db & listening on port", PORT);
});
