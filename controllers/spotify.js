const axios = require('axios'); 
const Buffer = require('buffer/').Buffer
const db = require('../models'); 
const jwt = require('jsonwebtoken');
const { use } = require('express/lib/router');

const requestAuth = (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID; 
  const redirectUrl = process.env.SPOTIFY_REDIRECT_URL;

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}&scope=user-follow-read playlist-modify-private user-read-private`;
  
  return res.status(200).json({
    status: 200,
    message: 'Success!',
    authUrl
  });
};

const getToken = async(req, response) =>{
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const clientId = process.env.SPOTIFY_CLIENT_ID; 
  const redirectUrl = process.env.SPOTIFY_REDIRECT_URL;

  const body = `grant_type=authorization_code&code=${req.body.code}&redirect_uri=${redirectUrl}`;

  await axios.post('https://accounts.spotify.com/api/token', body, {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'), 
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then((res) => {
    const accessToken = res.data.access_token
    const refreshToken = res.data.refresh_token
    return getUserSpotifyProfile(req, response, accessToken, refreshToken);
  })
  .catch((error) => {
    console.log(error);
  });
};

const getUserSpotifyProfile = async(req, response, accessToken, refreshToken) => {
  await axios.get('https://api.spotify.com/v1/me', {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type' : 'application/json'
      }
    }).then((res) => {
      console.log('User Spotify Profile: ', res.data);
      const spotifyUser = res.data;
      return findUserAccount(req, response, spotifyUser, accessToken, refreshToken);
    }).catch((error) => {
    console.log(error);
      if(error.request.status === 401){
        console.log(error);
        console.log('refreshing token');
        refreshAuthToken();
        return getUserSpotifyProfile();
      } else{
        console.log("Error Message:\n ", error);
      }
    });
};

const findUserAccount = async(req, response, spotifyUser, accessToken, refreshToken) => {
  await db.User.find({spotifyId: spotifyUser.id}, (err, foundUser) => {
    if( foundUser.length > 0 ) { 
      db.User.findByIdAndUpdate(foundUser[0]._id, {
        $set: {
          accessToken: accessToken, 
          refreshToken: refreshToken
        }
      }, 
      {new: true}, 
      (err, updatedUser) => {
        console.log(err); 
        console.log(updatedUser);
      }
      ) 
      const token = jwt.sign({userId:  foundUser[0]._id}, "pestocat", {expiresIn: '6h'});
      return response.status(200).json({
          status: 200,
          message: 'Success!',
          token
        });

    } else {
        db.User.create({
          name : spotifyUser.display_name, 
          spotifyId: spotifyUser.id,
          accessToken: accessToken, 
          refreshToken: refreshToken
        },
        (err, createdUser) => {
          if(err){ 
            return err
          }
          return  createdUser
        })
      }
    })
}

const refreshAuthToken = async() => {
      let refreshToken;
      const body = `grant_type=refresh_token&refresh_token=${refreshToken}`;
      await axios.post('https://accounts.spotify.com/api/token', body, {
        headers: { 
          'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then((res) => {
        console.log(res);
        accessToken = res.data.access_token; 
      })
      .catch((error) => {
        console.log(error)
      })
    }

const decodeJwt = (token) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  const id = JSON.parse(jsonPayload);

  return id
}


const createSpotifyPlaylist = async(req, response) => {
  const token = req.body.token;
  const userId = decodeJwt(token);
  const data = {
    "name": "Scales App", 
    "description": "Playlist made and managed by your Scales app account.",
    "public": false
  };


  await db.User.findById(userId.userId).then(async(res) => {
    const user = res
    if(!user.playlistId){
      await axios.post(`https://api.spotify.com/v1/users/${user.spotifyId}/playlists`, data, {
        headers: { 
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then( async(res) => {
        await db.User.findByIdAndUpdate(user._id, {playlistId: res.data.id}, (err, updatedUser) => {
          if(err){
            console.log(err);
          } else {
            console.log(updatedUser);
          }
        })
        console.log("Created Playlist: ",res.data.id); 
      })
      .catch((error) => {
        console.log(error)
      });

      return response.status(201).json({
        status: 201,
        message: 'Success! playlist created.',
      });
    } else {
      return response.status(200).json({
        status: 200,
        message: 'user already has playlist.',
      });
    }
  }).catch((error) => {
      console.log(error)
    })
  };


module.exports = {
  requestAuth,
  getToken,
  createSpotifyPlaylist
}