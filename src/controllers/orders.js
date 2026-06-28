
// export const createOrder = async (req, res) => {
//   let payload = req.body;

//   if (!payload.idempotencyKey) {
//     return res.status(400).json({ error: "Idempotency key is required" });
//   }

//   let { idempotencyKey } = payload;

//   try {
//     let keyExists = await Order.findOne({
//       where: { idempotency_key: idempotencyKey },
//     });

//     if (keyExists) {
//       return res.status(409).json({ error: "Duplicate request" });
//     }

//     let items = payload.items || [];

//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({
//         error: "Items array is required and cannot be empty",
//       });
//     }

//     let validItems = [];

//     for (const item of items) {
//       if (!item.product_sku) {
//         return res.status(400).json({
//           error: "Product SKU is required for each item",
//         });
//       }

//       let productExists = await Product.findOne({
//         where: { sku: item.product_sku },
//       });

//       if (!productExists) {
//         return res.status(400).json({
//           error: `Product with SKU ${item.product_sku} does not exist`,
//         });
//       }

//       validItems.push(item);
//     }

//     console.log("valid items", validItems);

//     // after valiation, perfomring order transaction

//     let lockedRows = await sequelize.transaction(async (t) => {
//       let lockedProducts = await Product.findAll({
//         where: {
//           sku: validItems.map((item) => item.product_sku),
//         },
//         lock: t.LOCK.UPDATE,
//       });

//       let lockedProductMap = new Map(
//         lockedProducts.map((product) => [product.sku, product]),
//       );
//       // check stock
//       for (const item of validItems) {
//         const lockedProduct = lockedProductMap.get(item.product_sku);
//         if (!lockedProduct || lockedProduct.stock < item.quantity) {
//           return res.status(400).json({
//             error: `Insufficient stock for product with SKU ${item.product_sku}`,
//           });
//         }
//       }
//       let totalPrice = 0;
//       // now we have to reserve the stock and create the order
//       for (const item of validItems) {
//         let prod = lockedProductMap.get(item.product_sku);
//         prod.stock -= item.quantity;
//         prod.reserved_stock += item.quantity;
//         await prod.save({ transaction: t });
//         totalPrice += prod.price * item.quantity;
//       }
//     });
//     let currentOrderId = crypto.randomUUID();
//     // now we can create the order
//     await sequelize.transaction(async (t) => {
//       const order = await Order.create(
//         {
//           idempotency_key: idempotencyKey,
//           user_id: "68216dc4-13ba-4915-a8de-f5155a26c56b",
//           status: "CREATED",
//           payment_status: "PENDING",
//           fulfillment_status: "NOT_STARTED",
//           total_amount: totalPrice,
//           id: currentOrderId,
//         },
//         {
//           transaction: t,
//         },
//       );

//       for (const item of validItems) {
//         const prod = await Product.findOne({
//           where: { sku: item.product_sku },
//           transaction: t,
//         });

//         await OrderItems.create(
//           {
//             product_id: prod.id,
//             quantity: item.quantity,
//             unit_price: prod.price,
//             total_price: prod.price * item.quantity,
//             order_id: currentOrderId,
//           },
//           {
//             transaction: t,
//           },
//         );
//         // now create inventory movement for each item

//         await inventoryMovements.create(
//           {
//             product_id: prod.id,
//             quantity: item.quantity,
//             type: "OUT",
//             order_id: currentOrderId,
//           },
//           {
//             transaction: t,
//           },
//         );  
//       }
//       // Transaction complete
//     });

//     res.status(201).json({ message: "Order created successfully" });



//   } catch (error) {
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// new version of createOrder function
import crypto from "crypto";
import { db } from "../models/index.js";
import { sequelize } from "../config/database.js";
import OrderItems from "../models/orderItems.js";
import InventoryMovements from "../models/inventoryMovements.js";

const { Order, Product } = db;

export const createOrder = async (req, res) => {
  const payload = req.body;

  if (!payload.idempotencyKey) {
    return res.status(400).json({
      error: "Idempotency key is required",
    });
  }

  const { idempotencyKey } = payload;

  try {
    // Check duplicate request
    const existingOrder = await Order.findOne({
      where: {
        idempotency_key: idempotencyKey,
      },
    });

    if (existingOrder) {
      return res.status(409).json({
        error: "Duplicate request",
      });
    }

    const items = payload.items || [];

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Items array is required",
      });
    }

    // Validate products exist
    const validItems = [];

    for (const item of items) {
      if (!item.product_sku) {
        return res.status(400).json({
          error: "Product SKU is required",
        });
      }

      const exists = await Product.findOne({
        where: {
          sku: item.product_sku,
        },
      });

      if (!exists) {
        return res.status(400).json({
          error: `Product ${item.product_sku} not found`,
        });
      }

      validItems.push(item);
    }

    const currentOrderId = crypto.randomUUID();

    await sequelize.transaction(async (t) => {

      //----------------------------------------------------
      // Lock rows
      //----------------------------------------------------

      const lockedProducts = await Product.findAll({
        where: {
          sku: validItems.map(i => i.product_sku),
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      //----------------------------------------------------
      // Convert to Map
      //----------------------------------------------------

      const productMap = new Map(
        lockedProducts.map(product => [product.sku, product])
      );

      //----------------------------------------------------
      // Validate stock
      //----------------------------------------------------

      let totalPrice = 0;

      for (const item of validItems) {

        const product = productMap.get(item.product_sku);

        if (!product) {
          throw new Error(`Product ${item.product_sku} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${item.product_sku}`
          );
        }

        totalPrice += product.price * item.quantity;
      }

      //----------------------------------------------------
      // Reserve stock
      //----------------------------------------------------

      for (const item of validItems) {

        const product = productMap.get(item.product_sku);

        product.stock -= item.quantity;
        product.reserved_stock += item.quantity;

        await product.save({
          transaction: t,
        });
      }

      //----------------------------------------------------
      // Create order
      //----------------------------------------------------

      await Order.create(
        {
          id: currentOrderId,
          idempotency_key: idempotencyKey,
          user_id: "68216dc4-13ba-4915-a8de-f5155a26c56b",
          status: "CREATED",
          payment_status: "PENDING",
          fulfillment_status: "NOT_STARTED",
          total_amount: totalPrice,
        },
        {
          transaction: t,
        }
      );

      //----------------------------------------------------
      // Create order items + inventory movements
      //----------------------------------------------------

      for (const item of validItems) {

        const product = productMap.get(item.product_sku);

        await OrderItems.create(
          {
            order_id: currentOrderId,
            product_id: product.id,
            quantity: item.quantity,
            unit_price: product.price,
            total_price: product.price * item.quantity,
          },
          {
            transaction: t,
          }
        );

        await InventoryMovements.create(
          {
            product_id: product.id,
            quantity: item.quantity,
            type: "OUT",
            order_id: currentOrderId,
          },
          {
            transaction: t,
          }
        );
      }

    });

    return res.status(201).json({
      message: "Order created successfully",
      orderId: currentOrderId,
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message,
    });

  }
};