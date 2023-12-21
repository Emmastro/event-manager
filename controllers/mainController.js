const ejs = require('ejs');
const path = require('path');
const Event = require('../models/event');
const send_email = require('../utils/email');

exports.homePage = async (req, res) => {

    const isAuthenticated = req.session.isAuthenticated;
    const user = isAuthenticated ? req.session.user : null;

    const eventsQuery = isAuthenticated ? {} : { visibility: "public" };
    const events = await Event.find(eventsQuery).limit(3);

    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'index.ejs'), {...res.locals,  events, user,  });

    res.render('partials/layout', { body: content});
}

exports.contactPage = async(req, res) => {

    if (req.method === 'POST') {
        const { name, email, message } = req.body;
        send_email(email, `Contact from ${name}`, message);
    }
    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'contact-us.ejs'), {...res.locals});
    res.render('partials/layout', { body: content });
}

exports.aboutPage = async(req, res) => {
    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'about-us.ejs'), {...res.locals});
    res.render('partials/layout', { body: content });
}
