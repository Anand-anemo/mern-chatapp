import jwt, { decode } from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute=async (req,res,next)=>{
    try {

        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({error:"Unauthorized- No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(decoded);

        if(!decoded){
            return res.status(401).json({error:"Unauthorised - Invalid token"})
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        
        req.user=user;

        next();
    } catch (error) {
        console.log("error in protectroute middleware", error.message);
        res.status(500).json({error:"Interl server error"});
        
    }
}

export default protectRoute;