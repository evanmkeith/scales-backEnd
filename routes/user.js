const router = require('express').Router();
const ctrl = require("../controllers");

router.post("/info", ctrl.user.userInfo);

module.exports = router;