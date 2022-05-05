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
}

const getToken = async(req, res) =>{
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const clientId = process.env.SPOTIFY_CLIENT_ID; 
  const redirectUrl = process.env.SPOTIFY_REDIRECT_URL;
  let refreshToken
  let accessToken

  const body = `grant_type=authorization_code&code=${req.body.code}&redirect_uri=${redirectUrl}`;

  await axios.post('https://accounts.spotify.com/api/token', body, {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'), 
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then((res) => {
    console.log("Access Token: ",res.data.access_token, "\nRefresh Token: ",res.data.refresh_token);

    accessToken = res.data.access_token;
    refreshToken = res.data.refresh_token;
  })
  .catch((error) => {
    console.log(error);
  });



  // db.User.find({spotifyId === })
};

module.exports = {
  requestAuth,
  getToken,
}

// function App() {
//   const clientId = process.env.CLIENT_ID; 
//   const clientSecret = process.env.CLIENT_SECRET; 
//   const redirectUrl = process.env.REDIRECT_URL;
//   let authCode
//   let followedArtists 


//   const refreshToken = async() => {
//     const refreshToken = localStorage.getItem('refresh_token');
//     const body = `grant_type=refresh_token&refresh_token=${refreshToken}`;
//     await axios.post('https://accounts.spotify.com/api/token', body, {
//       headers: { 
//         'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
//         'Content-Type': 'application/x-www-form-urlencoded'
//       }
//     })
//     .then((res) => {
//       console.log(res);
//       localStorage.setItem("access_token", res.data.access_token); 
//     })
//     .catch((error) => {
//       console.log(error)
//     })
//   }

//   const getFollowedArtists = async() => {
//     console.log(localStorage.getItem('access_token'));
//     const accessToken = localStorage.getItem('access_token');
//     console.log("access token: ", accessToken);

//     await axios.get('https://api.spotify.com/v1/me/following?type=artist', {
//       headers: { 
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type' : 'application/json'
//       }
//     }).then((res) => {
//       console.log('Followed Artist: ', res);
//       followedArtists = res.data.artists.items
//       console.log(followedArtists);
//     }).catch((error) => {
//       if(error.request.status === 401){
//         console.log(error);
//         console.log('refreshing token');
//         refreshToken();
//         getFollowedArtists();
//       } else{
//         console.log("Error Message: ", error);
//       }
//     })
//   }

//   useEffect(() => {
//     if(window.location.href.includes('code')){
//       authCode = window.location.href.split('=')[1];
//       getToken();
//     };
//   }, [])

//   return (
//     <div>
//       <button onClick={requestAuth}>Login with Spotify</button>
//       <h3>Artists I'm following</h3>
//       <button onClick={getFollowedArtists}>Get artists I'm following</button>

//       <div>
//       </div>
//     </div>
//   );
// }

// export default App;