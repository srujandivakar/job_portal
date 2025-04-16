import mongoose from "mongoose";

//making connection with mongoDB
const connectDB = async ()=> {
    try{
        await  mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB connected Succesfully")
    }catch(error){
    console.log(error);
    }
}

export default connectDB;