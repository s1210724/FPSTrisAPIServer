const express = require('express');

const router = express.Router();

const jwksController = require('../controllers/jwksController');

router.get('/', jwksController.getJWKS);

module.exports = router;