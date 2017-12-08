'use strict';
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];
const nodemailer = require('nodemailer');
const Email = require('email-templates');

const Model = require('../models');
const BudgetRequestModel = Model.BudgetRequest;
const BudgetReplyModel = Model.BudgetReply;
const ProductModel = Model.Product;
const StoreModel = Model.Store;
const UserModel = Model.User;
const SupplierModel = Model.Supplier;

const smtpTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'atendimento@archabox.com.br',
    pass: 'Casacor2015'
  }
});

const email = new Email({
  message: {
    from: 'atendimento@archabox.com.br'
  },
  send: true,
  transport: smtpTransporter
});

function createProduct(name, supplierId, productModel) {
  return productModel.create({
    name: name,
    supplierId: supplierId
  });
}

function createBudgetRequest(budgetRequestData, productId, budgetReqModel) {
  budgetRequestData.quantity = budgetRequestData.quantity.toString();

  return budgetReqModel.create({
    userId: budgetRequestData.userId,
    measureUnit: budgetRequestData.measureUnit,
    quantity: budgetRequestData.quantity,
    color: budgetRequestData.color,
    note: budgetRequestData.note,
    productId: productId
  });
}

function createBudgetReply(budgetReqId, storeId, replyModel) {
  return replyModel.create({
    storeId: storeId,
    budgetRequestId: budgetReqId
  });
}

function getOneProduct(id) {
  return ProductModel.findById(id);
}

function getMailerTransporter() {
  // nodemailer.createTransport({
  //   transport: '',
  //   accessKeyId: '',
  //   secretAccessKey: ''
  // })
  return nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
      user: 'atendimento@archabox.com.br',
      pass: 'Casacor2015'
    }
  });
}

function getOneStore(id) {
  return StoreModel.findById(id);
}

function sendBudgetRequestEmail(store, replyId) {


  return email.send({
    template: 'budget-request',
    message: {
      to: store.email
    },
    locals: {
      replyPageUrl: `${config.baseUrl}/fornecedor/orcamento/${replyId}`
    }
  })
}

function getOneReply(id) {
  return BudgetReplyModel.findById(id);
}

function getUser(id) {

}

module.exports = {
  sendRequest(req, res) {
    let error = null;

    // Check User ID
    if (req.body.userId === undefined || !req.body.userId.length) {
      error = {};
      error.code = 'user/null-id';
      error.message = 'Envie o ID do usuário';
      return res.status(400).send({ error: error });
    }

    // Check Supplier ID
    if (req.body.supplierId === undefined || !req.body.supplierId.length) {
      error = {};
      error.code = 'supplier/null-id';
      error.message = 'Você não enviou o ID do Fornecedor';
      return res.status(400).send({ error: error });
    }

    // Check Stores length and IDs
    if (req.body.storeIds !== undefined && req.body.storeIds.length) {
      for (let id of req.body.storeIds) {
        if (!id || !id.length) {
          error = {};
          error.code = 'store/empty-id';
          error.message = 'Um dos IDs de Ponto de Venda é inválido';
          return res.status(400).send({ error: error });
          // break;
        }
      }
    } else {
      error = {};
      error.code = 'store/no-length';
      error.message = 'Envie o ID de pelo menos um Ponto de Venda';
      return res.status(400).send({ error: error });
    }

    if (req.body.product.id !== undefined && req.body.product.id.length) {
      let creatingBudgetReq = createBudgetRequest(req.body, req.body.product.id, BudgetRequestModel);
      let creatingBudgetReplies = creatingBudgetReq.then(budgetRequest =>
        Promise.all(req.body.storeIds.map(id =>
          createBudgetReply(budgetRequest.id, id, BudgetReplyModel)
        ))
      );

      return Promise.all([creatingBudgetReq, creatingBudgetReplies])
        .then(values => {
          let budgetRequest = values[0],
            replies = values[1];

          replies.forEach(reply => {
            getOneStore(reply.storeId)
              .then(store => sendBudgetRequestEmail(store, reply.id))
              .then(console.log)
              .catch(console.error);
          });

          return res.status(201).send({
            budgetRequest: budgetRequest,
            budgetReplies: replies
          });
        })
        .catch(error => res.status(400).send(error));
    } else if (req.body.isNewProduct) {
      // Add product by supplier
      let creatingProduct = createProduct(req.body.product.name, req.body.supplierId, ProductModel);
      let creatingBudgetReq = creatingProduct.then(product =>
        createBudgetRequest(req.body, product.id, BudgetRequestModel));
      let creatingBudgetReplies = creatingBudgetReq.then(budgetRequest =>
        Promise.all(req.body.storeIds.map(id =>
          createBudgetReply(budgetRequest.id, id, BudgetReplyModel)
        ))
      );

      return Promise.all([creatingProduct, creatingBudgetReq, creatingBudgetReplies])
        .then(values => {
          let budgetRequest = values[1],
            product = values[0],
            replies = values[2];

          replies.forEach(reply => {
            getOneStore(reply.storeId)
              .then(store => sendBudgetRequestEmail(store, reply.id))
              .then(console.log)
              .catch(console.error);
          });

          return res.status(201).send({
            budgetRequest: budgetRequest,
            product: product,
            budgetReplies: replies
          });
        })
        .catch(error => res.status(400).send(error));
    }
  },
  getAll(req, res) {
    let findAllQuery = {
      include: [
        {
          model: BudgetReplyModel,
          as: 'budgetReplies',
          include: [{
            model: StoreModel,
            as: 'store'
          }]
        },
        {
          model: ProductModel,
          as: 'product',
          attributes: ['id', 'name'],
          include: [{
            model: SupplierModel,
            as: 'supplier'
          }]
        }
      ],
      order: [
        ['status', 'DESC'],
        ['createdAt', 'DESC'],
        [{ model: BudgetReplyModel, as: 'budgetReplies' }, 'createdAt', 'DESC']
      ],
      where: {}
    };

    if (req.query.userId !== undefined) {
      findAllQuery.where.userId = req.query.userId;
    }

    if (req.query.disabledToo === undefined || req.query.disabledToo === 'false') {
      findAllQuery.where.disabled = false;
    }

    return BudgetRequestModel
      .findAll(findAllQuery)
      .then(requests => res.status(200).send(requests))
      .catch(error => res.status(400).send(error));

    //   .then(requests => {
    //   // requests.map(req => {
    //   //   getOneProduct(req.productId).
    //   //   // getOneProduct(req.productId)
    //   // })
    //   let a = Promise.all(requests.map(r => Promise.resolve(r)));

    //   let b = Promise.all(requests.map(req =>
    //     getOneProduct(req.productId)
    //   ));

    //   return Promise.all([a, b]);

    //   // return requests.map(req => {
    //   //   return Promise.all([Promise.resolve(req), getOneProduct(req.productId)])
    //   // })
    //   // return requests.map(req =>
    //   //   getOneProduct(req.productId).then(product => req.product = product)
    //   // )
    //   // Promise.all(requests.map(request =>
    //   //   getOneProduct(request.productId)
    //   // ))
    // })
    //   .then(values => {
    //     let reqs = values[0],
    //       products = values[1];

    //     for (let i = 0, length = reqs.length; i < length; i++) {
    //       reqs[i].product = products[i];
    //     }

    //     res.status(200).send(reqs)
    //   })
    //   .catch(error => res.status(400).send(error));

    // return BudgetRequestModel
    //   .findAll(findAllQuery)
    //   .then(budgetRequests => res.status(200).send(budgetRequests))
    //   .catch(error => res.status(400).send(error));
  },
  disable(req, res) {
    return BudgetRequestModel
      .findById(req.body.id)
      .then(budgetReq => {
        if (!budgetReq) {
          let error = {};
          error.code = 'budget-request/not-found';
          error.message = 'ID de Solicitação de orçemnto não encontrado';
          return res.status(404).send(error);
        }

        return budgetReq
          .update({
            disabled: true
          })
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error))
      })
  },
  getByReply(req, res) {
    return BudgetRequestModel
      .findOne({
        include: [
          {
            model: BudgetReplyModel,
            as: 'budgetReplies',
            where: {
              id: req.params.replyId
            },
            attributes: [
              'id',
              'status',
              'repliedAt',
              'measureUnit',
              'unitPrice',
              'totalPrice',
              'quantity',
              'color',
              'note'
            ]
          },
          {
            model: UserModel,
            as: 'sender',
            attributes: ['id', 'email', 'name']
          },
          {
            model: ProductModel,
            as: 'product'
          }
        ]
      })
      .then(budgetRequest => res.status(201).send(budgetRequest))
      .catch(error => res.status(400).send(error));


    // return getOneReply(req.params.replyId)
    //   .then(reply => {
    //     budgetReply = reply;
    //     return BudgetRequestModel.findById(reply.budgetRequestId);
    //   })
    //   .then(req => {
    //     budgetRequest = req;
    //     return UserModel.findById(req.userId);
    //   })
    //   .then(user => {
    //     let bReqData = budgetRequest.dataValues;
    //     bReqData.sender = user.dataValues;
    //     bReqData.budgetReplies = [budgetReply.dataValues];
    //     return res.status(200).send(bReqData)
    //   })
    //   .catch(error => res.status(400).send(error));
  }
}
