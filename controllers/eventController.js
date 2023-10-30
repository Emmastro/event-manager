const Event = require('../models/event');

exports.createEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json({ event });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('organizerId participants');
        res.json({ events });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

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
