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

router.get('/', (req, res)=>{
    res.status(200).send('');
});

router.post('/signup', (req, res, next)=>{
    const body = req.body;
    const otp = authUtils.generateOTP();
    const data = {
        _id: new mongoose.Types.ObjectId(),
        firstName: body.firstName.toString(),
        lastName: body.lastName ? body.lastName.toString():null,
        phoneNumber: body.phoneNumber.toString(),
        userCode: body.userCode.toString(),
        email: body.email.toString(),
        password: authUtils.hashPassword(req.body.password).toString(),
        otp: otp,
        loginRetryCount: 0,
        isActive: true
    };

    const user = new User(data);
    user.save()
    .then((user, err)=>{
        if(err) {
            res.status(401).send('User Not Created');
        }
        res.status(200).send({success: true, message: 'User Created successfully', data: data});
    });
});

router.post('/login', (req, res, next)=>{
    const body = req.body;
    User.findOne({
            phoneNumber: Number(body.phoneNumber),
            isActive: true
    })
    .then((user, err)=>{
        if(err) {
            res.status(401).send({success: false, message: 'User not found, Please sign up', redirectTo: '/signup'});
        }

        if (authUtils.comparePassword(req.body.password, user.password)) {
            if(user.otp) {
                res.status(401).send({success: false, message: 'go to the link sent in the email to activate account'});
            } else {
                let token = jwt.sign(user.toJSON(), SECRET_KEY);
                res.json({token: token});
            }

        } else {
            res.status(401).send('Wrong Username or password');
        }
    })
})

router.post('/verifyOTP', (req, res)=>{
    let check = false;
    User.findOne({
            userCode: req.body.userCode,
            otp: Number(req.body.otp),
            isActive: true
    })
    .then((userData, err) => {
        if(err || !userData) {
            check = true;
            return User.findOne({ userCode: req.body.userCode, otp: {$ne: null}, isActive: true});
        } else {
            userData.otp = null;
            let user = new User(userData);
            return user.save();
        }
    })
    .then((userData, err)=>{
        if(err) {
            res.status(401).send('Some error occured');
        }
        if(check) {
            userData.loginRetryCount = userData.loginRetryCount + 1;
            let user = new User(userData);
            return user.save();
        } else {
            res.status(200).send({success: true, redirectTo: '/login'});
        }
    })
    .then((user, err)=>{
        if(check) {
            res.redirect('/');
        }
    })
});

module.exports = router;