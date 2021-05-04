const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { isAuthenticated } = require('../../middleware/authenticated');
const { isAuthorized } = require('../../middleware/authorized');
const { USER_TYPES } = require('../../shared/common/constant');

router.get('', controller.getAllGenres);
router.get('/:id', controller.getGenreById);
router.post('', isAuthenticated, isAuthorized({ hasRole: [USER_TYPES.ADMIN, USER_TYPES.AUTHER] }), controller.addGenre);
router.patch('/:id', isAuthenticated, isAuthorized({ hasRole: [USER_TYPES.ADMIN, USER_TYPES.AUTHER] }), controller.updateGenre);
router.delete('/:id', isAuthenticated, isAuthorized({ hasRole: [USER_TYPES.ADMIN, USER_TYPES.AUTHER] }), controller.deleteGenre);

module.exports = router;
