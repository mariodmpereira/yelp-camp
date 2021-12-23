const previousFolder = '..';
const path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

module.exports = (app) => {
    app.engine('ejs', ejsMate);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, previousFolder, 'views'));
    app.use(express.urlencoded({ extended: true }));
    app.use(methodOverride('_method'));
    app.use(express.static(path.join(__dirname, previousFolder, 'public')));
}