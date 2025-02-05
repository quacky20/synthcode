import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";

export const verifyJWT=asyncHandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        console.log(token,"token")
        if(!token)
            throw new ApiError(401,"unauthorized request")
    
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401,"Invalid access token")
        }
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access token")
    }
})



export const validateToken = asyncHandler(async (req, res) => {
  // If we reach here, the JWT is valid and decoded
  // Send back the user details
  return res.status(200).json({ user: req.user });
});