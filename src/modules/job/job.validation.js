import Joi from 'joi'


const addJobVal=Joi.object({
    jobTitle: Joi.string().min(3).max(100).required(),
    jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').required(),
    workingTime: Joi.string().valid('part-time', 'full-time').required(),
    seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').required(),
    jobDescription: Joi.string().min(10).max(1000).required(),
    technicalSkills: Joi.array().items(Joi.string().min(1).max(100)).min(1).required(),
    softSkills: Joi.array().items(Joi.string().min(1).max(100)).min(1).required(),
    addedBy: Joi.string().hex().length(24).required(),
});
const updateJobVal=Joi.object({
    jobTitle: Joi.string().min(3).max(100).required(),
    jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid'),
    workingTime: Joi.string().valid('part-time', 'full-time'),
    seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
    jobDescription: Joi.string().min(10).max(1000).required(),
    technicalSkills: Joi.array().items(Joi.string().min(0).max(100)).min(0),
    softSkills: Joi.array().items(Joi.string().min(0).max(100)).min(0),
    id:Joi.string().hex().length(24).required(),
})
const deleteJobVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
})

const JobsForCompanyVal=Joi.object({
    companyName:Joi.string().min(3).max(150).required(),
})

const jobsFilterVal=Joi.object({
    jobTitle: Joi.string().min(3).max(100),
    jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid'),
    workingTime: Joi.string().valid('part-time', 'full-time'),
    seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
    technicalSkills: Joi.string(),
});

const applyJobVal =Joi.object({
    jobId:Joi.string().hex().length(24).required(),
    userId:Joi.string().hex().length(24).required(),
    userTechSkills:Joi.array().items(Joi.string().min(1).max(100)).min(1).required(),
    userSoftSkills:Joi.array().items(Joi.string().min(1).max(100)).min(1).required(),
    resume:Joi.string().required(),

})
export{
    addJobVal,updateJobVal,deleteJobVal,JobsForCompanyVal,jobsFilterVal,applyJobVal
}