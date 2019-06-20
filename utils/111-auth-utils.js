'use strict';

const app = require('../server');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

module.exports = {
    hashPassword: function (password) {
    return bcrypt.hashSync(password, salt);
  },

  comparePassword: function (password, hashedPassword) {
    password = '' + password; // to handle numeric passwords
    hashedPassword = '' + hashedPassword;
    return bcrypt.compareSync(password, hashedPassword);
  },

  generateOTP: function () { 
    let OTP = ''; 
    for (let i = 0; i < 6; i++ ) { 
        OTP += Math.floor(Math.random() * 10); 
    } 
    return OTP; 
    },
    
    verifyOTP: function(enteredOTP, dbOTP) {
        if(enteredOTP === dbOTP) {
            return true;
        } else {
            return false;
        }
    }
}