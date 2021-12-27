if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()

}

const { PORT, MONGODB_URL, SECRET } = process.env; // PORT is Heroku's default CURRENT_PORT
const express = require('express');
const app = express();
const ExpressError = require('./utils/ExpressError');
const routes = require('./routes');

require('./modules/mongodb-util')(MONGODB_URL);
require('./modules/middlewares-handler')(app, MONGODB_URL, SECRET, PORT)
require('./vendor/cloudinary')(app)

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', routes.users);
app.use('/campgrounds', routes.campgrounds)
app.use('/campgrounds/:id/reviews', routes.reviews)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found'), 404)
})

app.use((err, req, res) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})