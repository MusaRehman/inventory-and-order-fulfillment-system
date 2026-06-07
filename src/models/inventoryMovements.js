// id
// product_id
// order_id nullable
// type
// quantity
// reason
// created_at

import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "InventoryMovements",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            product_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "products",
                    key: "id",
                },
            },
            order_id: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: "orders",
                    key: "id",
                },
            },
            type: {
                type: DataTypes.ENUM("IN", "OUT"),
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            reason: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            tableName: "inventory_movements",
            timestamps: true,
            underscored: true,
        }
    );
};
