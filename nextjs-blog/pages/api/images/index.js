const { createImage} = require('../../../backend/endpoints/images/imageService');
const { connectMongo } = require("../../../backend/utils/connectMongo");
const z = require("zod");

export default async function handler(req, res) {
    connectMongo()
    switch (req.method) {
        case 'POST':
            const schema = z.object({
                eventID: z.string(),
                imageData: z.string()
            })
            try{
                const response = schema.safeParse(req.body);
                if(!response.success){
                    const {errors} = response.error;
                    res.status(400).json(errors);
                }else{
                    const newImage = await createImage(response.data);
                    if (newImage) {
                    res.status(200).json(newImage);
                    } else {
                    res.status(400).json({ Error: "Failed to post new image" });
                    }
                }
            }catch(err){
                res.status(400).send({ Error: err.message })
            }
            break;
    }
}