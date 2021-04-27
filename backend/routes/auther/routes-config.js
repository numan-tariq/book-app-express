const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('', controller.getAllAuther);
router.get('/:id', controller.getAutherById);
router.post('', controller.addAuther);
router.patch('/:id', controller.updateAuther);
router.delete('/:id', controller.deleteAuthor);

module.exports = router;