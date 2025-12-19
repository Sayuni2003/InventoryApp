import express from "express";
import verifyFirebase from "../middlewares/verifyFirebase.js";
import { registerUser, getMe } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", verifyFirebase, registerUser);
router.get("/me", verifyFirebase, getMe);

export default router;
