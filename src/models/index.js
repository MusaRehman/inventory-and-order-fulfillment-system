import { sequelize } from "../config/database.js";
import createUser from "./users.js";
import createOrder from "./orders.js";
import createOrderItems from "./orderItems.js";
import createInventoryMovements from "./inventoryMovements.js";
import createProducts from "./products.js";
import createOutboxEvents from "./outboxEvents.js";

const User = createUser(sequelize);
const Order = createOrder(sequelize);
const OrderItem = createOrderItems(sequelize);
const InventoryMovement = createInventoryMovements(sequelize);
const Product = createProducts(sequelize);
const OutboxEvent = createOutboxEvents(sequelize);

export const db = {
  sequelize,
  User,
  Order,
  OrderItem,
  InventoryMovement,
  Product,
  OutboxEvent,
};
