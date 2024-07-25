import express from 'express'
import { deleteUser, forgetPassword, getAccountData, getAccountsRecovery, getProfileData, regenerateOtp, signin, signup, updatePassword, updateUser } from './user.controller.js'
import { validate } from '../../middleware/validate.js'
import { accountsRecoveryVal, forgetPassVal, getProfileVal, signinVal, signupVal, updatePassVal, updateUserVal } from './user.validation.js'
import { auth, setRoleHR, setRoleUser } from '../../middleware/auth.js'
import { verifyToken } from '../../middleware/verifyToken.js'

const userRouter=express.Router()

userRouter.post('/signupuser',validate(signupVal),auth,setRoleUser,signup)
userRouter.post('/signuphr',validate(signupVal),auth,setRoleHR,signup)
userRouter.post('/signin',validate(signinVal),signin)
userRouter.put('/updateAccount',verifyToken,validate(updateUserVal),updateUser)
userRouter.delete('/deleteAccount',verifyToken,deleteUser)
userRouter.get('/getAccount',verifyToken,getAccountData)
userRouter.get('/getProfile/:id',validate(getProfileVal),getProfileData)
userRouter.get('/getAccountsrecovery/:email',validate(accountsRecoveryVal),getAccountsRecovery)
userRouter.post('/forgetPassword',validate(forgetPassVal),forgetPassword)
userRouter.post('/updatePassword', validate(updatePassVal),updatePassword)
userRouter.post('/regenerate-otp/:email',regenerateOtp)

export default userRouter