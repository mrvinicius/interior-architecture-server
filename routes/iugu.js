"use strict";
const env = process.env.NODE_ENV || "development";
const config = require(`${__dirname}/../config/config.json`)[env];
const iuguPackage = require("iugu");
const UserModel = require("../models").User;

let iugu;
if (config.iugu_key_env_variable) {
  iugu = iuguPackage(process.env[config.iugu_key_env_variable]);
} else {
  iugu = iuguPackage(config["iugu_key"]);
}

module.exports = {
  charge(req, res) {
    /**
     * Req:
     * userId
     * name
     * token
     */
    UserModel.findById(req.body.userId)
      .then(user => {
        if (!user) {
          let error = {};
          error.code = "user/not-found";
          error.message = "ID de usuário não encontrado";
          return res.status(404).send(error);
        }

        return user;
      })
      .then(userModel => {
        const user = userModel.dataValues;

        if (userId && userId.length) {
        } else {
          iugu.customer.create(
            {
              email: user.email,
              name: req.body.userNamel
            },
            function(err, customer) {
              err; // null se não ocorreu nenhum erro
              customer; // O objeto de retorno da criação
            }
          );
        }

        return res.status(201).send(userId);
      })
      .catch(error => res.status(400).send(error));
    // Check USER iuguCustomerId
    // Create customer
    // Create invoice
    /**
     * Charge
     * - token
     * - invoice
     * - customerId
     */
  }
};
