import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/messages.routes.js"
import userRoutes from "./routes/users.routes.js"
import connectToDb from "./db/connectToMongoDB.js";
import cookieParser from "cookie-parser";
import { app , server } from "./socket/socket.js";

const PORT=process.env.PORT || 5000;

dotenv.config();

// app.get("/", (req,res)=>{
//     res.send("hello!");
// })
app.use(express.json());// to parse the upcoming request
app.use(cookieParser());
app.use("/api/auth", authroutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes)

server.listen(PORT,()=>{
    connectToDb();
    console.log(`server running on ${PORT}`);

})