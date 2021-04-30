const { Auther } = require('./auther.model');
const { Genre } = require('./genre.model');
const { Book } = require('./book.model');
const { Customer } = require('./cutomer.model');
const { Order } = require('./order.model');
const { PaymentType } = require('./payment-type.model');
const { User } = require('./user.model');


module.exports = { Auther, Genre, Book, Customer, Order, PaymentType, User };