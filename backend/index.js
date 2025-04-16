// #old way of importing the module#
//  const express = require('express')

import express, { urlencoded } from "express"; // to import, add type in .json file
import cookieParser from "cookie-parser";
import cors from "cors"; 
import dotenv from "dotenv";
import connectDB from "./utils/db.js";

dotenv.config({});

// if port(8000) does not exit in .env it will use port 3000 
const PORT = process.env.PORT || 3000; 
const app = express();

// API (basic get request)
/*app.get("/home",(req,res)=>{
    return res.status(200).json({
        message:"I am coming from backend",
        success:true,
    })
});*/

// cors is used to communicate between differnt host (backend host & frontend host)
const corsOption = {
    origin :`http//localhost:5173`,
    Credential:true
}
app.use(cors(corsOption));

app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cookieParser());
 
app.listen(PORT,()=>{
    connectDB();//calling from .env 
    console.log(`Server is running at PORT ${PORT}`)
});