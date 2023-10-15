const Notification = require('../models/notification');

exports.createNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();
        res.status(201).json({ notification });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id).populate('userId relatedEvent');
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.json({ notification });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().populate('userId relatedEvent');
        res.json({ notifications });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

