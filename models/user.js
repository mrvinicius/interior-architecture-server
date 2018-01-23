"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
        len: [1, 255]
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    iuguCustomerId: {
      type: DataTypes.STRING,
      unique: true,
    }
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

  User.associate = models => {
    User.hasMany(models.BudgetRequest, {
      foreignKey: "userId",
      as: "budgetRequests"
    });
  };

  return User;
};
