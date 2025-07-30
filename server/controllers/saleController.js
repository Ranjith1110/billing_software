import Sale from '../models/Sale.js';

export const createSale = async (req, res) => {
  try {
    const {
      invoiceNo,
      date,
      time,
      salesman,
      customerRef,
      customerName,
      paymentMode,
      priceType,
      items,
      totalAmount,
      totalGST
    } = req.body;

    if (!req.user?.tenantId) {
      return res.status(400).json({ message: "Missing tenant ID" });
    }

    const exists = await Sale.findOne({ invoiceNo, tenantId: req.user.tenantId });
    if (exists) {
      return res.status(409).json({ message: "Invoice number already exists" });
    }

    const sale = await Sale.create({
      invoiceNo,
      date,
      time,
      salesman,
      customerRef,
      customerName,
      paymentMode,
      priceType,
      items,
      totalAmount,
      totalGST,
      tenantId: req.user.tenantId
    });

    res.status(201).json(sale);
  } catch (err) {
    console.error("Sale creation error:", err);
    res.status(500).json({ message: "Failed to create sale", error: err.message });
  }
};

export const getNextInvoiceNo = async (req, res) => {
  try {
    if (!req.user?.tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    const latest = await Sale.findOne({ tenantId: req.user.tenantId }).sort({ createdAt: -1 });

    let next = 100;
    if (latest?.invoiceNo?.startsWith('vig')) {
      const num = parseInt(latest.invoiceNo.replace('vig', ''), 10);
      if (!isNaN(num)) next = num + 1;
    }

    res.json({ nextInvoice: `vig${next}` });
  } catch (err) {
    console.error("Invoice number error:", err);
    res.status(500).json({ message: "Failed to get invoice number" });
  }
};