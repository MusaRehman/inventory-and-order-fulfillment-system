import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Products",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      sku: { type: DataTypes.STRING, allowNull: false, unique: true },
      price: { type: DataTypes.DECIMAL(10, 3), allowNull: false },
      description: { type: DataTypes.TEXT },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      reserved_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "products",
      timestamps: true,
      underscored: true,
    },
  );
};
