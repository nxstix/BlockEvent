const { Schema, model, models } = require('mongoose');

const ImageSchema = new Schema({
    imageData: { type: String, required: true}
}, { timestamps: true }
);

const Image = models.Image || model("Image", ImageSchema);
module.exports = Image;
