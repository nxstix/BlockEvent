const { getUser, updateUser, deleteUser } = require('../../../backend/endpoints/users/userService');
const { connectMongo } = require("../../../backend/utils/connectMongo");
const z = require("zod")

export default async function handler(req, res) {
    connectMongo()
    const { id } = req.query;
    const schema = z.object({
        id: z.string().min(24).max(24)
    });
    const response = schema.safeParse({ id });

    switch (req.method) {
        case 'GET':
            try {
                if (!response.success) {
                    const { errors } = response.error;
                    res.status(400).json(errors);
                    break;
                }
                const user = await getUser(id);
                if (user) {
                    res.status(200).json(user);
                } else {
                    res.status(400).json(err);
                }
            } catch (err) {
                res.status(400).json({ Error: err.message });
            }
            break;
        case 'PUT':
            const schema2 = z.object({
                id: z.string().min(24).max(24),
                email: z.string().email().optional(),
                firstName: z.string().min(1).max(50).optional(),
                lastName: z.string().min(1).max(50).optional(),
                password: z.string().min(5).max(100).optional(),
                birthdate: z.string().optional(),
                isAdministrator: z.boolean().optional(),
                isEventmanager: z.boolean().optional(),
                walletAddress: z.string().optional(),
            })
            try {
                const response2 = schema2.safeParse(req.body);
                if (!response2.success) {
                    const { errors2 } = response2.error;
                    res.status(401).json(errors2);
                    break;
                }
                if (id != response2.data.id) {
                    throw new Error("Id in Url and body aren't the same")
                }
                const updatedUser = await updateUser(response2.data);
                if (updatedUser) {
                    res.status(200).json(updatedUser);
                } else {
                    res.status(400).json({ Error: "Failed to update user" });
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
                try {
                    await deleteUser(id);
                    res.status(204).send({ Message: `User with id: ${id} deleted` });
                } catch (err) {
                    res.status(400).json({ Error: "Failed to delete user" });
                }
            } catch (err) {
                res.status(400).json({ Error: err.message });
            }
            break;
    }
}