'use strict';

module.exports = (sequelize, DataTypes) => {
    const BudgetRequest = sequelize.define('BudgetRequest', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        status: {
            type: DataTypes.ENUM,
            values: ['Waiting', 'Budgeted', 'All_Budgeted'],
            allowNull: false,
            defaultValue: 'Waiting'
        },
        measureUnit: {
            type: DataTypes.ENUM,
            values: ['units', 'kg', 'measurement2d', 'measurement3d', 'liter'],
            allowNull: false
        },
        quantity: {
            type: DataTypes.STRING
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        note: {
            type: DataTypes.STRING(510)
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    BudgetRequest.associate = (models) => {
        BudgetRequest.hasMany(models.BudgetReply, {
            foreignKey: 'budgetRequestId',
            as: 'budgetReplies'
        });

        BudgetRequest.belongsTo(models.User, {
            foreignKey: 'userId',            
            as: 'sender'
        });

        BudgetRequest.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product'
        });
    }

    return BudgetRequest;
}
