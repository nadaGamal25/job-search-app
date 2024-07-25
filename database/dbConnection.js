import mongoose from "mongoose"
import dotenv from 'dotenv';
dotenv.config();

const dbUri = process.env.DB_URI;
export const dbConnection= mongoose.connect(dbUri).then(()=>{
    console.log('connected to mongoDB')
})
