import { AppError } from "../utils/appError.js";


export const authRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

export const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403))
        }
        next();
    };
};