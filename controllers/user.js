const axios = require('axios');
const db = require('../models'); 

const userInfo = async(req, res) => {
    await db.User.findById(req.body.id).then( (response) => {
        const image = response.img ? response.img : 'https://picsum.photos/200/200?grayscale';

        const user = {
            name: response.name,
            img: image, 
            artists: response.artists
        }

        return res.status(200).json({
            status: 200,
            message: 'Received user',
            user
            });
    }).catch((error) => {
        console.log(error)
    })
};

const editProfile = async(req, response) => {
    await db.User.findByIdAndUpdate(
        req.body.id, 
        req.body.body, 
        {new: true}).then(
        (res) => {
            const image = res.img ? res.img : 'https://picsum.photos/200/200?grayscale';

            const updatedUser = {
                name: res.name, 
                img: image, 
                artists: res.artists
            }
            return response.status(200).json({
                message: "Updated User", 
                updatedUser
            })
        }).catch((err) => { 
            console.log(err);
        })
}

const addArtist = async(req, res) => {
    await db.User.findByIdAndUpdate(req.body.id, {
        $addToSet: { artists: {artist: req.body.artist}}
    }).then((user) => {
        return res.status(200).json({
            message: "added artist", 
        })
    }).catch((err) => {
        console.log(err);
    })
}

const removeArtist = async(req, res) => {
    await db.User.updateOne({_id: req.body.id}, {
        $pull: {'artists': {'_id': req.body.artistId}}
    }).then((user) => {
        return res.status(200).json({
            message: "Removed artist", 
        })
    }).catch((err) => {
        console.log(err);
    })
}

const destroy = async(req, response) => {
    await db.User.findByIdAndDelete(req.body.id).then((res) => {
        return response.status(200).json({
            message: "User Destroyed", 
            res
        })
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = {
    userInfo,
    editProfile,
    addArtist, 
    destroy, 
    removeArtist
  }