import express from "express";
import http from 'http';
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";

const app=express();
const server=http.createServer(app);


app.use((express.json({limit:'4mb'})))
app.use(cors());

app.use(("/api/status"),(req,res)=>{
    res.send("Server is running")
});

app.use("/api/user",userRouter);

const port =process.env.PORT || 5000;

await connectDB();

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});