import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup= async (req,res)=>{
    try{

        const {fullName,username,password,confirmPassword,gender}= req.body;

        if(password !== confirmPassword){
            return res.status(400),json({error:"password does not match"});
        }
        
        const user= await User.findOne({username})

        if(user){
            return res.status(400).json({error:"Username already exits"});
        }

        //hash password
        const salt= await bcrypt.genSalt(10);
        const hashPassword= await bcrypt.hash(password,salt);

//for avatar in profile pic
        const boyProfilePic=`https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic=`https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser=new User({
            fullName,
            username,
            password:hashPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        if(newUser){
            //generate jwt web token
            generateTokenAndSetCookie(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                profilePic:newUser.profilePic
            });

        }else{
            res.status(404).json({error:"Invalid user data"});
        }

        

        

      }catch(error){
        res.status(500).json({error: "Internal Server Error"});

     }
    
};

export const login= async (req,res)=>{
    try{

        const { username , password } = req.body;
        const user= await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid credential"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            profilePic:user.profilePic,
        });

    }catch(error){
        console.log("error in login controller", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const logout= async (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logout successful"});
    } catch (error) {
        console.log("error in logout controller", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}
