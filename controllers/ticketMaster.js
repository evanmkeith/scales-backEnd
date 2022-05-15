const axios = require('axios'); 

const getTourInfo = async(req, response) => {
    const apiKey = process.env.TICKETMASTER_KEY;
    const keyWords = req.body.keyWords;

    await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?&keyword=${keyWords}&apikey=${apiKey}`).then((res) => {
        const events = res.data._embedded.events;
        return response.status(200).json({
            status: 200,
            message: 'Success!',
            events
        });
    }).catch((err) => {
        console.log(err);
    });
};

module.exports = {
    getTourInfo
  }