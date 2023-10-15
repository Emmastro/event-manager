const RSVP = require('../models/rsvp');

exports.createRSVP = async (req, res) => {
    try {
        const rsvp = new RSVP(req.body);
        await rsvp.save();
        res.status(201).json({ rsvp });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRSVP = async (req, res) => {
    try {
        const rsvp = await RSVP.findById(req.params.id).populate('userId eventId');
        if (!rsvp) return res.status(404).json({ message: 'RSVP not found' });
        res.json({ rsvp });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRSVPs = async (req, res) => {
    try {
        const rsvps = await RSVP.find().populate('userId eventId');
        res.json({ rsvps });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateRSVP = async (req, res) => {
    try{
        const { id } = req.params;
        const { userId, eventId, response, respondedAt } = req.body;
        const rsvp = await RSVP.findByIdAndUpdate(id, { userId, eventId, response, respondedAt }, { new: true });
        res.status(200).json({ rsvp });
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }

}

exports.deleteRSVP = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await RSVP.findByIdAndDelete(id);
        if (deleted) {
            return res.status(200).send("RSVP deleted");
        }
        throw new Error("RSVP not found");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}