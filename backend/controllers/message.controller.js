import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js"

export const sendMessage=async (req,res)=>{

    try{

        const {message} = req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id

       let conversation = await Conversation.findOne({
            participants:{ $all:[senderId,receiverId] },
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId,receiverId],
            })
        }

        const newMessage=new Message({
            senderId,
            receiverId,
            message,
        })

        if(newMessage){
            conversation.message.push(newMessage._id);
        }

        // await conversation.save();
        // await newMessage.save();
        //this will work in parallel save some time
        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json(newMessage);



    }catch(error){
        console.log("Error in sendMessage",error.message);
        res.status(500).json({error:"Internal server error"})
    }

}
//==========================get message================================================

export const getMessages=async (req,res)=>{
    try {

        const {id:userToChatId}=req.params;
        const senderId=req.user._id;

        const conversation = await Conversation.findOne({
            participants:{$all:[senderId,userToChatId]},

        }).populate("message");

        if(!conversation){
            return res.status(200).json([])
        }

        res.status(200).json(conversation.message);
        
    } catch (error) {
        console.log("Error in getMessages",error.message);
        res.status(500).json({error:"Internal server error"})
    }
}