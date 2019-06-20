'use strict';

const express = require('express');
const app = express();
const router = express.Router();

// cors
const cors = require('cors');

// utils
const authUtils = require('../utils/111-auth-utils');
const emailUtils = require('../utils/222-email-utils');

// jwt
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretKey';

// model
const User = require('../models/user');
const mongoose = require('mongoose');
// to handle cross-origin-requests
router.use(cors());

router.post('/signup', (req, res, next)=>{
    const body = req.body;
    const otp = authUtils.generateOTP();
    const data = {
        _id: new mongoose.Types.ObjectId(),
        firstName: body.firstName.toString(),
        lastName: body.lastName ? body.lastName.toString():null,
        phoneNumber: body.phoneNumber.toString(),
        userCode: body.userCode.toString(),
        email: email.userCode.toString(),
        password: authUtils.hashPassword(req.body.password).toString(),
        otp: otp,
        isActive: true
    };

    const user = new User(data);
    user.save()
    .then((user, err)=>{
        if(err) {
            res.status(401).send('User Not Created');
        }
        res.status(200).send('User Created successfully');
    });
})

module.exports = router;