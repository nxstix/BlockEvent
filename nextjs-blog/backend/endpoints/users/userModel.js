const { Schema, model, models } = require('mongoose');
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthdate: { type: String, required: true },
    isAdministrator: { type: Boolean, default: false },
    isEventmanager: { type: Boolean, default: false },
    walletAddress: {type: String},
}, { timestamps: true }
);

// middelware function
UserSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword, next) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        next(null, isMatch);
    } catch (err) {
        next(err);
    }
};

const User = models.User || model("User", UserSchema);
module.exports = User;
