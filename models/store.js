'use strict';

module.exports = (sequelize, DataTypes) => {
    const Store = sequelize.define('Store', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: true
        },
        state: {
            type: DataTypes.STRING(3),
        },
        city: {
            type: DataTypes.STRING,
        },
        neighborhood: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING(20)
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    });

    Store.associate = (models) => {
        Store.hasMany(models.BudgetReply, {
            foreignKey: 'storeId',
            as: 'budgetReplies'
        });
    }

    return Store;
};
