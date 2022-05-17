# Scales - Back End

Front-end [here](https://github.com/evanmkeith/scales-FE). 

## Concept:
A web applcation that encourages users to listen to artists full albums and create custom playlists as well as informs them of when they're favorite artists are on tour. This app utilizes the Spotify API SSO to create and listen on behalf of the users account. 

## User Stories: 
As a user: <br>
I want to search for specific artists. <br>
I want to be able to make a new playlist from the albums I'm listening to. <br>
I want to learn about the artist I am listening to. <br>
I want to listen to full albums from an artist. <br>
I want to see if this artist to touring and where they may be touring. <br>
I want it to link up with my Spotify account so I can store this information and access it later. <br>

## ERD
![Screen Shot 2022-05-01 at 6 09 56 PM](https://user-images.githubusercontent.com/55766816/166173112-0c514dee-bf80-4871-80e1-63bef7db070c.png)

## Technologies Used:
    - JavaScript
    - Express
    - Node.js
    - Axios
    - Spotify API 
    - TicketMaster API
    - MongoDB

## How to Install:
- You will first want to fork and clone down the repo onto your local device
- npm i 
- Fork and clone down the back-end [here]([https://github.com/evanmkeith/scales-backEnd](https://github.com/evanmkeith/scales-FE))
- npm i 
- npm i nodemon -g 
- Create a MongoDB database
- Create accounts with the follow APIs
    - Spotify
    - TicketMaster
- npm i dotenv
- create a .env file and add in your Spotify redirect uri, client ID, client secret, mongoDB link, and ticektMaster key 
- make sure you add the redirect uri to your Spotify developers account. 
- The backend is hosted on http://localhost:3000/ and the front end is on http://localhost:4000/
- You can then open each repo in its own tab in your terminal and use nodemon to start each one. 
- Voila! It should work once you navigate to http://localhost:4000/ in your browser. 

## Future Development: 
For my next iterations, I would like to refactor how I have setup the login & access flow. I would also like to re-do how I handle the refresh token - right now it probably wont work. I would also like to make this mobile friendly but did intend on making it desktop first so people could take a beat to listen to the whole album instead of on the go. 

## App Demo
https://scales-music.herokuapp.com/
