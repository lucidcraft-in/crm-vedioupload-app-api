const express = require('express')
const router = express.Router()
const userModel = require('../models/adminModel')
const adminModel = require('../models/adminModel')
require('dotenv').config()
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const  nodemailer = require('nodemailer')
const { log } = require('console')


//OTP
transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.OTP_USER,
        pass:process.env.OTP_PASSWORD
    }
})

 

//admin login
router.post('/login', async(req,res) =>{
    try{
        //fetch data from body
        const {email, password} = req.body
        // console.log('req.body', req.body);
        

        if(!email || !password) {
            return res.status(400).json({message:'email and password filed is required'})
        }

        const admin = await adminModel.findOne({email})
        if(!admin){
            return res.status(400).json({message:"Admin not found"})
        }

        if(admin.role !== 'admin'){
            return res.status(400).json({message:"invalid role"})
        }

        const  isMatch = await bcrypt.compare(password,admin.password)
        if(!isMatch){
            return res.status(400).json({message:"invalid password"})
        }
        req.session.adminId =admin._id 

        // console.log(req.session.adminId);
        
        res.status(200).json({message:'Login successfull...!'})

    }catch(error){
        console.log(error);
        res.status(500).json({message:"internal server error"})
    }
})

//admin logout
router.post('/logout', async(req,res) =>{
    try{
        req.session.destroy((err) =>{
            if(err) {
                console.log("Logout error", err);
                
            }
            res.clearCookie('connect.sid')
            res.status(200).json({message:"Logout successfull"})
        })
    }catch(error){
        console.log(error);
        res.status(500).json({message:"internal server error"})
        
    }
})


router.post('/forgot-password',async(req,res) =>{
    try{
        const {email} = req.body
        const adminExist = await adminModel.findOne({email})

        if(!adminExist){
            return res.status(500).json({message:"admin email not found"})
        }

        //create 6 digit otp
        const otp = crypto.randomInt(100000,999999).toString()
 
        adminExist.resetPassword = otp
        await adminExist.save()

        //send otp by email
        const mailOptions = {
            from: process.env.OTP_USER,
            to:adminExist.email,
            subject:"Forgot Password",
            text:`hi ${adminExist.role},  Your OTP is ${otp}`
        }

        transporter.sendMail(mailOptions, (err,info) =>{
            if(err){
                console.log(err)
                res.status(500).json('error sending email')
            }else{
                console.log(`email send ${info.response}`);
            }
        })

        res.status(200).json({message:"email sending..."})


    }catch(error){
        console.log(error)
        res.status(500).json({message:"internal server error.."})
    }
})


router.post('/reset-password' , async(req,res) =>{
    try{
        const {otp, newPassword, confirmPassword} = req.body
    const adminExist = await adminModel.findOne({resetPassword:otp})
    if(!adminExist){
        return res.status(400).json({message:" OTP does not match"})
    }

    if(newPassword !== confirmPassword){
        return res.status(400).json({message:'Password do not match'})
    }

    const hashedPassword = await bcrypt.hash(newPassword,10)
    adminExist.password =hashedPassword;
    adminExist.resetPassword = undefined
    await adminExist.save()

    return res.status(200).json({ message: "Password reset successfully" });
    
    }catch(error){
        console.log(error);
        res.status(500).json({message:'internal server error'})
        
    }
})


module.exports = router