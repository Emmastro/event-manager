const ejs = require('ejs');
const path = require('path');
const RSVP = require('../models/rsvp');
const Event = require('../models/event');

exports.createOrUpdateRsvp = async (req, res) => {

    console.log("createOrUpdateRsvp");
    const eventId = req.params.id;
    const isAuthenticated = req.session.isAuthenticated;

    if (!isAuthenticated) {
        console.log("not authenticated");
        return res.redirect("/auth/login?next=/events/create");
    }
    const event = await Event.findById({"_id":eventId});
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (req.method === "GET") {
        const existingRsvp = await RSVP.findOne({ userId: req.session.user.id, eventId: eventId });

        const content = await ejs.renderFile(
            path.join(__dirname, "..", "views", "event-rsvp.ejs"),
            { rsvp: existingRsvp, event }
        );
        return res.render("partials/layout", {
            body: content,
            isAuthenticated: req.session.isAuthenticated,
        });
    }

    if (req.method === "POST") {
        const rsvp = req.body;

        const existingRsvp = await RSVP.findOne({ userId: req.session.user.id, eventId: eventId });

        rsvp.userId = req.session.user.id;
        rsvp.eventId = eventId;
    
        if (existingRsvp) {
            await RSVP.findByIdAndUpdate(existingRsvp._id, rsvp);
        } else {
            const newRsvp = new RSVP(rsvp);
            await newRsvp.save();
        }

        res.redirect(`/events/${eventId}`);
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