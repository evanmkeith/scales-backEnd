const router = require('express').Router();
const ctrl = require("../controllers");

router.use('/spotify', require('./spotify'))

module.exports = router;