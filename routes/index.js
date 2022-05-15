const router = require('express').Router();

router.use('/spotify', require('./spotify')); 
router.use('/user', require('./user'));
router.use('/ticketmaster', require('./ticketMaster'));

module.exports = router;
