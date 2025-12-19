import Inventory from "../models/inventoryModel.js";
import InventoryAdjustment from "../models/inventoryAdjustmentModel.js";
import PDFDocument from "pdfkit";

export const getAllInventory = async (req, res) => {
  try {
    const inventories = await Inventory.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(inventories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
};

export const createInventory = async (req, res) => {
  try {
    const { name, price, quantity, reorderLevel, measurement } = req.body;

    const inventory = await Inventory.create({
      name,
      price,
      quantity,
      reorderLevel,
      measurement,
      createdBy: req.user._id,
    });

    res.status(201).json(inventory);
  } catch (error) {
    console.error("Create inventory error:", error);
    res.status(500).json({ message: "Failed to create inventory" });
  }
};

export const adjustInventory = async (req, res) => {
  try {
    const { type, amount, reason } = req.body;
    const inventoryId = req.params.id;

    if (!["increase", "decrease"].includes(type)) {
      return res.status(400).json({ message: "Invalid adjustment type" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (!reason || reason.trim().length < 5) {
      return res.status(400).json({ message: "Reason is required" });
    }

    const inventory = await Inventory.findById(inventoryId);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    // Prevent negative stock
    if (type === "decrease" && inventory.quantity < amount) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Apply adjustment
    inventory.quantity =
      type === "increase"
        ? inventory.quantity + amount
        : inventory.quantity - amount;

    await inventory.save();

    // Save adjustment log
    const adjustment = await InventoryAdjustment.create({
      inventory: inventory._id,
      type,
      amount,
      reason,
      adjustedBy: req.user._id,
    });

    res.json({
      inventory,
      adjustment,
    });
  } catch (error) {
    console.error("Adjust inventory error:", error);
    res.status(500).json({ message: "Failed to adjust inventory" });
  }
};

export const getInventoryHistory = async (req, res) => {
  try {
    const history = await InventoryAdjustment.find({
      adjustedBy: req.user._id, // ✅ ONLY this user's adjustments
    })
      .populate("inventory", "name")
      .populate("adjustedBy", "email")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

export const exportInventoryLedger = async (req, res) => {
  try {
    // 1️⃣ Fetch inventories
    const inventories = await Inventory.find({
      createdBy: req.user._id,
    }).sort({ createdAt: 1 });

    if (!inventories.length) {
      return res.status(404).json({ message: "No inventories found" });
    }

    // 2️⃣ Fetch adjustments
    const adjustments = await InventoryAdjustment.find({
      adjustedBy: req.user._id,
    })
      .populate("inventory", "name measurement")
      .sort({ createdAt: 1 });

    // 3️⃣ Group adjustments by inventory
    const adjustmentsByInventory = {};
    adjustments.forEach((adj) => {
      const id = adj.inventory._id.toString();
      if (!adjustmentsByInventory[id]) adjustmentsByInventory[id] = [];
      adjustmentsByInventory[id].push(adj);
    });

    // 4️⃣ PDF setup
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=inventory-ledger.pdf"
    );

    doc.pipe(res);

    /* 🎨 BLUE THEME */
    const primary = "#2563eb";
    const light = "#eff6ff";
    const textDark = "#111827";
    const textGray = "#6b7280";
    const success = "#16a34a";
    const danger = "#dc2626";

    const pageWidth = doc.page.width;
    const left = 60;
    const right = pageWidth - 60;
    const width = right - left;

    /* HEADER */
    doc.rect(0, 0, pageWidth, 90).fill(primary);
    doc
      .fillColor("white")
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("Inventory Ledger Report", left, 30);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Generated: ${new Date().toLocaleString()}`, left, 60);

    let y = 120;

    /* ============================
       PER-ITEM LEDGERS (UNCHANGED)
       ============================ */

    for (const inventory of inventories) {
      if (y > 650) {
        doc.addPage();
        y = 60;
      }

      const itemAdjustments =
        adjustmentsByInventory[inventory._id.toString()] || [];

      const totalIn = itemAdjustments
        .filter((a) => a.type === "increase")
        .reduce((s, a) => s + a.amount, 0);

      const totalOut = itemAdjustments
        .filter((a) => a.type === "decrease")
        .reduce((s, a) => s + a.amount, 0);

      const openingBalance = inventory.quantity - totalIn + totalOut;

      doc.rect(left, y, width, 30).fill(light);
      doc
        .fillColor(primary)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text(`${inventory.name} (${inventory.measurement})`, left + 10, y + 8);

      y += 40;

      doc
        .fillColor(textGray)
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Opening Balance:", left, y);

      doc.fillColor(textDark).text(openingBalance, left + 120, y);
      y += 20;

      doc
        .fillColor(textDark)
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Date", left, y)
        .text("Reason", left + 90, y)
        .text("Type", left + 280, y)
        .text("Qty", left + 350, y)
        .text("Balance", left + 420, y);

      y += 18;

      let runningBalance = openingBalance;

      for (const adj of itemAdjustments) {
        const isIn = adj.type === "increase";
        runningBalance += isIn ? adj.amount : -adj.amount;

        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(textDark)
          .text(new Date(adj.createdAt).toLocaleDateString(), left, y)
          .text(adj.reason, left + 90, y, { width: 170 })
          .fillColor(isIn ? success : danger)
          .text(isIn ? "IN" : "OUT", left + 280, y)
          .fillColor(textDark)
          .text(adj.amount, left + 350, y)
          .font("Helvetica-Bold")
          .text(runningBalance, left + 420, y);

        y += 16;

        if (y > 680) {
          doc.addPage();
          y = 60;
        }
      }

      y += 30;
    }

    /* ============================
       OVERALL STOCK MOVEMENT LEDGER
       ============================ */

    doc.addPage();
    y = 80;

    doc
      .fillColor(primary)
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("Overall Stock Movement Ledger", left, y);

    y += 30;

    doc
      .fillColor(textDark)
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Date", left, y)
      .text("Item", left + 90, y)
      .text("Unit", left + 220, y)
      .text("Type", left + 280, y)
      .text("Qty", left + 340, y)
      .text("Balance", left + 410, y);

    y += 18;

    /* Build ledger rows (OPEN + adjustments) */
    const ledgerRows = [];
    const runningBalances = {};

    for (const inv of inventories) {
      const invId = inv._id.toString();
      const itemAdjustments = adjustmentsByInventory[invId] || [];

      const totalIn = itemAdjustments
        .filter((a) => a.type === "increase")
        .reduce((s, a) => s + a.amount, 0);

      const totalOut = itemAdjustments
        .filter((a) => a.type === "decrease")
        .reduce((s, a) => s + a.amount, 0);

      const opening = inv.quantity - totalIn + totalOut;
      runningBalances[invId] = opening;

      // 🔹 OPENING ENTRY
      ledgerRows.push({
        date: inv.createdAt,
        name: inv.name,
        unit: inv.measurement,
        type: "OPEN",
        qty: opening,
        inventoryId: invId,
      });
    }

    // 🔹 ADD ADJUSTMENTS
    adjustments.forEach((adj) => {
      ledgerRows.push({
        date: adj.createdAt,
        name: adj.inventory.name,
        unit: adj.inventory.measurement,
        type: adj.type === "increase" ? "IN" : "OUT",
        qty: adj.amount,
        inventoryId: adj.inventory._id.toString(),
      });
    });

    // 🔹 SORT BY DATE
    ledgerRows.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 🔹 RENDER LEDGER
    for (const row of ledgerRows) {
      const isIn = row.type === "IN";
      const isOut = row.type === "OUT";

      if (row.type !== "OPEN") {
        runningBalances[row.inventoryId] += isIn ? row.qty : -row.qty;
      }

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(textDark)
        .text(new Date(row.date).toLocaleDateString(), left, y)
        .text(row.name, left + 90, y)
        .text(row.unit, left + 220, y)
        .fillColor(row.type === "OPEN" ? textGray : isIn ? success : danger)
        .text(row.type, left + 280, y)
        .fillColor(textDark)
        .text(row.qty, left + 340, y)
        .font("Helvetica-Bold")
        .text(runningBalances[row.inventoryId], left + 410, y);

      y += 16;

      if (y > 680) {
        doc.addPage();
        y = 60;
      }
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to generate inventory ledger PDF",
    });
  }
};
