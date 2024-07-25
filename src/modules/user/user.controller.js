import { User } from "../../../database/models/user.model.js"
import { sendEmail } from "../../email/email.js";
import jwt from 'jsonwebtoken'
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import bcrypt from 'bcrypt'
import { Application } from "../../../database/models/application.model.js";
import dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.SECRET_KEY;

//Sign Up
const signup=catchError(async(req,res)=>{
    let user =await User.insertMany(req.body)
      user[0].password = undefined;

    res.status(201).json({message:'success',user})
})

//sign in
const signin=catchError(async(req,res,next)=>{
    let user = await User.findOne({ $or: [ {email: req.body.email}, {mobileNumber: req.body.mobileNumber}]})
    if(!user || !bcrypt.compareSync(req.body.password,user.password))
        return next(new AppError('Invalid email or phone or password',400))
    jwt.sign({userId:user._id,role:user.role},secretKey,async(err,token)=>{
        if(err)return next(new AppError('Something went wrong',500))
            await user.updateOne({ status: 'online' })
            res.status(200).json({message:'Login successful',token:token})
    })
    
})


const signout=catchError(async(req,res,next)=>{
    let user = await User.findOne({ _id: req.user.userId })
    await user.updateOne({ status: 'offline' })
    res.status(200).json({message:'Logout successful'})
})

//update account.
const updateUser = catchError(async (req, res, next) => {
    let user = await User.findById(req.user.userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    if (req.body.firstName || req.body.lastName) {
        req.body.username = (req.body.firstName || user.firstName) + (req.body.lastName || user.lastName);
    }
    user = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true });

    res.status(200).json({ message: 'Success', user });
});

//delete account.
const deleteUser = catchError(async (req, res, next) => {
    let user = await User.findByIdAndDelete(req.user.userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    await Application.deleteMany({ userId: req.user.userId });
    res.status(200).json({ message: 'Success'});
});

//Get user account data 
const getAccountData=catchError(async(req,res)=>{
    let user = await User.findById(req.user.userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({message:'success',user})   
})

//Get profile data for another user 
const getProfileData=catchError(async(req,res)=>{
    let user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({message:'success',user})   
})

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-character OTP
};

// Forget Password
const forgetPassword = catchError(async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await user.save();
    
    const mail=user.email
    sendEmail(mail,otp);

    res.status(200).json({ message: 'OTP sent successfully' });
});

//Update password 
const updatePassword = catchError(async (req, res, next) => {
    const { otp, newPassword } = req.body;

    let user = await User.findOne({
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() } // Ensure OTP is not expired
    });
    if (!user) {
        return next(new AppError('Invalid or expired OTP', 400));
    }

    // const salt = await bcrypt.genSalt(12);
    user.password = bcrypt.hashSync(req.body.newPassword,8)
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
});


const regenerateOtp = catchError(async (req, res,next) => {
    const email = req.params.email;

    const user = await User.find(email);

    if (!user) {
        return next(new AppError('User not found',404))
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpired = new Date(Date.now() + 10 * 60 * 1000); 

    user.resetPasswordOTP = otpCode;
    user.resetPasswordExpires = otpExpired;
    await user.save();

    sendEmail(user.email, otpCode);

    res.status(200).json({ message: 'OTP regenerated successfully' });
}
)

//Get all accounts associated to a specific recovery Email 
const getAccountsRecovery=catchError(async(req,res)=>{
    let accounts = await User.find({recoveryEmail:req.params.email});
    if (!accounts) {
        return next(new AppError('account not found', 404));
    }
    res.status(200).json({message:'success',accounts})   
})



export{
    signup,signin,regenerateOtp,updateUser,deleteUser,getAccountData,getProfileData,getAccountsRecovery,
    forgetPassword,updatePassword
}