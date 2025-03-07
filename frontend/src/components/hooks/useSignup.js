import { useState } from "react"
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";


const useSignup=()=>{
    const [loading,setLoading]=useState(false);
    const {setAuthUser }=useAuthContext()

    const signup= async ({fullName,username,password,confirmPassword,gender})=>{

        const success=handelInputErrors({fullName,username,password,confirmPassword,gender});
        if(!success) return;
        setLoading(true);

        try{

            const res= await fetch("/api/auth/signup",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({fullName,username,password,confirmPassword,gender}),
            });
            
            const data=await res.json();
            if(data.error){
                throw new Error(data.error);
            }

            localStorage.setItem("chat-user",JSON.stringify(data));
            setAuthUser(data);
            console.log(data);


        }catch(error){
            toast.error(error.message);
        }finally{
            setLoading(false);
        }

    }
    return {loading,signup};
}



export default useSignup;

function handelInputErrors({fullName,username,password,confirmPassword,gender}){
    if(!fullName||!username||!password||!confirmPassword||!gender){
        toast.error("please fill the fields")
        return false;
    }

    if(password!== confirmPassword){
        toast.error("password do not match")
        return false;
    }
    if(password.length < 8){
        toast.error("password is too small");
        return false;
    }

    return true;
}