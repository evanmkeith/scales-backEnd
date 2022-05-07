const axios = require('axios'); 
const Buffer = require('buffer/').Buffer
const db = require('../models'); 

const requestAuth = (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID; 
  const redirectUrl = process.env.SPOTIFY_REDIRECT_URL;

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}&show_dialog=true&scope=user-follow-read playlist-modify-private user-read-private`;
  
  return res.status(200).json({
    status: 200,
    message: 'Success!',
    authUrl
  });
};

const getToken = async(req, res) =>{
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
    getUserSpotifyProfile(accessToken, refreshToken);
  })
  .catch((error) => {
    console.log(error);
  });
};

const getUserSpotifyProfile = async(accessToken, refreshToken) => {
  await axios.get('https://api.spotify.com/v1/me', {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type' : 'application/json'
      }
    }).then((res) => {
      console.log('User Spotify Profile: ', res.data);
      const spotifyUser = res.data;
      return findUserAccount(spotifyUser, accessToken, refreshToken);
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

const findUserAccount = (spotifyUser, accessToken, refreshToken) => {
  db.User.find({spotifyId: spotifyUser.id}, (err, foundUser) => {
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
      const refreshToken = localStorage.getItem('refresh_token');
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

module.exports = {
  requestAuth,
  getToken,
  getUserSpotifyProfile,
}