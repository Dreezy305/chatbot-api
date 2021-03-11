require("dotenv").config();
const config = require("../config");

const thinky = require("thinky")(config.api);
const r = thinky.r;
const type = thinky.type;

const Loan = thinky.createModel("transactions", {
  id: type.string(),
  amount: type.number().required(),
  narration: type.string().required(),
  provider: type.string().required(),
  name: type.string(),
  email: type.string().email().required(),
  dealerId: type.string(),
  bankName: type.string(),
  accountName: type.string(),
  accountNumber: type.string(),
  make: type.string(),
  model: type.string(),
  year: type.string(),
  lotNumber: type.string().required(),
  requestId: type.string(),
  interest: type.object(),
  status: type
    .string()
    .enum([
      "pending",
      "approved",
      "success",
      "failure (account blocked)",
      "failure (invalid account)",
    ])
    .default("pending"),
  createdAt: type.date().default(r.now),
  updatedAt: type.date().default(),
});

// Associations

// Loan indices
Loan.ensureIndex("id");
Loan.ensureIndex("amount");
Loan.ensureIndex("narration");
Loan.ensureIndex("lotNumber");
Loan.ensureIndex("dealerId");
Loan.ensureIndex("requestId");
Loan.ensureIndex("provider");
Loan.ensureIndex("name");
Loan.ensureIndex("email");
Loan.ensureIndex("make");
Loan.ensureIndex("model");
Loan.ensureIndex("year");
Loan.ensureIndex("bankName");
Loan.ensureIndex("accountName");
Loan.ensureIndex("accountNumber");
Loan.ensureIndex("status");
Loan.ensureIndex("createdAt");
Loan.ensureIndex("updatedAt");

module.exports = {
  r,
  Loan,
};
