'use client'


import { useCallback, createContext, ReactNode, useState, useEffect } from "react"

import axios from "axios"

import { ToastContainer, toast , cssTransition} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';

const bounce = cssTransition({
enter: "animate__animated animate__bounceIn",
exit: "animate__animated animate__bounceOut"
});

const warnNoti = (topic : string , des : string)=>{
    toast.warn(
    <div>
        <h1 className="font-bold text-base">
            {topic}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
            {des}
        </p>
    </div>
        , {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition : bounce,
    });
}


type CaneType = {
    name: string
    cane_id: string
}

export type userData = {
    name  :  string
    email   : string
    profile_pic : string
    canes : CaneType[]
} | null

type CaneActionsContextType = {
    addCane: (newCane: CaneType) => void
    removeCane: (cane_id: string) => void
} | null


export type userContextType = {
    userData : userData 
    setUserData : React.Dispatch<React.SetStateAction<userData>>
} | null


const CaneActionsContext = createContext<CaneActionsContextType>(null)
const UserContext   = createContext<userContextType>(null)

const UserProvider = ({children} : {children : ReactNode}) =>{
    const meApiUrl = process.env.NEXT_PUBLIC_API_ME

    if (!meApiUrl){
        warnNoti("Internal website error" , "Cant load me api in local variable.")
    }

    const [userData , setUserData] = useState<userData>(null)

    useEffect(()=>{
        const fetchUser = async ()=>{
            try{ 
                const res = await axios.get(meApiUrl ?? "" , {withCredentials : true})

                const safeData = {
                    ...res.data,
                    canes: Array.isArray(res.data.canes) ? res.data.canes : []
                }

                setUserData(safeData)
            }
            catch{
                warnNoti("Internal website error" , "Load data failed.")
            }
        }

        fetchUser()
    },[])

    const addCane = useCallback((newCane: CaneType) => {
        setUserData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                canes: [...prev.canes, newCane]
            }
        })
    }, [])

    const removeCane = useCallback((cane_id: string) => {
        setUserData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                canes: prev.canes.filter((cane) => cane.cane_id !== cane_id) // กรองตัวที่ id ตรงกันออก
            }
        })
    }, [])

    return (
        <UserContext.Provider value={{userData, setUserData}}>
            <CaneActionsContext.Provider value={{addCane, removeCane}}>
                {children}
            </CaneActionsContext.Provider>
        </UserContext.Provider>
    )
}

export {UserProvider , UserContext , CaneActionsContext}
