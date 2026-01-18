import  Message  from "../models/Message.js";
import User  from "../models/UserModel.js";
import cloudinary from "../lib/cloudinary.js";

import { io, onlineUsers } from "../server.js";

export const getUserForSidebar=async(req,res)=>{
    try{
        const userId=req.user.id;
        const filteredUsers=await User.find({_id:{$ne:userId}}).select("-password");

        // count messages of unseen messages from each user
        const unseenmessageCounts={};

        const promises=filteredUsers.map(async(user)=>{
            const count=await Message.countDocuments({senderId:user._id,receiverId:userId,seen:false});
            if(count>0)
            unseenmessageCounts[user._id]=count;
        });

        await Promise.all(promises);
        res.json({success:true,users:filteredUsers,unseenmessageCounts});
    }
    catch(error){
        console.error("Error in getUserForSidebar:",error);
        res.status(500).json({success:false,message:"Server error",error:error.message});
    }
}


export const getMessages =async(req,res)=>{
    try{

        const {id : selectedUserId}=req.params;
        const myId=req.user.id;

        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:selectedUserId},
                {senderId:selectedUserId,receiverId:myId}
            ]
        });
        await Message.updateMany({senderId:selectedUserId,receiverId:myId,seen:true});

        res.json({success:true,messages});
    }
    catch(error){
        console.error("Error in getMessages:",error);
        res.status(500).json({success:false,message:"Server error",error:error.message});
    }
}

// Mark messages as seen
export const markMessagesAsSeen=async(req,res)=>{
    try{
       const {id}= req.params;
        await Message.findByIdAndUpdate(id,{seen:true});
        res.json({success:true,message:"Message marked as seen"});
    }
    catch(error){
        console.error("Error in markMessagesAsSeen:",error);
        res.status(500).json({success:false,message:"Server error",error:error.message});
    }   
}

// Send Message Controller

export const sendMessage=async(req,res)=>{{
    try{
        const senderId=req.user.id;
        const {text,image}=req.body;
        const {receiverId}=req.params.id;

        let imageUrl="";
        if(image){
            imageUrl=image;

            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
            
        }

        const newMessage=await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });

        // Emit the new message to the receiver if online
        const receiverSocketId=onlineUsers[receiverId];

        if(receiverSocketId){
            io.to(receiverSocketId).emit("new-message",newMessage);
        }

        res.json({success:true,message:newMessage});
    }
    catch(error){
        console.error("Error in sendMessage:",error);
        res.status(500).json({success:false,message:"Server error",error:error.message});
    }
}}


