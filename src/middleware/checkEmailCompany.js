import { Company } from "../../database/models/company.model.js";


export const checkEmailCompany = async (req, res, next) => {
    const company = await Company.findOne({ companyEmail: req.body.companyEmail });
    if (company) {
        return res.status(409).json({ message: "Email already exists" });
    }

    next();
   
};