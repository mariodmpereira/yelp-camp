if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const { PORT } = process.env; // PORT is Heroku's default CURRENT_PORT
const express = require('express');
const app = express();
require('./modules/mongodb-util');
require('./modules/middlewares-handler')(app)

const DEFAULT_PORT = 3000;
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');

const User = require('./models/user')
const helmet = require('helmet');
const routes = require('./routes');

app.use(flash());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://images.unsplash.com/",
                "https://res.cloudinary.com/mariodmpereira/",
                "https://res.cloudinary.com/mariodmpereira/image/upload/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'supermario@nintendo.com', username: 'supermario' });
    const newUser = await User.register(user, 'luigi');
    res.send(newUser)
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

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})

const CURRENT_PORT = PORT || DEFAULT_PORT;
app.listen(CURRENT_PORT, () => {
    console.log(`Serving on port ${CURRENT_PORT}`);
})