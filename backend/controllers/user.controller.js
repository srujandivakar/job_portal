import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";


// ***** logic for registration *******//
export const register = async (req,res)=>{
    try{
        const{fullname,email,phoneNumber,password,role}=req.body;
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            });
        };
        //checking if user emailID already exisits 
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"User already exists with this Email",
                success:false,
            })
        }
        //encrpting the password
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
            role,
        })
        return res.status(201).json({
             message:"Account created successfully",
        });
    }catch(error){
        console.log(error);
    }
}

//******* logic for login **********//
export const login = async(req,res) =>{
    try{
        const {email,password,role} =  req.body;
        if(!email || !password || !role){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            });
        };
         
        // checking for correct Email 
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Incorrect Email OR Email does not exist",
                success:false,
            })
        }
        //checking for correct password
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return res.status(400).json({
                message:"Incorrect Password!!",
                success:false,
            })
        };
        //checking of matching Role (student || recruitor)
        if(role != user.role){
            return res.status(400).json({
                message:"DOES NOT HAVE ACCESS FOR SPECIFIED ROLE",
                success:false,
            })
        }

        // creating token
        const tokenData = {
            userId:user._id
        }
        const token  = await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});

        user ={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }

        //storing token in cookie
        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000, httpsOnly:true, sameSite:'strict'}).json({
            message:`Welcome back ${user.fullname}`,
            user,
            success:true, 
        })

    }catch(error){
        console.log(error);
    }
}

//****** logic for logout **********//
export const logout = async(req,res) => {
    try{                          // setting the cookie to null
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:'Logged out succesfully',
            success:true,
        })
    }catch(error){
        console.log(error);
    }
}

//*********** logic for udate_profile **********//
export const updateProfile = async(req,res) => {
    try{
        const file = req.file; 
        const {fullname, email, phoneNumber, bio, skills}=req.body;
        if(!fullname || !email || !phoneNumber || !bio || !skills){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            });
        };
        // cloudnary will come here <---

        const skillsArray = skills.split(",");
        const userId = req.id; //middleware authentication 
        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                message:"User not found.",
                success:false
            });
        }

        //updating data
        user.fullname = fullname,
        user.email = email,
        user.phoneNumber = phoneNumber,
        user.profile.bio = bio,
        user.profile.skills = skillsArray
        // resume comes here <--

        await user.save();

        user ={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully,",
            user,
            success:true,
        });

    }catch(error){
        console.log(error);
    }
}