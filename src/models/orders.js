// Orders

import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Orders",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      status: { type: DataTypes.STRING, allowNull: false },
      payment_status: { type:  DataTypes.ENUM("PENDING", "PROCESSING", "SUCCESS","FAILED"), allowNull: false },
      fulfillment_status: { type:  DataTypes.ENUM("NOT_STARTED", "PROCESSING", "COMPLETED", "FAILED"), allowNull: false },
      total_amount: { type: DataTypes.DECIMAL(10, 3), allowNull: false },
      idempotency_key: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: "orders",
      timestamps: true,
      underscored: true,
    },
  );
};
