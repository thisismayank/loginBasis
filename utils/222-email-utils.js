'use strict'

require('dotenv').config();
const nodemailer = require('nodemailer')

module.exports = {
    sendEmail: function(to, text) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
        
        let mailOptions = {
            from: process.env.EMAIL,
            to: to,
            to: to,
            subject: 'OTP verification',
            text: text
        };
        
        return ({transporter: transporter, mailOptions: mailOptions});
        // return transporter.sendMail(mailOptions, (err, data)=>{
        //     console.log('in here');
        //     if(err) {
        //         console.log('status in else', status);
        //     } else {
        //         console.log('email sent');
        //     }
        // })
    }
}
