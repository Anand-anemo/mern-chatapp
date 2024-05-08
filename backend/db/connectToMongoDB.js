import mongoose from "mongoose";

const connectToDb= async ()=>{

    try{

       await mongoose.connect(process.env.MONGO_DB_URL);
       console.log("connection successful");

    }catch(error){
        console.log("error in connecting to mongodb")
    }

}

export default connectToDb;