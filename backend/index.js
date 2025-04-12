// #old way of importing the module#
//  const express = require('express')

import express, { urlencoded } from "express"; // to import, add type in .json file
import cookieParser from "cookie-parser";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(urlencoded({extended:true}));
app.use();
app.listen(PORT,()=>{
    console.log(`Server is running at PORT ${PORT}`)
});