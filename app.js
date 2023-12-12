const express = require('express');
const bodyParser = require('body-parser');

const session = require('express-session');

const SESSION_SECRET = require('./config/auth');

const app = express();


app.use(session({
    secret: SESSION_SECRET,  // Choose a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }  // 1 hour
}));

if (process.env.NODE_ENV === 'test') {
    app.use((req, res, next) => {
        
        req.session.user = { id: '627b72eaf76a5b23e4a657e6', user: 'testUser' }; // Mock user data
        req.session.isAuthenticated = true;
        next();
      });
}


app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');

app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', { title: 'Internal Server Error' });
});

module.exports = app; 
