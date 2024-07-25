import { User } from "../../database/models/user.model.js";
import bcrypt from 'bcrypt'

export const auth = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(409).json({ message: "Email already exists" });
    }
    req.body.password=bcrypt.hashSync(req.body.password,8)
    req.body.username = req.body.firstName + req.body.lastName
    next();
   
};

export const setRoleUser=async(req,res,next)=>{
    req.body.role='user'
    next()
}
export const setRoleHR=async(req,res,next)=>{
    req.body.role='company_HR'
    next()
}