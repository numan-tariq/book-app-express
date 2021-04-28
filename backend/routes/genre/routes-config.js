const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('', controller.getAllGenres);
router.get('/:id', controller.getGenreById);
router.post('', controller.addGenre);
router.patch('/:id', controller.updateGenre);
router.delete('/:id', controller.deleteGenre);

module.exports = router;
