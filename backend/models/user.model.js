const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const User = mongoose.model('user', mongoose.Schema({
  userType: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  }
}, { versionKey: false, timestamps: true }))

function validateSignup(user) {
  const schema = Joi.object({
    userType: Joi.number().min(2).max(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(24).required()
  })
  return schema.validate(user);
}

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required()
  })
  return schema.validate(user);
}

exports.validateLogin = validateLogin;
exports.validateSignup = validateSignup;
exports.User = User;