const User = require('../models/user');

const createUser = async (userData) => {
    try {
        const user = new User(userData);
        await user.save();
        return user;
    } catch (error) {
        throw new Error("User hasn't been created" + error.message);
    }
}

module.exports = {
    createUser
}