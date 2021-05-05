const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/profile', controller.getProfile);

module.exports = router;