import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
export const authenticate = async (req, res, next) => {
    try{
        const token=req.headers.token;
        
        const decodedToken=jwt.verify(token,process.env.JWT_SECRET);

        const user= await User.findById(decodedToken.id).select("-password");

        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        req.user=user;
        next();

    }catch(err){
        res.status(401).json({message:"Invalid token"});
    }
}

export const checkauth=(req,res)=>{
    res.status(200).json({message:"Authenticated",user:req.user});
}