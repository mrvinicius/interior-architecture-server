const Store = require('../models').Store;

module.exports = {
	create(req, res) {
		return Store
			.create({
				name: req.body.name,
				email: req.body.email,
				phone: req.body.phone,
				supplierId: req.body.supplierId
			})
			.then((store) => res.status(201).send(store))
			.catch((error) => res.status(400).send(error));
	},
	getAll(req, res) {
		let findAllQuery = {
			order: [
				['createdAt', 'DESC']
			]
		};

		if (req.query.supplierId !== undefined) {
			findAllQuery.where = {
				supplierId: req.query.supplierId
			}
		}

		return Store
			.findAll(findAllQuery)
			.then((stores) => res.status(200).send(stores))
			.catch((error) => res.status(400).send(error));
	},
	update(req, res) {

	},
	destroy(req, res) {

	}
};