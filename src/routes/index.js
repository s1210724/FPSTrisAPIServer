const express = require('express');

const router = express.Router();

const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const jwksRoutes = require('./jwksRoutes');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/.well-known/jwks.json', jwksRoutes);

module.exports = router;