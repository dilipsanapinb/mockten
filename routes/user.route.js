const express = require('express');

const { User } = require('../models/user.model');

const bcrypt = require('bcrypt');

require('dotenv').config();

const jwt=require('jsonwebtoken')

const userRouter = express.Router();

userRouter.get('/api', async(req, res) => {
    try {
        let users = await User.find();
        res.status(201).send({ "Message": "All Users", "Users": users })
    } catch (error) {
                res.status(400).send({ "Message": error.Message });
        console.log(error);
    }
})

userRouter.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        bcrypt.hash(password, 5, async function (err, hash) {
            if (err) {
                res.status(400).send({ "Message": err.Message });
                console.log(err);
            } else {
                const user = new User({ name, email, password: hash });
                await user.save();
                res.status(201).send({ "Message": "Registration is succesfull", "User": user })
            }
        });
        
    } catch (error) {
        res.status(400).send({ "Message": error.Message });
        console.log(error);
    }
});


// Login

userRouter.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });

    const hashPassword = user.password;

    try {
        bcrypt.compare(password, hashPassword, function (err, result) {
            if (result) {
                var token = jwt.sign({ userID: user._id }, process.env.key);
                res.status(201).send({ "Message": "Sign in is succesfull", "token": token })
            } else {
                res.status(400).send({ "Message": err.Message });
                console.log(err);
            }
        });
    } catch (error) {
        res.status(400).send({ "Message": error.Message });
        console.log(error);
    }
});

module.exports={userRouter}

