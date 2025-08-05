import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';


export const verifyJWT = asyncHandler(async (req, _, next) => {
   
    try {
        const token = req.coookies?.accessToken || req.headers
        ("Authorization")?.replace("Bearer ", "");
    
        if (!token) {
            throw new ApiError(401, "You are not authorized to access this resource");
        }
    
        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
       const user =  await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        ) // value geting from model 
    
        if (!user) {
            // discuss about frontend
            throw new ApiError(401, "Invalid token or user not found");
        }
    
        req.user = user; // attach user to request object
        next(); // call next middleware or route handler
    
    } catch (error) {
        throw new ApiError(401, error.message || "You are not authorized to access this resource");
        
    }
})