import { connectMongo } from "../../../backend/utils/connectMongo"
const { getImage } = require("../../../backend/endpoints/images/imageService")
const z = require("zod");

export default async function handler(req, res) {
    connectMongo()
    const { id } = req.query
    const schema = z.object({
        id: z.string().min(24).max(24)
    })
    const response = schema.safeParse({ id })

    switch (req.method) {
        case "GET":
            try {
                if (!response.success) {
                    const { errors } = response.error;
                    res.status(400).json(errors);
                    break;
                }
                const image = await getImage(id);
                if (image) {
                    res.status(200).json(image);
                } else {
                    res.status(400).json(err)
                }
            } catch (err) {
                res.status(400).json({ Error: err.message });
            }
            break;
    }
}