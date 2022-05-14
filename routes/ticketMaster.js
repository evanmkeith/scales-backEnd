const router = require('express').Router();
const ctrl = require("../controllers");

router.post('/events', ctrl.ticketmaster.getTourInfo);

module.exports = router;