"use strict";

const User = require("../models").User;

module.exports = {
  create(req, res) {
    let creationData = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      },
      error = null;

    if (req.body.id !== undefined) {
      if (!req.body.id.length) {
        error = {};
        error.code = "user/empty-id";
        error.message = "O ID do novo usuário está vazio";
        return res.status(400).send(error);
      }

      creationData.id = req.body.id;
    }

    return User.create(creationData)
      .then(user => res.status(201).send(user))
      .catch(error => {
        if (
          error.name === "SequelizeUniqueConstraintError" &&
          error.fields.email
        ) {
          error = {};
          error.code = "user/existent-email";
          error.message = `O email ${creationData.email} já está cadastrado`;
        }

        return res.status(400).send(error);
      });
  },
  getOne(req, res) {
    return User.findById(req.query.id)
      .then(user => {
        if (!user) {
          let error = {};
          error.code = "user/not-found";
          error.message = "ID de usuário não encontrado";
          return res.status(404).send(error);
        }

        return res.status(200).send(user);
      })
      .catch(error => res.status(400).send(error));
  },
  login(req, res) {
    return User.findOne({
      where: {
        email: req.body.email,
        password: req.body.password
      }
    })
      .then(user => {
        if (!user) {
          let error = {};
          error.code = "user/not-found";
          error.message = "Email ou senha incorretos";
          return res.status(404).send(error);
        }

        return res.status(200).send(user);
      })
      .catch(error => {
        console.log(error);
        return res.status(401).send(error);
      });
  },
  update(req, res) {
    return User.findById(req.body.id)
      .then(user => {
        let updateQuery;

        if (!user) {
          let error = {};
          error.code = "user/not-found";
          error.message = "ID de Usuário não encontrado";
          return res.status(404).send(error);
        }

        updateQuery = req.body.changes;
        updateQuery.repliedAt = new Date();

        if (updateQuery.password) {
          delete updateQuery.password;
        }

        return user
          .update(updateQuery)
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
  getAll(req, res) {
    let findAllQuery = {
      order: [
        ["createdAt", "DESC"]
      ],
      where: {}
    };

    return User.findAll(findAllQuery)
    .then(users => res.status(200).send(users))
    .catch(error => res.status(400).send(error));
  }
};
