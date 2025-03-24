const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
    }, {
    timestamps: false
}
)

userSchema.pre('save', async function (next) {
     if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

userSchema.plugin(uniqueValidator, { message: 'Email already exists' });

const User = mongoose.model("User", userSchema);

module.exports = User;