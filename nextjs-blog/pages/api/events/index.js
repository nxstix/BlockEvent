const { createEvent, getEvents } = require('../../../backend/endpoints/events/eventService');
const { createMockEvents } = require('../../../backend/utils/createMockEvents')
const { connectMongo } = require("../../../backend/utils/connectMongo");
const z = require("zod");

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb',
        },
    },
};

export default async function handler(req, res) {
    connectMongo()
    switch (req.method) {
        case 'GET':
            try {
                const events = await getEvents();
                if (events.length === 0) {
                    await createMockEvents()
                    const mockEvents = await getEvents();
                    res.status(200).json(mockEvents);
                }
                else if (events.length > 0) {
                    res.status(200).json(events);
                } else {
                    res.status(400).json({ Error: "Failed to get events" });
                }
            } catch (err) {
                res.status(400).json({ Error: err });
            }
            break;
        case 'POST':
            const schema = z.object({
                title: z.string().min(1).max(100),
                description: z.string().min(1).max(1000),
                location: z.string().min(1).max(100),
                date: z.string().max(24),
                duration: z.number().min(0).max(50).optional(),
                price: z.number().min(0).max(1000),
                image: z.string().min(1).optional(),
                maxPaxEvent: z.number().min(1).max(100000),
                attendees: z.string().array().optional(),
                creatorID: z.string().optional()
            })
            try {
                const response = schema.safeParse(req.body);
                if (!response.success) {
                    const { errors } = response.error;
                    res.status(400).json(errors);
                    break;
                }
                const newEvent = await createEvent(response.data);
                if (newEvent) {
                    res.status(200).json(newEvent);
                } else {
                    res.status(400).json({ Error: "Failed to post new event" });
                }
            } catch (err) {
                res.status(400).json({ Error: err.message });
            }
            break;
    }
}