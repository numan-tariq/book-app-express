const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { isAuthenticated } = require('../../middleware/authenticated');
const { isAuthorized } = require('../../middleware/authorized');
const { USER_TYPES } = require('../../shared/common/constant');

router.get('', controller.getAllAuther);
router.get('/:id', controller.getAutherByUserId);
router.post('', isAuthenticated, isAuthorized({ hasRole: [USER_TYPES.AUTHER] }), controller.addAuther);
router.patch('', isAuthenticated, isAuthorized({ hasRole: [USER_TYPES.AUTHER] }), controller.updateAuther);
router.delete('/:id', isAuthenticated, isAuthorized({ hasRole: [USER_TYPES.ADMIN], allowSameUser: true }), controller.deleteAuthor);

module.exports = router;