"use strict";

module.exports = (sequelize, DataTypes) => {
    const Supplier = sequelize.define('Supplier', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        defaultEmail: {
            type: DataTypes.STRING(40),
            allowNull: false
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

    Supplier.associate = (models) => {
        Supplier.hasMany(models.Store, {
            foreignKey: 'supplierId',
            as: 'stores'
        });

        Supplier.hasMany(models.Product, {
            foreignKey: 'supplierId',
            as: 'products'
        });
    }

    return Supplier;
}
