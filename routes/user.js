const router = require('express').Router();
const ctrl = require("../controllers");

router.post("/info", ctrl.user.userInfo);
router.post("/edit", ctrl.user.editProfile);
router.post("/add_artist", ctrl.user.addArtist);
router.post("/remove_artist", ctrl.user.removeArtist);
router.post("/destroy", ctrl.user.destroy);

module.exports = router;