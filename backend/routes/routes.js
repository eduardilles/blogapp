const express = require('express');
const router = express.Router();

router.use('/api', require('../api/api-articles-v1'));

module.exports = router;