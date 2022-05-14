const axios = require('axios');
const db = require('../models'); 

const userInfo = async(req, res) => {
    await db.User.findById(req.body.id).then( (response) => {
        const image = response.image ? response.img : 'https://picsum.photos/200/200?grayscale';

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
            const image = res.image ? res.img : 'https://picsum.photos/200/200?grayscale';

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

}

const destroy = async(req, res) => {

}

module.exports = {
    userInfo,
    editProfile,
    addArtist, 
    destroy
  }