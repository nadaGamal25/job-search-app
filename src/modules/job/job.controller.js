import { Application } from "../../../database/models/application.model.js";
import { Company } from "../../../database/models/company.model.js";
import { Job } from "../../../database/models/job.model.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";


//Add Job 
const addJob=catchError(async(req,res)=>{
    let job =await Job.insertMany(req.body)
    res.status(201).json({message:'success',job})
})

//Update Job
const updateJob = catchError(async (req, res, next) => {
    let job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
        return next(new AppError('Job not found', 404));
    }
   
    res.status(200).json({ message: 'Success', job });
});


//delete Job
const deleteJob = catchError(async (req, res, next) => {
    let job = await Job.findByIdAndDelete({_id:req.params.id});
    if (!job) {
        return next(new AppError('job not found', 404));
    }
    await Application.deleteMany({ jobId: req.params.id });
    res.status(200).json({ message: 'Success'});
});

//Get all Jobs with their company’s information
const getAllJobsWithCompanyInfo = catchError(async (req, res, next) => {
    const jobs = await Job.find().populate('addedBy', 'firstName lastName ');
    
    if (!jobs || jobs.length === 0) {
        return next(new AppError('No jobs found', 404));
    }
    const jobWithCompanyInfo = await Promise.all(jobs.map(async (job) => {
        const company = await Company.findOne({ companyHR: job.addedBy._id })
            .select('companyName description industry address numberOfEmployees companyEmail');

        return {
            ...job._doc, // spread the job details Mongoose provides the _doc property, which contains the plain JavaScript object representation of the document.
            company
        };
    }));

    res.status(200).json({ message: 'Success', jobs: jobWithCompanyInfo });
});


//Get all Jobs for a specific company
const getJobsForCompany = catchError(async (req, res, next) => {
    const companyName = req.query.companyName;
    const company = await Company.findOne({ companyName });

    if (!company) {
        return next(new AppError('Company not found', 404));
    }
    const jobs = await Job.find({ addedBy: company.companyHR });

    if (!jobs || jobs.length === 0) {
        return next(new AppError('No jobs found for this company', 404));
    }

    res.status(200).json({ message: 'Success', jobs });
});

//Get all Jobs that match the following filters 
const getFilteredJobs = catchError(async (req, res, next) => {
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;

    const filters = {};
    if (workingTime) filters.workingTime = workingTime;
    if (jobLocation) filters.jobLocation = jobLocation;
    if (seniorityLevel) filters.seniorityLevel = seniorityLevel;
    if (jobTitle) filters.jobTitle = { $regex: jobTitle, $options: 'i' }; // Case-insensitive search for jobTitle
    if (technicalSkills) filters.technicalSkills = { $in: technicalSkills.split(',') }; // Split into array if comma-separated

    const jobs = await Job.find(filters);

    if (!jobs || jobs.length === 0) {
        return next(new AppError('No jobs found with the provided filters', 404));
    }

    res.status(200).json({ message: 'Success', jobs });
});

//Apply to Job
const applyToJob=catchError(async(req,res)=>{
     req.body.userResume=req.file.filename
    let job =await Application.create(req.body)
    res.status(201).json({message:'success',job})
    
})

export{
    addJob,updateJob,deleteJob,getAllJobsWithCompanyInfo,getJobsForCompany,getFilteredJobs,applyToJob
}
