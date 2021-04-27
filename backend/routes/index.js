module.exports = (app) => {
  app.use('/v1/auther', require('./auther/routes-config'));
}