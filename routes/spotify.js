const router = require('express').Router();
const ctrl = require("../controllers");

router.post("/request_auth", ctrl.spotify.requestAuth);
router.post("/get_token", ctrl.spotify.getToken);
router.post("/create_play_list", ctrl.spotify.createSpotifyPlaylist);
router.post("/get_play_list", ctrl.spotify.getPlaylist);

module.exports = router;