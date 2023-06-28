const { connectMongo } = require('./connectMongo');
const UserSchema = require('../endpoints/users/userModel');

async function runDB() {
    try {
        await connectMongo();
        console.log('CONNECTED TO MONGODB');
        //checking if admin already exists
        const existingAdminUser = await UserSchema.findOne({ firstName: 'Default' });
        if (existingAdminUser) {
            return;
        }
        //create admin if not in DB
        const adminUser = new UserSchema({
            email: 'admin@test.com',
            password: '12345',
            firstName: 'Default',
            lastName: 'Administrator Account',
            birthdate: "2001-06-01",
            isAdministrator: true,
        });
        await adminUser.save();
        console.log('Connection to the DB successful!');
    } catch (error) {
        console.log(error);
        console.log('Connection to the DB failed...');
    }
}

module.exports = runDB;
