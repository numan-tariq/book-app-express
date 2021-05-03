const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const PaymentType = mongoose.model('paymentType', mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30
  },
  active: {
    type: Boolean,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },  
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  }
}, { versionKey: false, timestamps: true }))

function validateAddPaymentType(paymentType) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    active: Joi.boolean().required(),
    discount: Joi.number().min(0).required()
  })
  return schema.validate(paymentType);
}

function validateEditPaymentType(paymentType) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30),
    active: Joi.boolean(),
    discount: Joi.number().min(0)
  })
  return schema.validate(paymentType);
}

exports.validateAddPaymentType = validateAddPaymentType;
exports.validateEditPaymentType = validateEditPaymentType;
exports.PaymentType = PaymentType;