const mongoose = require('mongoose');

module.exports = (mongoDbUrl) => {
    mongoose.connect(mongoDbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    mongoose.connection
        .on('error', console.error.bind(console, 'connection error:'))
        .once('open', () => console.log('Database Connected'))
}