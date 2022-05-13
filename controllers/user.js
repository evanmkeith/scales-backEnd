const axios = require('axios');
const db = require('../models'); 

const userInfo = async(req, res) => {
    await db.User.findById(req.body.id).then((response) => {
        const user = {
            userId: response._id,
            accessToken: response.accessToken
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

module.exports = {
    userInfo,

  }