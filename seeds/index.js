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
    for (let i = 0; i < 200; i++) {
        const randomCity = sample(cities);
        const randomPrice = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: envs.USER_ID,
            location: `${randomCity.city}, ${randomCity.state}`,
            geometry: { type: "Point", coordinates: [randomCity.longitude, randomCity.latitude] },
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquam animi aspernatur aut commodi, corporis exercitationem id illo modi nisi omnis perferendis praesentium quaerat sit soluta totam unde vel voluptatibus.',
            price: randomPrice,
            images: [
                {
                    url: 'https://res.cloudinary.com/mariodmpereira/image/upload/v1639909068/yelp-camp/photo-1533873984035-25970ab07461_olujpi.jpg',
                    filename: '/yelp-camp/photo-1533873984035-25970ab07461_olujpi.jpg',
                },
                {
                    url: 'https://res.cloudinary.com/mariodmpereira/image/upload/v1639909068/yelp-camp/photo-1533575770077-052fa2c609fc_sfithl.jpg',
                    filename: '/yelp-camp/photo-1533575770077-052fa2c609fc_sfithl.jpg'
                },
                {
                    url: 'https://res.cloudinary.com/mariodmpereira/image/upload/v1639909067/yelp-camp/photo-1563299796-17596ed6b017_q0vbrr.jpg',
                    filename: '/yelp-camp/photo-1563299796-17596ed6b017_q0vbrr.jpg'
                },
                {
                    url: 'https://res.cloudinary.com/mariodmpereira/image/upload/v1639909067/yelp-camp/photo-1510672981848-a1c4f1cb5ccf_oxeelp.jpg',
                    filename: '/yelp-camp/photo-1510672981848-a1c4f1cb5ccf_oxeelp.jpg'
                },
                {
                    url: 'https://res.cloudinary.com/mariodmpereira/image/upload/v1639909067/yelp-camp/photo-1556191326-93cfa5533d45_ksvhfb.jpg',
                    filename: '/yelp-camp/photo-1556191326-93cfa5533d45_ksvhfb.jpg'
                },

            ],
        })
        await camp.save();
    }
})().then(() => mongoose.connection.close());