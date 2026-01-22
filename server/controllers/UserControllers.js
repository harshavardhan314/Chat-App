import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
  try {
    const { fullName, email, password, bio } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      user,
      token,
      message: "Signup successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.json({
      success: true,
      user,
      token,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// check authentication
export const checkauth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// update user profile

export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, profilePic } = req.body;

    let updateData = { fullName, bio };

    
    if (profilePic && profilePic.startsWith("data:image")) {
      const uploadRes = await cloudinary.uploader.upload(profilePic, {
        folder: "profile_pics",
      });

      updateData.profilePic = uploadRes.secure_url; 
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      user,
      message: "Profile updated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
