const ejs = require('ejs');
const path = require('path');
const Event = require('../models/event');

exports.homePage = async (req, res) => {

    const isLogin = req.session.isAuthenticated;

    // Use session data for the user if available
    const user = isLogin ? req.session.user : null;

    const events = await Event.find(isLogin ? { visibility: 'public' } : null).populate('organizerId participants');

    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'index.ejs'), { events, user });
    res.render('partials/layout', { body: content, isLogin});
}

exports.contactPage = async(req, res) => {

    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'contact-us.ejs'), { isLogin: req.session.isAuthenticated });
    res.render('partials/layout', { body: content, isLogin: req.session.isAuthenticated });
}

exports.aboutPage = async(req, res) => {
    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'about-us.ejs'));
    res.render('partials/layout', { body: content, isLogin: req.session.isAuthenticated });
}
