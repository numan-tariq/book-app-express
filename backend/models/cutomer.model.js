const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const Customer = mongoose.model('customer', new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30
  },
  lastName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30
  },
  profilePic: {
    type: String,
    default: ''
  },
  dob: {
    type: Date,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  },

  // Foriegn Keys
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
},{ versionKey: false, timestamps: true }))

function validateAddCustomer(customer) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    profilePic: Joi.string().min(0),
    dob: Joi.date().required(),
    user: Joi.objectId().required()
  })
  return schema.validate(customer);
}

function validateEditCustomer(customer) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(30),
    lastName: Joi.string().min(3).max(30),
    profilePic: Joi.string().min(0),
    dob: Joi.date().required(),
    user: Joi.objectId()
  })
  return schema.validate(customer);
}

exports.validateAddCustomer = validateAddCustomer;
exports.validateEditCustomer = validateEditCustomer;
exports.Customer = Customer;