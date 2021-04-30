const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const Order = mongoose.model('order', mongoose.Schema({
  discount: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  },

  // Child collection
  items: [
    {
      price: {
        type: Number,
        required: true
      },
      tax: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        min: 1,
        required: true
      },
      discount: {
        type: Number,
        required: true
      },

      //Foriegn Keys
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book',
        required: true
      }
    }
  ],

  // Foriegn Keys
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer',
    required: true
  },
  paymentType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'paymentType',
    required: true
  }
}, { versionKey: false, timestamps: true }))

function validateAddOrder(order) {
  const schema = Joi.object({
    discount: Joi.number().min(0),
    items: Joi.array().items(Joi.object().keys({
      price: Joi.number().min(0).required(),
      tax: Joi.number().min(0).required(),
      quantity: Joi.number().min(1).required(),
      discount: Joi.number().min(0).required(),
      book: Joi.objectId().required()
    })),
    customer: Joi.objectId().required(),
    paymentType: Joi.objectId().required()
  })
  return schema.validate(order);
}

function validateEditOrder(order) {
  const schema = Joi.object({
    discount: Joi.number().min(0),
    items: Joi.array().items(Joi.object().keys({
      price: Joi.number().min(0).required(),
      tax: Joi.number().min(0).required(),
      quantity: Joi.number().min(1).required(),
      discount: Joi.number().min(0).required(),
      book: Joi.objectId().required()
    })),
    customer: Joi.objectId(),
    paymentType: Joi.objectId()
  })
  return schema.validate(order);
}

exports.validateAddOrder = validateAddOrder;
exports.validateEditOrder = validateEditOrder;
exports.Order = Order;