module.exports = (app) => {
  app.use('/v1/auther', require('./auther/routes-config'));
  app.use('/v1/genre', require('./genre/routes-config'));
  app.use('/v1/book', require('./book/routes-config'));
}