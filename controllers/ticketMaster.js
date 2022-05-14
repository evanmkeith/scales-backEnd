const axios = require('axios'); 

const getTourInfo = async(req, res) => {
    const apiKey = process.env.TICKETMASTER_KEY;
    const keywords = req.body.keyWords;

    await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?size=1&keyword=${keyWords}&apikey=${apiKey}`).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
};

module.exports = {
    getTourInfo
  }