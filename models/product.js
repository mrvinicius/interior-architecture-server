'use strict';

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        // // It is possible to create foreign keys:
        // supplierId: {
        //     type: DataTypes.UUID,
        //     references: {
        //         // This is a reference to another model
        //         model: Supplier,

        //         // This is the column name of the referenced model
        //         key: 'id',

        //         // This declares when to check the foreign key constraint. PostgreSQL only.
        //         deferrable: DataTypes.Deferrable.NOT
        //     }
        // }
    });

    Product.associate = (models) => {
        Product.hasMany(models.BudgetRequest, {
            foreignKey: 'productId'
        });

        Product.belongsTo(models.Supplier, {
            foreignKey: 'supplierId',
            as: 'supplier'
        })
    }

    return Product;
}
