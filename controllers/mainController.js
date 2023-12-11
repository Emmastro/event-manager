const ejs = require('ejs');
const path = require('path');
const Event = require('../models/event');

exports.homePage = async (req, res) => {

    const isAuthenticated = req.session.isAuthenticated;
    const user = isAuthenticated ? req.session.user : null;

    const eventsQuery = isAuthenticated ? {} : { visibility: "public" };
    const events = await Event.find(eventsQuery).limit(3);

    //TODO: paginate view for this?

    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'index.ejs'), { events, user,  });
    res.render('partials/layout', { body: content, isAuthenticated});
}

exports.contactPage = async(req, res) => {

    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'contact-us.ejs'), { isAuthenticated: req.session.isAuthenticated });
    res.render('partials/layout', { body: content, isAuthenticated: req.session.isAuthenticated });
}

exports.aboutPage = async(req, res) => {
    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'about-us.ejs'));
    res.render('partials/layout', { body: content, isAuthenticated: req.session.isAuthenticated });
}
