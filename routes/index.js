const router = require('express').Router();

router.use('/spotify', require('./spotify')); 
router.use('/user', require('./user'));

module.exports = router;
