import express from "express";
import {
  getAllInventory,
  createInventory,
  adjustInventory,
  getInventoryHistory,
  exportInventoryLedger,
} from "../controllers/inventoryController.js";

import verifyFirebase from "../middlewares/verifyFirebase.js";
import attachUser from "../middlewares/attachUser.js";
import requireRole from "../middlewares/requireRole.js";

const router = express.Router();

//GET all inventory
router.get(
  "/",
  verifyFirebase,
  attachUser,
  requireRole(["user", "admin"]),
  getAllInventory
);

//POST new inventory
router.post(
  "/",
  verifyFirebase,
  attachUser,
  requireRole(["user"]),
  createInventory
);

//ADJUST a single inventory
router.patch(
  "/:id/adjust",
  verifyFirebase,
  attachUser,
  requireRole(["user"]),
  adjustInventory
);

//SHOW all history of adjustments
router.get(
  "/adjustments/history",
  verifyFirebase,
  attachUser,
  requireRole("user"),
  getInventoryHistory
);

//PDF
router.get(
  "/export/pdf",
  verifyFirebase,
  attachUser,
  requireRole("user"),
  exportInventoryLedger
);

// export router
export default router;
