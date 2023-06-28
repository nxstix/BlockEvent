const User = require("./userModel");
const { dateAndTimeToString, dateToString } = require("../../utils/dateToString");
const { ObjectId } = require('mongodb');

async function getUser(id) {
    const user = await User.findById(id).exec();
    if (!user) {
        throw new Error("getUser failed. User not found");
    }
    return {
        id: user.id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthdate: dateToString(user.birthdate),
        isAdministrator: user.isAdministrator,
        isEventmanager: user.isEventmanager,
        createdAt: dateAndTimeToString(user.createdAt),
        walletAddress: user.walletAddress,
    }
}

async function getUsers() {
    try {
        const users = await User.find({}).exec()
        if (!users) {
            throw new Error("getUsers failed. User not found");
        }
        var allUsers = [];
        Object.values(users).forEach(user => {
            const { id, email, firstName, lastName, birthdate, isAdministrator, isEventmanager, createdAt,walletAddress, ...partialObject } = user;
            const createdAtString = dateAndTimeToString(createdAt);
            allUsers.push({ id, email, firstName, lastName, birthdate, isAdministrator, isEventmanager, createdAtString,walletAddress })
        })
        return allUsers

    } catch (err) {
        console.log(err.message);
    }
}

async function createUser(userResource) {
    try {
        userResource.email = userResource.email.toLowerCase();

        const user = await User.create({
            email: userResource.email,
            password: userResource.password,
            firstName: userResource.firstName,
            lastName: userResource.lastName,
            birthdate: userResource.birthdate,
            isAdministrator: userResource.isAdministrator,
            isEventmanager: userResource.isEventmanager,
        });
        return ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            birthdate: user.birthdate,
            isAdministrator: user.isAdministrator,
            isEventmanager: user.isEventmanager
        });
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyValue) {
            const duplicateKey = Object.keys(err.keyPattern)[0];
            const duplicateValue = err.keyValue[duplicateKey];
            throw new Error(`User with ${duplicateKey}: ${duplicateValue} already exists.`);
        } else if (err.type === Error.ValidationError) {
            throw new Error("Required fields are missing or invalid");
        } else {
            throw err;
        }
    }
}

async function updateUser(userResource) {
    if (!userResource.id) {
        throw new Error("updateUser failed. No id given");
    }
    if (userResource.email) {
        userResource.email = userResource.email.toLowerCase();
    }
    const user = await User.findByIdAndUpdate(userResource.id, userResource, { new: true }).exec();
    user.save()
    if (!user) {
        throw new Error(`updateUser failed. No user with the id: ${userResource.id}`);
    }
    return ({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthdate: user.birthdate,
        isAdministrator: user.isAdministrator,
        isEventmanager: user.isEventmanager,
        walletAddress: user.walletAddress,
    })
}

async function deleteUser(id) {
    const user = await User.findById(id).exec();
    if (!user) {
        throw new Error(`deleteUser failed. No user with the id: ${id}`);
    }
    await User.deleteOne(new ObjectId(id)).exec();
}

module.exports = { getUser, createUser, updateUser, deleteUser, getUsers };
