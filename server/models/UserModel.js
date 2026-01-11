import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 6,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilepic:{
            type: String,
            default: "",
        },
        bio:{
            type: String,
        },
       
}, { timestamps: true,});

export const User = mongoose.model("User", userSchema);
