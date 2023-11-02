const ejs = require('ejs');
const path = require('path');

const Event = require('../models/event');

exports.getEvents = async (req, res) => {
    try {

        const events = await Event.find(req.session.isAuthenticated ? { visibility: 'public' } : null).populate('organizerId participants');
        const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'events.ejs'), { events });

        res.render('partials/layout', { body: content, isLogin: req.session.isAuthenticated });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.createEvent = async (req, res) => {
    // check if it's a post or get request
    console.log("create event", req.method);
    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'events-create.ejs'));
        res.render('partials/layout', { body: content, isLogin: req.session.isAuthenticated });

    if (req.method === 'GET') {
        
    }
    // else if (req.method === 'POST') {
    //     try {
    //         const event = new Event(req.body);
    //         await event.save();
    //         res.status(201).json({ event });
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // }
    // TODO: should show success message after creating event
   
};

exports.getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizerId participants');
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ event });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { organizerId, title, description, category, date, createdDate, participants } = req.body;
        const event = await Event.findByIdAndUpdate(id, { organizerId, title, description, category, date, createdDate, participants }, { new: true });
        res.status(200).json({ event });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Event.findByIdAndDelete(id);
        if (deleted) {
            return res.status(200).send("Event deleted");
        }
        throw new Error("Event not found");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
