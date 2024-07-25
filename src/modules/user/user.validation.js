import Joi from 'joi'


const signupVal=Joi.object({
    firstName:Joi.string().min(3).max(100).required(),
    lastName:Joi.string().min(3).max(100).required(),
    username:Joi.string().min(3).max(200),
    email:Joi.string().email().required(),
    recoveryEmail:Joi.string().email().required(),
    password:Joi.string().pattern(/^[A-Z][A-Za-z0-9#@$]{8,20}$/).required(),
    repassword:Joi.string().valid(Joi.ref('password')),
    DOB:Joi.date().required(),
    mobileNumber:Joi.string().required(),
    role:Joi.string(),
    status:Joi.string(),
})

const signinVal = Joi.object({
    email: Joi.string().email().optional(),
    mobileNumber: Joi.string().optional(),
    password: Joi.string().pattern(/^[A-Z][A-Za-z0-9#@$]{8,20}$/).required()
}).or('email', 'mobileNumber')

const updateUserVal=Joi.object({
    firstName:Joi.string().min(3).max(100),
    lastName:Joi.string().min(3).max(100),
    username:Joi.string().min(3).max(200),
    email:Joi.string().email(),
    recoveryEmail:Joi.string().email(),
    DOB:Joi.date(),
    mobileNumber:Joi.string(),
})

const getProfileVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
})

const accountsRecoveryVal=Joi.object({
    email:Joi.string().email().required(),
})

const forgetPassVal=Joi.object({
    email:Joi.string().email().required(),
})

const updatePassVal=Joi.object({
    otp:Joi.string().required(),
    newPassword :Joi.string().pattern(/^[A-Z][A-Za-z0-9#@$]{8,20}$/).required()
})
export{
    signupVal,signinVal,updateUserVal,getProfileVal,accountsRecoveryVal,forgetPassVal,updatePassVal
}