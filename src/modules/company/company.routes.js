import express from 'express'
import { addCompany, createApplicationsExcel, deleteCompany, getApplicationsForJob, getCompanyData, searchCompany, updateCompany } from './company.controller.js'
import { verifyToken } from '../../middleware/verifyToken.js'
import { authRole, authorizeRole } from '../../middleware/authRole.js'
import { validate } from '../../middleware/validate.js'
import { SearchCompanynameVal, addCompanyVal, getApplicationsVal, getCompanyDataVal, updateCompanyVal } from './company.validation.js'
import { checkEmailCompany } from '../../middleware/checkEmailCompany.js'

const companyRouter=express.Router()
companyRouter.post('/add',verifyToken,authRole('company_HR'),validate(addCompanyVal),addCompany)
companyRouter.put('/update',verifyToken,authRole('company_HR'),validate(updateCompanyVal),checkEmailCompany,updateCompany)
companyRouter.delete('/delete',verifyToken,authRole('company_HR'),deleteCompany)
companyRouter.get('/search-company', verifyToken, authorizeRole(['company_HR', 'User']),validate(SearchCompanynameVal), searchCompany);
companyRouter.get('/get-jobs-data/:id',verifyToken,authRole('company_HR'),validate(getCompanyDataVal),getCompanyData)
companyRouter.get('/all-apps/:jobId',verifyToken,authRole('company_HR'),validate(getApplicationsVal),getApplicationsForJob)
companyRouter.get('/applications/excel', verifyToken, createApplicationsExcel);

export default companyRouter
