import Joi from 'joi'


const addCompanyVal=Joi.object({
    companyName:Joi.string().min(3).max(150).required(),
    description:Joi.string().min(3).max(300).required(),
    industry:Joi.string().min(3).max(200).required(),
    address:Joi.string().min(3).max(200).required(),
    companyEmail:Joi.string().email().required(),
    companyHR:Joi.string().hex().length(24).required(),
    numberOfEmployees: Joi.object({
        min: Joi.number().integer().min(1).required(),
        max: Joi.number().integer().min(Joi.ref('min')).required()
    }).required(),
})

const updateCompanyVal=Joi.object({
    companyName:Joi.string().min(3).max(150),
    description:Joi.string().min(3).max(300),
    industry:Joi.string().min(3).max(200),
    address:Joi.string().min(3).max(200),
    companyEmail:Joi.string().email(),
    numberOfEmployees: Joi.object({
        min: Joi.number().integer().min(1),
        max: Joi.number().integer().min(Joi.ref('min'))
    }),
})

const SearchCompanynameVal=Joi.object({
    name:Joi.string().min(3).max(150),
    
})

const getCompanyDataVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
})

const getApplicationsVal=Joi.object({
    jobId:Joi.string().hex().length(24).required(),
})

export{
    addCompanyVal,updateCompanyVal,SearchCompanynameVal,getCompanyDataVal,getApplicationsVal
}