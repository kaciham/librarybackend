const User = require('../models/user');

const createUser = async (userData) => {
    try {
        const email = userData.email;
        if(await User.findOne({ email })) {
            throw new Error("Email already exists");
        }
        else
      {
        const user = new User(userData);
        await user.save();
        return user;
      }
    } catch (error) {
        throw new Error("User hasn't been created" + error.message);
    }
}

module.exports = {
    createUser
}

//rajouter un find pour ne pas écrire deux fois le même email en bdd