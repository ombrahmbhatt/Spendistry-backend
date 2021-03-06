const express = require('express');
const router = express.Router();
const AuthBusiness = require('../models/authBusiness');
const nodeMailer = require('nodemailer');
const otp = require('../models/otp');
const auth = require('../models/auth');


//get otp
router.get('/', async (req, res) => {
    try {
        const otp1 = await otp.find();
        res.json(otp1);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

//mailer 
const mailer = (email, subject, text) => {
    try {
    var transporter = nodeMailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        },
        tls: {
            rejectUnauthorized: false
        }

        });

        var mailOptions = {
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        
    } catch (error) {
        console.log(error);
        
    }

}

//send otp if password is forgotten
router.post('/forgotPassword', async (req, res) => {
    try {
        const vendor = await AuthBusiness.findOne({_id: req.body.email});
        const user = await auth.findOne({_id: req.body.email});
        if (vendor || user) {
            let otpcode = Math.floor(Math.random() * (999999 - 100000) + 100000);
            let subject = 'OTP for your spendistry account';
            let text = 'Your OTP is ' + otpcode;
            let email = req.body.email;
            mailer(email, subject, text);

            const otpData = new otp({
                email : req.body.email,
                otp : otpcode
            });
            const savedOtp = await otpData.save();

            res.status(201).json("OTP sent").send();

        } else{
            res.status(404).json("Cannot find this email").send();
        }
        
    } catch (err) {
        res.status(400).json({message: err.message}).send();
    }
});

//create otp for new user
router.post('/createAccount', async (req, res) => {
    try {
            let otpcode = Math.floor(Math.random() * (9999 - 1000) + 1000);
            let subject = 'OTP for your spendistry account';
            let text = 'Your OTP is ' + otpcode;
            let email = req.body.email;
            mailer(email, subject, text);
            const otpData = new otp({
                email : req.body.email,
                otp : otpcode
            });
            const savedOtp = await otpData.save();
            res.status(201).json("OTP sent").send();
    } catch (err) {
        res.status(400).json({message: err.message}).send();
    }
});


//verify otp
router.post('/verifyOtp', async (req, res) => {
    try {
        const email = await otp.findOne({email: req.body.email});
        if (!email) {
            return res.status(401).json({message: 'Cannot find email'});
        
        }
        const otpData = await otp.findOne({otp: req.body.otp});
        if (!otpData) {
            return res.status(401).json({message: 'Incorrect otp'});
        }
  
        //delete all documents with this email
        const deleteOtp = await otp.remove({email: req.body.email});
        res.status(201).json("OTP verified");
   
        
    } catch (error) {
        res.status(400).json({message: error.message});
        
    }
});


//delete by email in otp
router.delete('/deleteOtp/:email', async (req, res) => {
    try {
        const deleteOtp = await otp.findOneAndDelete({email: req.params.email});
        res.json(deleteOtp);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

//delete all email by email in otp
router.delete('/deleteAllOtp/:email', async (req, res) => {
    try {
        const deleteOtp = await otp.deleteMany({email: req.params.email});
        res.json(deleteOtp);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

router.delete('/deleteAllOtp', async (req, res) => {
    try {
        const deleteOtp = await otp.deleteMany({email: ""});
        res.json(deleteOtp);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});



module.exports = router;
