const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('', controller.getAllBooks);
router.get('/:id', controller.getBookById);
router.get('/auther/:id', controller.getAllBooksOfAnAuthor);
router.get('/genre/:id', controller.getAllBooksByGenre);
router.post('', controller.addBook);
router.patch('/:id', controller.updateBook);
router.delete('/:id', controller.deleteBook);

module.exports = router;