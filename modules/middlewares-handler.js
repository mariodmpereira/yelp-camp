const path = require("path");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

}

const { PORT, MONGODB_URL, SECRET } = process.env; // PORT is Heroku's default CURRENT_PORT
const PREVIOUS_FOLDER = '..';
const express = require("express");

function ejsConfig(app) {
    const ejsMate = require("ejs-mate");
    app.engine('ejs', ejsMate);
}

function engineConfig(app) {
    app.set('view engine', 'ejs');
}

function viewsConfig(app) {
    app.set('views', path.join(__dirname, PREVIOUS_FOLDER, 'views'));
}

function bodyParserConfig(app) {
    app.use(express.urlencoded({ extended: true }));
}

function methodOverrideConfig(app) {
    const methodOverride = require("method-override");
    app.use(methodOverride('_method'));
}

function staticConfig(app) {
    app.use(express.static(path.join(__dirname, PREVIOUS_FOLDER, 'public')));
}

function sessionConfig(app) {
    const CURRENT_SECRET = SECRET || 'thisshouldbeabettersecret!';
    const MongoStore = require("connect-mongo");
    const session = require('express-session');

    const store = MongoStore.create({
        mongoUrl: MONGODB_URL,
        touchAfter: 24 * 60 * 60,
        crypto: {
            secret: CURRENT_SECRET
        }
    });

    store.on("error", function (e) {
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

function mongoSanitizeConfig(app) {
    const mongoSanitize = require("express-mongo-sanitize");
    app.use(mongoSanitize());
}

function passportConfig(app) {
    const passport = require('passport');
    const LocalStrategy = require('passport-local');
    const User = require("../models/user");

    app.use(passport.initialize({}));
    app.use(passport.session({}));
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
}

module.exports = (app) => {
    ejsConfig(app);
    engineConfig(app);
    viewsConfig(app);
    bodyParserConfig(app);
    methodOverrideConfig(app);
    staticConfig(app);
    sessionConfig(app);
    mongoSanitizeConfig(app);
    passportConfig(app);
}