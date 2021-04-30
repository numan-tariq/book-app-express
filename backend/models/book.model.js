const mongoose = require('mongoose');
const { ibanRegex } = require('../shared/common/regex')
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const Book = mongoose.model('book', mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  images: [
    {
      type: String,
      required: true
    }
  ],
  iban: {
    type: String,
    minLength: 5,
    maxLength: 34,
    required: true,
    unique: true
  },
  publishedDate: {
    type: Date, 
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  },

  // Foriegn Keys
  auther: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'auther',
    required: true
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'genre',
    required: true
  }
}, { versionKey: false, timestamps: true }))

function validateAddBook(book) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    price: Joi.number().min(0).required(),
    tax: Joi.number().min(0).required(),
    discount: Joi.number().min(0).required(),
    images: Joi.array().min(0).max(5).items(Joi.string()).optional(),
    iban: Joi.string().regex(ibanRegex).required(),
    publishedDate: Joi.date().required(),
    auther: Joi.objectId().required(),
    genre: Joi.objectId().required()
  })
  return schema.validate(book);
}

function validateEditBook(book) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(30),
    price: Joi.number().min(0),
    tax: Joi.number().min(0),
    discount: Joi.number().min(0),
    images: Joi.array().min(0).max(5).items(Joi.string()).optional(),
    iban: Joi.string().regex(ibanRegex),
    publishedDate: Joi.date(),
    auther: Joi.objectId(),
    genre: Joi.objectId()
  })
  return schema.validate(book);
}

exports.validateAddBook = validateAddBook;
exports.validateEditBook = validateEditBook;
exports.Book = Book;