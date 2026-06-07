import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "OrderItems",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    {
      tableName: "order_items",
      timestamps: true,
      underscored: true,
    },
  );
};
