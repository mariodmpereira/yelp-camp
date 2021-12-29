const MongoStore = require('connect-mongo');
const session = require('express-session');

module.exports = (app, mongoDbUrl, secret) => {
    const CURRENT_SECRET = secret || 'thisshouldbeabettersecret!';

    const store = MongoStore.create({
        mongoUrl: mongoDbUrl,
        touchAfter: 24 * 60 * 60,
        crypto: {
            secret: CURRENT_SECRET
        }
    });

    store.on('error', function (e) {
        console.log('SESSION STORE ERROR', e)
    })

    const sessionConfig = {
        store,
        name: 'session',
        secret: 'thisshouldbeabettersecret!',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            // secure: true, // TODO: Does not work on localhost
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    }

    app.use(session(sessionConfig));
}