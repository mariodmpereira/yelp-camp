require('dotenv').config({ path: require('find-config')('.env') })
const envs = process.env;
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect(envs.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

(async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomCity = sample(cities);
        const randomPrice = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${randomCity.city}, ${randomCity.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/190727/',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquam animi aspernatur aut commodi, corporis exercitationem id illo modi nisi omnis perferendis praesentium quaerat sit soluta totam unde vel voluptatibus.',
            price: randomPrice
        })
        await camp.save();
    }
})().then(() => mongoose.connection.close());