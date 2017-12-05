const Supplier = require('../models').Supplier;
const Store = require('../models').Store;

module.exports = {
    create(req, res) {
        return Supplier
            .create({
                name: req.body.name,
                defaultEmail: req.body.defaultEmail,
                phone: req.body.phone
            })
            .then((supplier) => res.status(201).send(supplier))
            .catch((error) => res.status(400).send(error));
    },
    getAll(req, res) {
        return Supplier
            .findAll({
                include: [{
                    model: Store,
                    as: 'stores'
                }],
                order: [
                    ['createdAt', 'DESC'],
                    [{ model: Store, as: 'stores' }, 'createdAt', 'DESC']
                ]
            })
            .then((suppliers) => res.status(200).send(suppliers))
            .catch((error) => res.status(400).send(error));
    },
    update(req, res) {

    },
    destroy(req, res) {

    }
};
