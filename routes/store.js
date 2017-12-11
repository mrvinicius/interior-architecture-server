const Store = require('../models').Store;

function createStore(store) {
	return Store
		.create({
			name: store.name,
			email: store.email,
			state: store.state,
			city: store.city,
			neighborhood: store.neighborhood,
			address: store.address,
			phone: store.phone,
			supplierId: store.supplierId
		});
}

module.exports = {
	create(req, res) {
		if (Array.isArray(req.body)) {
			console.log(req)
			return Promise
				.all(req.body.map(store => createStore(store)))
				.then((stores) => res.status(201).send(stores))
				.catch((error) => res.status(400).send(error));
		} else {
			return createStore(req.body)
				.then((store) => res.status(201).send(store))
				.catch((error) => res.status(400).send(error));
		}
	},
	getAll(req, res) {
		let findAllQuery = {
			order: [
				['createdAt', 'DESC']
			]
		};

		if (req.query.supplierId) {
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