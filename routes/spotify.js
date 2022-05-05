const router = require('express').Router();
const ctrl = require("../controllers");

router.post("/request_auth", ctrl.spotify.requestAuth);

module.exports = router;