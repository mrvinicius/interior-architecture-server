const BudgetReplyModel = require("../models").BudgetReply;
const BudgetRequestModel = require("../models").BudgetRequest;

function updateRequestStatus(budgetRequestId) {
  let findOneQuery = {
    where: {
      id: budgetRequestId
    },
    attributes: ["id"],
    include: [
      {
        model: BudgetReplyModel,
        as: "budgetReplies",
        attributes: ["status"]
      }
    ]
  };

  return BudgetRequestModel.findOne(findOneQuery).then(budgetReq => {
    let replies = budgetReq.dataValues.budgetReplies,
      firstBudgetedIndex,
      status = "Waiting";
    console.log(budgetReq);
    console.log("STATUUUUS", budgetReq.dataValues.status);
    firstBudgetedIndex = replies.findIndex(val => {
      console.log(val.dataValues.status);
      return val.dataValues.status === "Budgeted";
    });

    if (firstBudgetedIndex > -1) status = "Budgeted";

    if (firstBudgetedIndex === 0) {
      let isEveryBudgeted = replies.every((val, index) => {
        return val.dataValues.status === "Budgeted";
      });

      if (isEveryBudgeted) status = "All_Budgeted";
    }

    return budgetReq.update({
      status: status
    });
  });
}

module.exports = {
  update(req, res) {
    return BudgetReplyModel.findById(req.body.id).then(budgetReply => {
      let updateQuery;

      if (!budgetReply) {
        let error = {};
        error.code = "budget-reply/not-found";
        error.message = "ID de Resposta de orçamento não encontrado";
        return res.status(404).send(error);
      }

      updateQuery = {
        repliedAt: new Date(),
        availability: req.body.availability,
        status: req.body.status,
        unitPrice: req.body.unitPrice,
        totalPrice: req.body.totalPrice,
        color: req.body.colors,
        note: req.body.note
      };

      return budgetReply
        .update(updateQuery)
        .then(() => {
          if (req.body.status) {
            updateRequestStatus(budgetReply.budgetRequestId);
          }
          return res.status(204).send();
        })
        .catch(error => res.status(400).send(error));
    });
  }
};
