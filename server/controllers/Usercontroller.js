import user from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';


// User Signup Controller
export const signup=async(req,res)=>{
    try{
        const {name,email,password,bio}=req.body;

        if (!name || !email || !password || !bio) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await user.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt=await bcrypt.genSalt(10);// this will generate a random string to the password
        const hashedPassword=await bcrypt.hash(password,salt); // this will hash the password with the salt
        const newUser = await user.create({
            name,
            email,
            password: hashedPassword,
            bio
        });

        const token=generateToken(newUser._id);

        res.json({success:true,user:newUser,token,message:"User created successfully"});
    }
    catch(error){
        console.error("Error during signup:", error);
        res.json({success:false,message: "Server error", error: error.message });
    }
}

// Login Controller
export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const existingUser = await user.findOne({email});
        if(!existingUser){
            return res.status(400).json({message:"User does not exist"});
        }

        const isPasswordValid=await bcrypt.compare(password,existingUser.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token=generateToken(existingUser._id);
        res.json({success:true,user:existingUser,token,message:"Login successful"});
    }
    catch(error){
        console.error("Error during login:", error);
        res.json({success:false,message: "Server error", error: error.message });
    }
}