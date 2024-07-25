export const generateOtp = (req, res, next) => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); 
    const otpExpired = new Date(Date.now() + 10 * 60 * 1000); 
  
    req.body.otpCode = otpCode;
    req.body.otpExpired = otpExpired;
  
    next();
};