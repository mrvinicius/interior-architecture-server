const Product = require('../models').Product;

module.exports = {
    create(req, res) {
        return Product
            .create({
                name: req.body.name,
                supplierId: req.body.supplierId
            })
            .then((product) => res.status(201).send(product))
            .catch((error) => res.status(400).send(error));
    },
    getAll(req, res) {
        let findAllQuery = {
            order: [
                ['name', 'DESC']
            ]
        };

        if (req.query.supplierId !== undefined) {
            findAllQuery.where = {
                supplierId: req.query.supplierId
            }
        }

        return Product
            .findAll(findAllQuery)
            .then((products) => res.status(200).send(products))
            .catch((error) => res.status(400).send(error));
    },
    update(req, res) {

    },
    destroy(req, res) {

    }
};
