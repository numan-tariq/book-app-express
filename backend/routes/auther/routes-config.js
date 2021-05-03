const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { isAuthenticated } = require('../../middleware/authenticated')
const { isAuthorized } = require('../../middleware/authorized')
const { USER_TYPES } = require('../../shared/common/constant')

router.get('', controller.getAllAuther);
router.get('/:id', isAuthenticated, isAuthorized({ hasRole: [USER_TYPES.ADMIN], allowSameUser: true }), controller.getAutherById);
router.post('', controller.addAuther);
router.patch('/:id', controller.updateAuther);
router.delete('/:id', controller.deleteAuthor);

module.exports = router;