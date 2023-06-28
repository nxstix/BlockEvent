const Event = require("./eventModel");
const { dateAndTimeToString } = require("../../utils/dateToString");
const { ObjectId } = require('mongodb');

async function getEvent(id) {
    const event = await Event.findById(id).exec();
    const imageData = event.image;
    const image = imageData ? `data:image/jpeg;base64,${imageData}` : null;
    if (!event) {
        throw new Error("getEvent failed. Event not found");
    }
    return {
        id: event.id.toString(),
        title: event.title,
        description: event.description,
        location: event.location,
        date: event.date,
        duration: event.duration,
        price: event.price,
        image: image,
        attendees: event.attendees,
        maxPaxEvent: event.maxPaxEvent,
        createdAt: dateAndTimeToString(event.createdAt),
        ipfs: event.ipfs
    }
}

async function getEvents() {
    try {
        const events = await Event.find({}).exec();
        if (!events) {
            throw new Error("getEvents failed. No events found");
        }
        let allEvents = [];
        Object.values(events).forEach(event => {
            const { id, title, description, location, date, duration, price, attendees, createdAt, ipfs, creatorID } = event;
            const dateString = dateAndTimeToString(date);
            const createdAtString = dateAndTimeToString(createdAt);

            // Assuming the image is stored as a base64-encoded string in the 'image' field
            const imageData = event.image;
            const image = imageData ? `data:image/jpeg;base64,${imageData}` : null;

            allEvents.push({ id, title, description, location, dateString, duration, price, image, attendees, createdAtString, ipfs, creatorID });
        });
        return allEvents;
    } catch (err) {
        console.log(err.message);
    }
}

async function createEvent(eventResource) {
    try {
        const eventData = {
            id: eventResource.id,
            title: eventResource.title,
            description: eventResource.description,
            location: eventResource.location,
            date: new Date(eventResource.date),
            duration: eventResource.duration,
            price: eventResource.price,
            image: eventResource.image,
            maxPaxEvent: eventResource.maxPaxEvent,
            ipfs: eventResource.ipfs,
            creatorID: eventResource.creatorID
        };
        

        const event = await Event.create(eventData);

        return {
            id: event.id,
            title: eventResource.title,
            description: eventResource.description,
            location: eventResource.location,
            date: new Date(eventResource.date),
            duration: eventResource.duration,
            price: eventResource.price,
            image: eventResource.image,
            maxPaxEvent: eventResource.maxPaxEvent,
            ipfs: eventResource.ipfs,
            creatorID: eventResource.creatorID
        };
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyValue) {
            const duplicateKey = Object.keys(err.keyPattern)[0];
            const duplicateValue = err.keyValue[duplicateKey];
            throw new Error(`Event with ${duplicateKey}: ${duplicateValue} already exists.`);
        } else if (err.type === Error.ValidationError) {
            throw new Error(err.message);
        } else {
            throw err;
        }
    }
}



async function updateEvent(eventResource) {
    if (!eventResource.id) {
        throw new Error("updateEvent failed. No event id provided");
    }
    if (eventResource.date) {
        eventResource.date = new Date(eventResource.date);
    }
    const event = await Event.findById(eventResource.id);
    if (!event) {
        throw new Error(`updateEvent failed. No event with the id ${eventResource.id} found.`);
    }
    if (eventResource.attendees) {
        for (const a of eventResource.attendees) {
            event.attendees.push(a);
        }
        eventResource.attendees = event.attendees;
    }
    await Event.updateOne({ _id: eventResource.id }, eventResource).exec();
    return event;
}

async function deleteEvent(id) {
    const event = await Event.findById(id).exec();
    if (!event) {
        throw new Error(`deleteEvent failed. No Event with the id: ${id}`);
    }
    await Event.deleteOne(new ObjectId(id)).exec();
}

module.exports = { getEvent, getEvents, createEvent, updateEvent, deleteEvent };  