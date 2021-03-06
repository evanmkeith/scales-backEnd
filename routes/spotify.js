const router = require('express').Router();
const ctrl = require("../controllers");

router.post("/request_auth", ctrl.spotify.requestAuth);
router.post("/get_token", ctrl.spotify.getToken);
router.post("/create_play_list", ctrl.spotify.createSpotifyPlaylist);
router.post("/get_play_list", ctrl.spotify.getPlaylist);
router.post("/remove_track", ctrl.spotify.removeTrack);
router.post("/search", ctrl.spotify.searchAlbums);
router.post("/add_track", ctrl.spotify.addTrack);
router.post("/get_album_tracks", ctrl.spotify.getAlbumTracks);

module.exports = router;