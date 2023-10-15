const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB (for example, using Mongo Atlas)
mongoose.connect('YOUR_MONGODB_CONNECTION_STRING', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(error => {
        console.error("Error connecting to MongoDB:", error);
    });

// Setting up the view engine as EJS
app.set('view engine', 'ejs');

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware for static files (like CSS, images)
app.use(express.static('public'));

// Import your routers/controllers
const userRouter = require('./routes/user');
const eventRouter = require('./routes/event');
const rsvpRouter = require('./routes/rsvp');
const notificationRouter = require('./routes/notification');

// Routes setup
app.use('/users', userRouter);
app.use('/events', eventRouter);
app.use('/rsvp', rsvpRouter);
app.use('/notifications', notificationRouter);


app.get('/', (req, res) => {
    res.render('index', { title: 'Alumni Collaboration Platform' });
});


app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 
