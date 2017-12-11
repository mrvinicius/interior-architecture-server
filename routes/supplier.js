const Supplier = require('../models').Supplier;
const Store = require('../models').Store;

function createSupplier(supplier) {
    let creationData = {
        name: supplier.name,
        defaultEmail: supplier.defaultEmail,
        phone: supplier.phone
    };

    if (supplier.id && supplier.id.length) {
        creationData['id'] = supplier.id;
    }

    return Supplier
        .create(creationData);
}

module.exports = {
    create(req, res) {
		if (Array.isArray(req.body)) {
			console.log(req)
			return Promise
				.all(req.body.map(supplier => createSupplier(supplier)))
				.then((suppliers) => res.status(201).send(suppliers))
				.catch((error) => res.status(400).send(error));
		} else {
			return createSupplier(req.body)
				.then((supplier) => res.status(201).send(supplier))
				.catch((error) => res.status(400).send(error));
        }
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
