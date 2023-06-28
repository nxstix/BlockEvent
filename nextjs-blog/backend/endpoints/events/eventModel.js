const { Schema, model, models } = require('mongoose');

const EventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number },
    price: { type: Number, required: true },
    image: { type: String },
    maxPaxEvent: { type: Number, required: true },
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    ipfs: { type: String },
    creatorID: { type: String }
}, { timestamps: true }
);

const Event = models.Event || model("Event", EventSchema);
module.exports = Event;
