import mongoose, { Schema, model } from "mongoose"

const applicationSchema = new Schema({   
    jobId:{
        type: mongoose.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },   
    userTechSkills: {
        type: [String],
        required: true,
    }, 
    userSoftSkills: {
        type: [String],
        required: true,
    },
    userResume: {
    type: String,
    required: true,
  },
  
  },{
    timestamps: true,
  });
  
  
applicationSchema.post('init',function(doc){
    // doc.userResume="uploads/" +doc.userResume
    doc.userResume = `uploads/${doc.userResume}`;

}) 

export const Application = model('Application', applicationSchema);