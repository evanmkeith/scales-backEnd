const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
    artist: String, 
    seenLive: Boolean
})

const userSchema = new mongoose.Schema(
    {
        name: String, 
        spotifyId: String,
        img: String,
        artists: [concertSchema],
        accessToken: String, 
        refreshToken: String
    }, 
    {
        timestamps: true
    }
)

module.exports = mongoose.model('users', userSchema)