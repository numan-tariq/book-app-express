const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const Genre = mongoose.model('genre', mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30
  },
  icon: {
    type: String,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  }
}, { versionKey: false, timestamps: true  }))

function validateAddGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    icon: Joi.string()
  })
  return schema.validate(genre);
}

function validateEditGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30),
    icon: Joi.string()
  })
  return schema.validate(genre);
}

exports.validateAddGenre = validateAddGenre;
exports.validateEditGenre = validateEditGenre;
exports.Genre = Genre;