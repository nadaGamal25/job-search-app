process.on('uncaughtException',(err)=>{
    console.log('error in code',err)
})
import express from 'express'
import { dbConnection } from './database/dbConnection.js'
import userRouter from './src/modules/user/user.routes.js'
import { globalError } from './src/middleware/globalError.js'
import { AppError } from './src/utils/appError.js'
import companyRouter from './src/modules/company/company.routes.js'
import jobRouter from './src/modules/job/job.routes.js'
import dotenv from 'dotenv';
import sirv from 'sirv';


dotenv.config();
const port = process.env.PORT || 3000;
const app =express()
app.use(express.json())

// app.use('/uploads', sirv('uploads', { dev: true }));


app.use('/user',userRouter)
app.use('/company',companyRouter)
app.use('/job',jobRouter)


app.use('*',(req,res,next)=>{
    next(new AppError(`route not found ${req.originalUrl}`,404))
})    

app.use(globalError)

process.on('unhandledRejection',(err)=>{
    console.log('error outside express',err)
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))