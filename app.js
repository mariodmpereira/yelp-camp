require('dotenv').config();
const envs = process.env;
const port = 3000;
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect(envs.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makecampground', async (req, res) => {
    const camp = new Campground({title: "My Backyard", description: "cheap camping"})
    await camp.save();
    res.send(camp);
})

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})