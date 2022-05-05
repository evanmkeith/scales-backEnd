const mongoose = require('mongoose');
const db = mongoose.connection

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log(`MongoDB connected at ${db.host}: ${db.port}`)
    })
    .catch((err) => {
        console.log(`MongoDB failed at error: ${err}`)
    })

module.exports = {
    User: require('./User'),
}