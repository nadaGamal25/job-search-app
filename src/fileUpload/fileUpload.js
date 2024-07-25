import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/appError.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const fileUpload=()=>{
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/')
        },
        filename: (req, file, cb) => {
            cb(null , uuidv4() +"-"+ file.originalname)
        }
    })

    function fileFilter(req,file,cb){
        if(file.mimetype.startsWith('application/pdf')){
            cb(null,true)
        }else{
            cb(new AppError('upload pdf only',401),false)
        }
 
    }

    const upload=multer({
        storage,fileFilter,limits:{
            fileSize: 1024*1024*5,
        }
    })
    return upload
}

export const uploadSingleFile= fieldname=> fileUpload().single(fieldname)


// const fileUpload = () => {
//   const storage = multer.memoryStorage();

//   function fileFilter(req, file, cb) {
//     if (file.mimetype.startsWith('application/pdf')) {
//       cb(null, true);
//     } else {
//       cb(new AppError('Upload PDF only', 401), false);
//     }
//   }

//   const upload = multer({
//     storage,
//     fileFilter,
//     limits: {
//       fileSize: 1024 * 1024 * 5, // 5MB limit
//     }
//   });

//   return upload;
// };

// const uploadToSirv = async (file) => {
//   const { SIRV_CLIENT_ID, SIRV_CLIENT_SECRET } = process.env;

//   console.log('SIRV_CLIENT_ID:', SIRV_CLIENT_ID); // Debugging line
//   console.log('SIRV_CLIENT_SECRET:', SIRV_CLIENT_SECRET); // Debugging line

//   try {
//     // Obtain access token
//     const authResponse = await axios.post('https://api.sirv.com/v2/token', {
//       clientId: SIRV_CLIENT_ID,
//       clientSecret: SIRV_CLIENT_SECRET,
//     });

//     console.log('Auth Response Status:', authResponse.status); // Debugging line
//     console.log('Auth Response Data:', authResponse.data); // Debugging line

//     const { accessToken } = authResponse.data;

//     // Upload file to Sirv
//     const uploadResponse = await axios.post(
//       `https://api.sirv.com/v2/files/upload?filename=/uploads/${uuidv4()}-${file.originalname}`,
//       file.buffer,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': file.mimetype,
//         }
//       }
//     );

//     console.log('Upload Response Status:', uploadResponse.status); // Debugging line
//     console.log('Upload Response Data:', uploadResponse.data); // Debugging line

//     return uploadResponse.data.url;
//   } catch (error) {
//     console.error('Error during authentication or upload:', error.response ? error.response.data : error.message);
//     throw new Error('Failed to authenticate or upload to Sirv');
//   }
// };

// export const uploadSingleFile = (fieldname) => (req, res, next) => {
//   const upload = fileUpload().single(fieldname);
//   upload(req, res, async (err) => {
//     if (err) {
//       return next(err);
//     }
//     try {
//       if (req.file) {
//         const url = await uploadToSirv(req.file);
//         req.body.userResume = url; // Save the URL in the request body
//       }
//       next();
//     } catch (error) {
//       next(error);
//     }
//   });
// };