import  User  from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';


// User Signup Controller
export const signup = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    if (!name || !email || !password || !bio) {
      return res.status(400).json({ message: "All fields are required" });
    }

  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //  Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      bio
    });

    //  Generate token
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      user: newUser,
      token,
      message: "User created successfully"
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


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

export const checkauth=(req,res)=>{
    res.status(200).json({message:"Authenticated",user:req.user});
}


export const updateProfile=async(req,res)=>{
    try{
        const { ProfilePic,bio,fullName}=req.body;
        const userId=req.user._id;
        let updatedUser;


        if(!ProfilePic){
            updatedUser=await User.findByIdAndUpdate(userId,{
                bio,
                fullName
            },{new:true});
        }
        else{
            const upload=await cloudinary.uploader.upload(ProfilePic);
            updatedUser=await User.findByIdAndUpdate(userId,{ProfilePic:upload.secure_url,
                bio,
                fullName
            },{new:true});
        }
        res.json({success:true,user:updatedUser,message:"Profile updated successfully"});
    }   
    catch(error){
        console.error("Error during profile update:", error);
        res.json({success:false,message: "Server error", error: error.message });
    }   
}

