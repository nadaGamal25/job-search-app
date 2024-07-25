import { Application } from "../../../database/models/application.model.js"
import { Company } from "../../../database/models/company.model.js"
import { Job } from "../../../database/models/job.model.js"
import { User } from "../../../database/models/user.model.js"
import { catchError } from "../../middleware/catchError.js"
import exceljs from 'exceljs'

//Add company 
const addCompany=catchError(async(req,res)=>{
    let company =await Company.insertMany(req.body)
    res.status(201).json({message:'success',company})
})

//Update company data
const updateCompany = catchError(async (req, res, next) => {
    let company = await Company.findOneAndUpdate({companyHR:req.user.userId}, req.body, { new: true });
    if (!company) {
        return next(new AppError('company not found', 404));
    }
   
    res.status(200).json({ message: 'Success', company });
});

//Delete company data
const deleteCompany = catchError(async (req, res, next) => {
    let company = await Company.findOneAndDelete({companyHR:req.user.userId});
    if (!company) {
        return next(new AppError('company not found', 404));
    }
    // Delete all jobs related to the company
    await Job.deleteMany({ addedBy: req.user.userId });
    res.status(200).json({ message: 'Success'});
});

//Get company data 
const getCompanyData = catchError(async (req, res, next) => {
    const company = await Company.findById(req.params.id);
    if (!company) {
        return next(new AppError('Company not found', 404));
    }
    const jobs = await Job.find({ addedBy: company.companyHR });

    res.status(200).json({message: 'Success',jobs});
});

//Search for a company with a name
const searchCompany = catchError(async (req, res, next) => {
    const { name } = req.query;
    if (!name) {
        return next(new AppError('Company name is required to search', 400));
    }
    const companies = await Company.find({});
    if (companies.length === 0) {
        return next(new AppError('No companies found', 404));
    }
    const filteredCompanies = companies.filter(company => 
        company.companyName.toLowerCase().includes(name.toLowerCase())
    );

    if (filteredCompanies.length === 0) {
        return next(new AppError('No companies found with the given name', 404));
    }

    res.status(200).json({ message: 'Success', companies: filteredCompanies });
});

//Get all applications for specific Jobs
const getApplicationsForJob = catchError(async (req, res, next) => {
    const { jobId } = req.params;
    const userId = req.user.userId;
    // Find the job to ensure it belongs to the requesting company HR
    const job = await Job.findById(jobId).populate('addedBy');
    if (!job) {
        return next(new AppError('Job not found', 404));
    }
    if (job.addedBy._id.toString() !== userId) {
        return next(new AppError('You do not have permission to access these applications', 403));
    }
    const applications = await Application.find({ jobId })
        .populate('userId', 'firstName lastName email mobileNumber DOB');

    res.status(200).json({ message: 'success', applications });
});

//Bonus Points Add an endpoint that collects the applications
const createApplicationsExcel = catchError(async (req, res, next) => {
    const { companyId, date } = req.query;

    // Validate the company ID and date
    if (!companyId || !date) {
        return next(new AppError('Company ID and date are required', 400));
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
        return next(new AppError('Invalid date format', 400));
    }

    // Ensure the user has access to the specified company
    const userId = req.user.userId;
    const company = await Company.findById(companyId);
    if (!company) {
        return next(new AppError('Company not found', 404));
    }

    // if (company.companyHR.toString() !== userId) {
    //     return next(new AppError('You do not have permission to access this company\'s applications', 403));
    // }

    // Fetch applications for the specified company on the specified date
    const startDate = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endDate = new Date(parsedDate.setHours(23, 59, 59, 999));

    const applications = await Application.find({
        createdAt: { $gte: startDate, $lte: endDate }
    }).populate('userId', 'firstName lastName email mobileNumber DOB').populate({
        path: 'jobId',
        match: { addedBy: company.companyHR },
        select: 'jobTitle jobLocation workingTime seniorityLevel'
    });

    // Filter applications by jobs that belong to the specified company
    const filteredApplications = applications.filter(app => app.jobId);

    // Create an Excel sheet with the application data
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    // Add columns to the worksheet
    worksheet.columns = [
        { header: 'First Name', key: 'firstName', width: 20 },
        { header: 'Last Name', key: 'lastName', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Mobile Number', key: 'mobileNumber', width: 15 },
        { header: 'Date of Birth', key: 'DOB', width: 15 },
        { header: 'Job Title', key: 'jobTitle', width: 30 },
        { header: 'Job Location', key: 'jobLocation', width: 15 },
        { header: 'Working Time', key: 'workingTime', width: 15 },
        { header: 'Seniority Level', key: 'seniorityLevel', width: 15 }
    ];

    // Add rows to the worksheet
    filteredApplications.forEach(app => {
        worksheet.addRow({
            firstName: app.userId.firstName,
            lastName: app.userId.lastName,
            email: app.userId.email,
            mobileNumber: app.userId.mobileNumber,
            DOB: app.userId.DOB,
            jobTitle: app.jobId.jobTitle,
            jobLocation: app.jobId.jobLocation,
            workingTime: app.jobId.workingTime,
            seniorityLevel: app.jobId.seniorityLevel
        });
    });

    // Set the response headers and send the Excel file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=applications.xlsx');

    await workbook.xlsx.write(res);
    res.end();
});

export{
    addCompany,updateCompany,deleteCompany,searchCompany,getCompanyData,getApplicationsForJob,
    createApplicationsExcel
}