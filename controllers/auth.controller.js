const asyncHandler = require('express-async-handler');
const User = require("../models/user")
const bcrypt = require("bcrypt");
const userService = require("../services/user.service.js");
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {

    try {
        const userData = req.body;
        console.log(req.body)
        const newUser = await userService.createUser(userData);
        res.status(201).json({ "message": "A new user has been created" })
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", details: error.errors });
        } else {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const { _id } = foundUser;

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ message: 'Unauthorized, wrong password' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "email": foundUser.email
            }
        }
        ,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    )

    res.json({
        "userId": _id, "token": accessToken
    })
})

module.exports = {
    createUser, login
}