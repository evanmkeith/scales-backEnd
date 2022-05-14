const axios = require('axios'); 
const Buffer = require('buffer/').Buffer
const db = require('../models'); 
// const jwt = require('jsonwebtoken');

const requestAuth = (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID; 
  const redirectUrl = process.env.SPOTIFY_REDIRECT_URL;

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}&scope=user-follow-read playlist-modify-private user-read-private streaming user-read-email user-read-playback-state user-modify-playback-state user-library-read user-library-modify`;
  
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
      //const token = jwt.sign({userId:  foundUser[0]._id}, "pestocat", {expiresIn: '6h'});
      const token = {
        userId: foundUser[0]._id, 
        accessToken: foundUser[0].accessToken,
        playlistId: foundUser[0].playlistId
      }
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

// const decodeJwt = (token) => {
//   console.log(token)
//   const base64Url = token.split('.')[1];
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   const jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString('ascii').split('').map(function(c) {
//       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//   }).join(''));
//   const id = JSON.parse(jsonPayload);

//   return id
// };

const createSpotifyPlaylist = async(req, response) => {
  const userId = req.body.token.userId;
  const data = {
    "name": "Scales App", 
    "description": "Playlist made and managed by your Scales app account.",
    "public": false
  };

  await db.User.findById(userId).then(async(res) => {
    const user = res;
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
  }).catch((error) => {
      console.log(error)
    })
};

const getPlaylist = async(req, response) => {
  const userId = req.body.token.userId;

  await db.User.findById(userId).then(async(res) => {
    const user = res;
    if(user.playlistId) {
      await axios.get(`https://api.spotify.com/v1/playlists/${user.playlistId}/tracks`, {
        headers: { 
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        const tracks = res.data.items;
        let newTracks = [];
        tracks.map(track => {
          newTracks.push({
              artist: track.track.artists[0].name,
              title: track.track.name, 
              uri: track.track.uri, 
              albumUrl: track.track.album.images[2].url
          });
      });
        return response.status(200).json({
          status: 200,
          message: 'Received Playlist',
          newTracks
        });
      })
    };
  }).catch((error) => {
    console.log(error);
  })
}

const removeTrack = async(req, res) => {
  const uri = req.body.track.uri;
  const playlistId = req.body.user.playlistId;
  const accessToken = req.body.user.accessToken;
  console.log("Access Token: ", accessToken);
  console.log(`URI: ${uri}`);
  console.log("playlistId: " ,playlistId)

  await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { 
    headers: { 
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }, 
    data: { 
      "tracks": [{ "uri": uri }] 
    }
  }).then((response) => {
    return res.status(200).json({
      status: 200,
      message: 'removed track',
    });
  }).catch((error) => {
    console.error(error);
  })
};

const searchAlbums = async (req, res) => {
  console.log("ReQ ",req);
  const accessToken = req.body.accessToken;
  const search = req.body.search;

  await axios.get(`https://api.spotify.com/v1/search?query=${search}&type=album`, {
    headers: { 
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type' : 'application/json'
    }
  }).then((response) => {
    const results = response.data.albums.items;
    let albums = [];
    results.map((album) => {
      albums.push({
        id: album.id, 
        uri: album.uri,
        name: album.name, 
        img: album.images[2], 
        artist: album.artists
      })
    }); 
    return res.status(200).json({
      status: 200,
      message: 'received results',
      albums
    })
  }).catch((error) => {
    console.log(error);
  })
};

const addTrack = async (req, response) => {
  console.log(req.body);
  const trackUri = req.body.track.uri;
  const accessToken = req.body.user.accessToken;
  const playlistId = req.body.user.playlistId;
  const data = {
    'uris': [trackUri]
  }

  await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, data, {
    headers: { 
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  }).then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(err);
  })
}

const getAlbumTracks = async (req, response) => {
  const albumId = req.body.albumId;
  const accessToken = req.body.accessToken;

  await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
    headers: { 
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type' : 'application/json'
    }
  }).then((res) => {
    const tracks = res.data.items;
    let albumTracks = [];
    tracks.map((track) => {
      albumTracks.push({
        title: track.name,
        uri: track.uri,
      })
    })
    return response.status(200).json({
    status: 200,
    message: 'received tracks',
    albumTracks
    })
  }).catch((err) => {
    console.log(err);
  })
}

module.exports = {
  requestAuth,
  getToken,
  createSpotifyPlaylist, 
  getPlaylist,
  removeTrack,
  searchAlbums, 
  addTrack, 
  getAlbumTracks
}