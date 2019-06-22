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

router.get('/verifyToken/:token', (req, res)=>{
    let error = false;
        try {
            jwt.verify(req.params.token, SECRET_KEY);
        } catch(err) {
            error = true; 
        }

        if(!error) {
            res.json({success: true})
        } else {
            res.json({success: false})
        }
})

router.get('/check/:phoneNumber', (req, res)=>{
    const phoneNumber = Number(req.params.phoneNumber);
    User.findOne({
        phoneNumber: phoneNumber
    })
    .then(user => {
        if(user) {
            if(user.otp) {
                res.status(200).send({success: true, message:'User exists', statusCode: 200, redirectTo: 'otp', data: { userCode:user.userCode, email: user.email}});
            } else {
                res.status(200).send({success: true, message:'User exists', statusCode: 200, redirectTo: 'password'});
            }
        } else {
            res.status(200).send({success: false, message:'User does not exist', statusCode: 200, data: phoneNumber});
        }
    })
});

router.post('/signup', (req, res, next)=>{
    const body = req.body;
    const otp = authUtils.generateOTP();
    User.findOne({
        $or: [
            {
                phoneNumber: Number(req.body.phoneNumber),
                isActive: true
            },{
                userCode: req.body.userCode.toString(),
                isActive: true
            }
        ]
    })
    .then((userData, err) =>{
        if(userData) {
            res.status(201).send({success: false, message: 'User already exists', redirectTo: 'error'});
            return 'exists';
        } else {
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
            return user.save();
        }
    })
    .then((userData, err)=>{
        if(err || !userData) {
            res.status(201).send({success: false, message:'User Not Created', redirectTo: 'signup'});
        } else if(userData !== 'exists' ) {
            let url = body.url || 'localhost:3000';
            let text = `Your account activation otp is ${otp}`;
        
            let emailUtility = emailUtils.sendEmail(userData.email, text);
            emailUtility.transporter.sendMail(emailUtility.mailOptions, (err, data)=>{
                if(err) {
                    res.status(201).send({success: false, message:'Email not sent', redirectTo: 'login'});
                } else {
                    res.status(200).send({success: true, message:'User created and email sent, check email for otp'});
                }
            });
        }
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
            res.status(201).send({success: false, message: 'User not found, Please sign up', redirectTo: 'signup'});
        }

        if (authUtils.comparePassword(req.body.password, user.password)) {
            if(user.otp) {
                res.status(200).send({success: false, message: 'go to the link sent in the email to activate account', redirectTo: 'email'});
            } else {
                let token = jwt.sign(user.toJSON(), SECRET_KEY);
                res.json({token: token});
            }

        } else {
            res.status(201).send({success: false, message:'Wrong Username or password', redirectTo: 'error'});
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
            res.status(201).send({success:false, message:'Some error occured in saving user data', redirectTo: 'error'});
        }
        if(check) {
            userData.loginRetryCount = userData.loginRetryCount + 1;
            let user = new User(userData);
            return user.save();
        } else {
            res.status(200).send({success: true, redirectTo: 'login'});
        }
    })
    .then((user, err)=>{
        if(check) {
            res.redirect('/');
        }
    })
});

router.post('/generateOTP', (req, res) => {
    let email = req.body.email;
    let userCode = req.body.userCode;
    let otp = authUtils.generateOTP()
    User.findOne({
            email: email,
            userCode: userCode,
            isActive: true
    })
    .then(userData => {
        userData.otp = otp;
        let user = new User(userData)
        return user.save()
    })
    .then(userData => {
        let url = req.body.url || 'localhost:3000';
        let text = `Your forgot password OTP is ${otp}`;        

        let emailUtility = emailUtils.sendEmail(userData.email, text);
        emailUtility.transporter.sendMail(emailUtility.mailOptions, (err, data)=>{
            if(err) {
                res.status(200).send('email not sent');
            } else {
                res.status(200).send({success: true, message:'Email generated and sent, check email for otp', data: userCode});
            }
        });
    });
});

router.post('/forgotPassword', (req, res, next)=>{

    let body = req.body;
    let password = authUtils.hashPassword(req.body.password).toString();
    User.findOne({
        userCode: body.userCode,
        email: body.email,
        isActive: true            
    })
    .then(userData=> {
        if(userData.otp) {
            res.redirect('/');
        }
        userData.password = password;
        let user = new User(userData);
        return user.save();
    })
    .then(userData => {
        if(!userData) {
            res.status(200).send({success: false, message:'Password not updated', redirectTo: 'error'});
        }
        res.status(200).send({success:true, message:'Password updated successfully', redirectTo: 'login'});
    });
});

router.post('/updatePassword', (req, res, next)=> {
    let payload;
    try {
    payload = jwt.verify(JSON.parse(req.body.token), SECRET_KEY);
    } catch(err) {
        res.status(401).send({success: false, message: 'Unauthorized', statusCode: 401, redirectTo: '/'});
        return 0;
    }

    let userCode = payload.userCode;
    let password = payload.password;

    User.findOne({
        userCode: userCode,
    })
    .then(userData => {
        if(!authUtils.comparePassword(req.body.currentPassword, password)) {
            res.status(201).send({success: false, message:'Wrong username password', redirectTo: 'error'});
        } else {
            let newPassword = authUtils.hashPassword(req.body.newPassword).toString();
            userData.password = newPassword;
            let user = new User(userData);
            return user.save()
        }
    })
    .then(userData => {
        if(!userData) {
            res.status(200).send({success: false, message:'Password not updated', redirectTo: 'error'});
        }
        res.status(200).send({success: true, message:'Password updated', redirectTo: 'login'});
    });
});
module.exports = router;