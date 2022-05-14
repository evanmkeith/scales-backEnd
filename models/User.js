const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    artist: String, 
})

const userSchema = new mongoose.Schema(
    {
        name: String, 
        spotifyId: String,
        img: String,
        artists: [artistSchema],
        accessToken: String, 
        refreshToken: String, 
        playlistId: String
    }, 
    {
        timestamps: true
    }
)

module.exports = mongoose.model('users', userSchema)