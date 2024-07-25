import mongoose, { Schema, model } from "mongoose"

const companySchema = new Schema({
   companyName: {
    type: String,
    required: true,
    unique: true,
  }, 
  description: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  numberOfEmployees: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
    companyEmail: {
      type: String,
      required: true,
      unique:true,
    },
    companyHR:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    }
  });
  
  

export const Company = model('Company', companySchema);