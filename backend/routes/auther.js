const express = require('express');
const router = express.Router();
const authers = require('../shared/data/author.json')

router.get('', (req, res) => {
  return res.status(200).send(authers);
})

module.exports = router;