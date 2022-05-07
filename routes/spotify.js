const router = require('express').Router();
const ctrl = require("../controllers");

router.post("/request_auth", ctrl.spotify.requestAuth);
router.post("/get_token", ctrl.spotify.getToken);

module.exports = router;