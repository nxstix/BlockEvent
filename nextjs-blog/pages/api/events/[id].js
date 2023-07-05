const { getEvent, updateEvent, deleteEvent } = require('../../../backend/endpoints/events/eventService');
const { connectMongo } = require('../../../backend/utils/connectMongo');
const z = require("zod");

export default async function handler(req, res) {
    connectMongo();
    const { id } = req.query;
    const schema = z.object({
        id: z.string().min(24).max(24)
    })
    const response = schema.safeParse({ id });

    switch (req.method) {
        case 'GET':
            try {
                if (!response.success) {
                    const { errors } = response.error;
                    res.status(400).json(errors);
                    break;
                }
                const event = await getEvent(id);
                if (event) {
                    res.status(200).json(event);
                } else {
                    res.status(400).json(err)
                }
            } catch (err) {
                res.status(400).json({ Error: err.message });
            }
            break;
        case 'PUT':
            if (!response.success) {
                const { errors } = response.error;
                res.status(400).json(errors);
                break;
            }
            const schema2 = z.object({
                id: z.string().min(24).max(24),
                title: z.string().min(1).max(100).optional(),
                description: z.string().min(1).max(1000).optional(),
                location: z.string().min(1).max(100).optional(),
                date: z.string().max(24).optional(),
                duration: z.number().min(0).max(24).optional(),
                price: z.number().min(0).max(1000).optional(),
                image: z.string().min(1).optional(),
                maxPaxEvent: z.number().min(1).max(100000).optional(),
                attendees: z.string().array().optional(),
                ipfs: z.string().optional(),
            })
            try {
                const response2 = schema2.safeParse(req.body);
                if (!response2.success) {
                    const { errors } = response2.error;
                    res.status(400).json(errors);
                    break;
                }
                if (id != response2.data.id) {
                    throw new Error("Id in Url and body arent the same")
                }
                const updatedEvent = await updateEvent(response2.data);
                console.log("hier ist updated Event: ", updatedEvent)
                if (updatedEvent) {
                    res.status(200).json(updatedEvent);
                } else {
                    res.status(400).json(err);
                }
            } catch (err) {
                res.status(400).json({ Error: err.message });
            }
            break;
        case 'DELETE':
            try {
                if (!response.success) {
                    const { errors } = response.error;
                    res.status(400).json(errors);
                    break;
                }
                await deleteEvent(id);
                res.status(204).send({ Message: `Event with id: ${id} deleted` });
            } catch (err) {
                res.status(400).json({ Error: err.message });
            }
            break;
    }
}