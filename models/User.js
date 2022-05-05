const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
    artist: String, 
    seenLive: Boolean
})

const userSchema = new mongoose.Schema({
    name: String, 
    spotifyId: String,
    artists: [concertSchema],
})

module.exports = mongoose.model('users', userSchema)