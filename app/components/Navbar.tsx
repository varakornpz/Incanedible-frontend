

import { AiOutlineHome } from "react-icons/ai";

import Link from "next/link";

export default ()=>{
    return (
        <div className="h-fit w-full flex items-center bg-black py-2 px-6 justify-between">
            <Link href={"/"}>
                <AiOutlineHome className="w-10 h-10 text-white"/>
            </Link>
            <Link href={"/dashboard"}>
                <p className="font-semibold text-base">Dashboad</p>
            </Link>
        </div>
    )

}