import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      role: {
        type: DataTypes.ENUM("CUSTOMER", "ADMIN"),
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true,
    },
  );
};
