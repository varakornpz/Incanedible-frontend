"use client"

import { useRef, useState , useContext } from "react";
import axios from "axios";
import { IoIosAdd } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";

import { successNoti , warnNoti } from "@/actions/client/mytoast";
import { toast } from 'react-toastify';

import { CaneActionsContext } from "../providers/UserData";
import { UserContext , type userData} from "../providers/UserData";


export default ()=>{

    const context = useContext(UserContext)

    if(!context){
        return (
            <div className="text-white">Loading...</div>
        )
    }

    const {userData , setUserData} = context
    const { addCane, removeCane } = useContext(CaneActionsContext)!;
    const addCaneApiUrl = process.env.NEXT_PUBLIC_API_ADD_CANE
    const inputRef = useRef<HTMLInputElement>(null);
    const [isAdding , setIsAdding] = useState(false)




    
    const handleFormSubmit = ()=>{
        try {
            setIsAdding(true)
            if (inputRef.current) {
                toast.dismiss()
                if(!addCaneApiUrl){
                    warnNoti("Internal website error." , "Website cant load local variable.")
                    return
                }
                const currentText = inputRef.current.value
                axios.post(addCaneApiUrl ,{
                    name : "" ,
                    cane_id : currentText
                }, {
                    withCredentials : true
                })
                .then((res)=>{
                    console.log(res.data)
                    if (res.status == 200 && res.data.msg){
                        successNoti("Success" , res.data.msg)
                        addCane({
                            name : "" ,
                            cane_id : currentText
                        })
                    }
                })
                .catch((err)=>{
                    warnNoti("Internal server error" , err.response?.data?.msg ?? "Unknown error.")
                })
            }
        }
        catch{
            warnNoti("Internal website error." , "Unknown error.")
        }
        finally{
            setIsAdding(false)
            if (inputRef.current) {
                inputRef.current.value = ""; 
            }
        }
    }

    return(
        <div className="flex items-center border-2 rounded-md border-gray-400 w-fit">
            <input ref={inputRef} id="1" className="h-8 w-40 bg-[#444444] focus:outline-none rounded-md px-1" type="text" placeholder="cane id" />
            <button onClick={handleFormSubmit} >
                {isAdding || !userData?.name ?
                    <AiOutlineLoading className="text-xl font-bold mx-2 animate-spin"/>
                :
                    <IoIosAdd className="text-xl font-bold mx-2 hover:cursor-pointer"/>
                }
            </button>
        </div>

        
    )
}
