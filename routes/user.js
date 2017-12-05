'use strict';

const User = require('../models').User;

module.exports = {
  create(req, res) {
    let creationData = {
      email: req.body.email,
      name: req.body.name,
      lastname: req.body.lastname,
    },
      error = null;

    if (req.body.id !== undefined) {
      if (!req.body.id.length) {
        error = {};
        error.code = 'user/empty-id';
        error.message = 'O ID do novo usuário está vazio';
        return res.status(400).send({ error: error });
      }

      creationData.id = req.body.id;
    }

    return User
      .create(creationData)
      .then((user) => res.status(201).send(user))
      .catch((error) => res.status(400).send(error));
  },
  getOne(req, res) {
    return User
      .findById(req.query.id)
      .then((user) => {
        if (!user) {
          let error = {};
          error.code = 'user/not-found';
          error.message = 'ID de usuário não encontrado';
          // throw { error: error };
          return res.status(404).send({ error: error });
        }

        res.status(200).send(user);
      })
      .catch((error) => res.status(400).send(error))

  }
}