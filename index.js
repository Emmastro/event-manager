const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const SESSION_SECRET = require('./config/auth');

const app = express();


// connectDB()

app.use(session({
    secret: SESSION_SECRET,  // Choose a strong secret key
    resave: false,
    saveUninitialized: true,
    // TODO: only use MongoStore when not running jest. We could have a app.js that adds the store 
    //store: new MongoStore({ mongoUrl: process.env.MONGODB_URI}),
    cookie: { maxAge: 3600000 }  // 1 hour
}));

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


const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

module.exports = app; 
