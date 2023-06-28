const { createUser, getUsers, updateUser } = require('../../../backend/endpoints/users/userService');
const { connectMongo } = require("../../../backend/utils/connectMongo");
const z = require("zod");

export default async function handler(req, res) {
    connectMongo()
    switch (req.method) {
        case 'GET':
            try{
                const users = await getUsers();
                if (users) {
                    res.status(200).json(users);
                } else {
                    res.status(400).json({ Error: "Failed to get users" });
                }
            }catch(err){
                res.status(400).send({ Error: err.message })
            }
            break;
        case 'POST':
            const schema = z.object({
                email: z.string().email(),
                firstName: z.string().min(1).max(50),
                password: z.string().min(5).max(100),
                lastName: z.string().min(1).max(50),
                birthdate: z.string(),
                isAdministrator: z.boolean().optional(),
                isEventmanager: z.boolean().optional(),
            })
            try{
                const response = schema.safeParse(req.body);
                if(!response.success){
                    const {errors} = response.error;
                    res.status(400).json(errors);
                }else{
                    const newUser = await createUser(response.data);
                    if (newUser) {
                    res.status(200).json(newUser);
                    } else {
                    res.status(400).json({ Error: "Failed to post new users" });
                    }
                }
            }catch(err){
                res.status(400).send({ Error: err.message })
            }
            break;
    }
}