import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import inventory from "./routes/inventoryRoute.js";
import { connectDB } from "./config/db.js";
import cors from "cors";

dotenv.config();

//express app
const app = express();

const allowedOrigins = [
  "https://inventory-app-ten-black.vercel.app",
  "http://localhost:5173", // for local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// IMPORTANT: allow preflight
app.options("*", cors());

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
