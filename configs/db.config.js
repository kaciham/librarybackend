require('dotenv').config();
const mongoose = require("mongoose");

const uri = process.env.DATABASE_CONNEXION;

mongoose.connect(uri).then(() => {
    console.log("Connected to MongoDb")
}).catch((error) => {
    console.log("Error connecting to MongoDB", error.message)
});

module.exports = mongoose;