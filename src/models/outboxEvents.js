// id
// event_type
// aggregate_type
// aggregate_id
// payload
// status
// attempts
// created_at
// processed_at

import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "OutboxEvents",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            event_type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            aggregate_type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            aggregate_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            payload: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("PENDING", "PROCESSING", "SUCCESS", "FAILED"),
                allowNull: false,
            },
            attempts: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            processed_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: "outbox_events",
            timestamps: true,
            underscored: true,
        }
    );
};
