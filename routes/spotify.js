const router = require('express').Router();
const { route } = require('express/lib/application');
const ctrl = require("../controllers");

router.post("/request_auth", ctrl.spotify.requestAuth);
router.post("/get_token", ctrl.spotify.getToken);
router.post("/get_user_spotify_profile", ctrl.spotify.getUserSpotifyProfile);

module.exports = router;