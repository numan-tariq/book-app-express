const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { isAuthenticated } = require('../../middleware/authenticated');
const { isAuthorized } = require('../../middleware/authorized');
const { USER_TYPES } = require('../../shared/common/constant');

router.get('', controller.getAllBooks);
router.get('/:id', controller.getBookById);
router.get('/auther/:id', controller.getAllBooksOfAnAuthor);
router.get('/genre/:id', controller.getAllBooksByGenre);
router.post('', isAuthenticated, isAuthorized({hasRole: [USER_TYPES.ADMIN, USER_TYPES.AUTHER]}), controller.addBook);
router.patch('/:id', isAuthenticated, isAuthorized({hasRole: [USER_TYPES.ADMIN, USER_TYPES.AUTHER]}), controller.updateBook);
router.delete('/:id', isAuthenticated, isAuthorized({hasRole: [USER_TYPES.ADMIN, USER_TYPES.AUTHER]}), controller.deleteBook);

module.exports = router;