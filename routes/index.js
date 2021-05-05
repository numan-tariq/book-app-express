const { isAuthenticated } = require('../middleware/authenticated')

module.exports = (app) => {
  app.use('/v1/auther', require('./auther/routes-config'));
  app.use('/v1/genre', require('./genre/routes-config'));
  app.use('/v1/book', require('./book/routes-config'));
  app.use('/v1/auth', require('./auth/routes-config'));
  app.use('/v1/customer', require('./customer/routes-config'));
  app.use('/v1/paymentType', require('./payment-type/routes-config'));
  app.use('/v1/order', require('./order/routes-config'));
  app.use('/v1/user', isAuthenticated, require('./user/routes-config'));
}