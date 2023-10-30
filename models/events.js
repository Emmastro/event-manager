const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    organizerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['professional development', 'networking', 'campus events'],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        required: true
    }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
