const Image = require("./imageModel")

async function getImage(imageID) {
    try {
        const image = await Image.findById(imageID).exec();
        return image;
    } catch (err) {
        throw new Error(`getImageByEventId failed: ${err.message}`);
    }
}

async function createImage(imageResource) {
    try {
        return await Image.create({ imageData: imageResource });
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

module.exports = { getImage, createImage }