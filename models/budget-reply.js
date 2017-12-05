'use strict';

module.exports = (sequelize, DataTypes) => {
    const BudgetReply = sequelize.define('BudgetReply', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        status: {
            type: DataTypes.ENUM,
            values: ['Waiting', 'Budgeted'],
            allowNull: false,
            defaultValue: 'Waiting'
        },
        repliedAt: {
            type: DataTypes.DATE
        },
        // availability: {
        //     type: DataTypes.BOOLEAN
        // },
        measureUnit: {
            type: DataTypes.ENUM,
            values: ['units', 'kg', 'measurement2d', 'measurement3d', 'liter']
        },
        unitPrice: {
            type: DataTypes.DECIMAL(9, 2)
        },
        totalPrice: {
            type: DataTypes.DECIMAL(9, 2)
        },
        quantity: {
            type: DataTypes.STRING
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        note: {
            type: DataTypes.STRING(510),
            allowNull: true
        }
    });

    BudgetReply.associate = (models) => {
        BudgetReply.belongsTo(models.Store, {
            foreignKey: 'storeId',
            as: 'store'
        })
    }

    return BudgetReply;
}
