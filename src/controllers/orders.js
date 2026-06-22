import { it } from "zod/locales";
import { db } from "../models/index.js";
const { Order, Product } = db;

export const createOrder = async (req, res) => {
  let payload = req.body;

  if (!payload.idempotencyKey) {
    return res.status(400).json({ error: "Idempotency key is required" });
  }

  let { idempotencyKey } = payload;

  try {
    let keyExists = await Order.findOne({
      where: { idempotency_key: idempotencyKey },
    });

    if (keyExists) {
      return res.status(409).json({ error: "Duplicate request" });
    }

    let items = payload.items || [];

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Items array is required and cannot be empty",
      });
    }

    let validItems = [];

    for (const item of items) {
      if (!item.product_sku) {
        return res.status(400).json({
          error: "Product SKU is required for each item",
        });
      }

      let productExists = await Product.findOne({
        where: { sku: item.product_sku },
      });

      if (!productExists) {
        return res.status(400).json({
          error: `Product with SKU ${item.product_sku} does not exist`,
        });
      }

      validItems.push(item);
    }

    console.log("valid items", validItems);

    return res.json({ success: true, validItems });

  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
