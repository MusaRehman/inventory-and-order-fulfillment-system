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

User.hasMany(Order, {
  foreignKey: "user_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

Order.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

Order.hasMany(OrderItem, {
  foreignKey: "order_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

OrderItem.belongsTo(Order, {
  foreignKey: "order_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.hasMany(OrderItem, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

OrderItem.belongsTo(Product, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

Product.hasMany(InventoryMovement, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

InventoryMovement.belongsTo(Product, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

Order.hasMany(InventoryMovement, {
  foreignKey: "order_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

InventoryMovement.belongsTo(Order, {
  foreignKey: "order_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

export const db = {
  sequelize,
  User,
  Order,
  OrderItem,
  InventoryMovement,
  Product,
  OutboxEvent,
};
