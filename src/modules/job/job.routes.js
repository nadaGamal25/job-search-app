import express from 'express'
import { addJob, applyToJob, deleteJob, getAllJobsWithCompanyInfo, getFilteredJobs, getJobsForCompany, updateJob } from './job.controller.js'
import { JobsForCompanyVal, addJobVal, applyJobVal, deleteJobVal, jobsFilterVal, updateJobVal } from './job.validation.js'
import { authRole, authorizeRole } from '../../middleware/authRole.js'
import { verifyToken } from '../../middleware/verifyToken.js'
import { validate } from '../../middleware/validate.js'
import { uploadSingleFile } from '../../fileUpload/fileUpload.js'

const jobRouter=express.Router()
jobRouter.post('/add',verifyToken,authRole('company_HR'),validate(addJobVal),addJob)
jobRouter.put('/update/:id',verifyToken,authRole('company_HR'),validate(updateJobVal),updateJob)
jobRouter.delete('/delete/:id',verifyToken,authRole('company_HR'),validate(deleteJobVal),deleteJob)
jobRouter.get('/get-with-company',verifyToken,authRole('company_HR'),getAllJobsWithCompanyInfo)
jobRouter.get('/jobs-for-company', verifyToken, authorizeRole(['company_HR', 'User']),validate(JobsForCompanyVal), getJobsForCompany);
jobRouter.get('/filter', verifyToken, authorizeRole(['company_HR', 'User']),validate(jobsFilterVal), getFilteredJobs);
// when test on postman remove validate(applyJobVal) as it make problem with array in form-data
jobRouter.post('/applytojob',verifyToken,authRole('user'),uploadSingleFile('userResume'),applyToJob)

export default jobRouter