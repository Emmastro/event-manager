const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    response: {
        type: String,
        enum: ['attending', 'maybe', 'declined'],
        required: true
    },
    respondedAt: {
        type: Date,
        default: Date.now
    }
});

const RSVP = mongoose.model('RSVP', rsvpSchema);
module.exports = RSVP;
