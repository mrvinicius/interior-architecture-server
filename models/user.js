'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
            validate: {
                isEmail: true,
                notEmpty: true,
                len: [1,255]
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING
        }
        // password: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        // },
        // confirmed: {
        //     type: DataTypes.BOOLEAN,
        //     allowNull: false,
        //     defaultValue: false
        // },
        // ocupation: {
        //     type: DataTypes.ENUM,
        //     values: ['EST', 'ARQ', 'DES']
        // }
    });

    User.associate = (models) => {
        User.hasMany(models.BudgetRequest, {
            foreignKey: 'userId',
            as: 'budgetRequests'
        });
    }

    return User;
}
