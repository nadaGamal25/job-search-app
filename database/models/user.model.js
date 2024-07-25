import { Schema, model } from "mongoose"

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  }, 
  lastName: {
    type: String,
    required: true,
  },
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    recoveryEmail: {
      type: String,
      required: true,
    },
    DOB:{
      type: Date,
      required: true,
    },
    mobileNumber:{
      type: String,
      required:true,
      unique: true,
    },
    role:{
      type: String,
      enum: ['user', 'company_HR'],
    },
    status:{
      type: String,
      default:'offline',
      enum: ['online', 'offline'],
    },
    resetPasswordOTP: String,
    resetPasswordExpires: Date
  });
  

export const User = model('User', userSchema);