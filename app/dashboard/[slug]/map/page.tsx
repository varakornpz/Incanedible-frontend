'use client'


import { successNoti, warnNoti } from '@/actions/client/mytoast'
import { useParams } from 'next/navigation'
import { useEffect , useState } from 'react'

import dynamic from 'next/dynamic';


const Map = dynamic(
  () => import("./MyMap"), 
  { 
    loading: () => <p>A map is loading...</p>,
    ssr: false
  }
);

export default ()=>{
    const params = useParams()
    const cane_id = params.slug

    const socketLocationApi = process.env.NEXT_PUBLIC_API_LOCATION_SOCKET

    const [location, setLocation] = useState<{lat: number | null, lng: number | null , sat : number | null}>({ 
            lat: null, 
            lng: null ,
            sat : null
    })

    useEffect(()=>{
        if (!cane_id || !socketLocationApi) return;
        

        const wsUrl = `${socketLocationApi}?cane_id=${cane_id}`;
        console.log("Connecting to:", wsUrl);

        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            successNoti("Websocket connected" , `connected to ${wsUrl}`)
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                setLocation({
                    lat: data.lat,
                    lng: data.lng ,
                    sat : data.sat
                });
            } catch (error) {
                console.log("Server send something that not implement")
                // warnNoti("Server send something that not implement" , event.data)
            }
        };

        socket.onerror = (error) => {
            warnNoti("Internal websocket error" , "see error in console")
            console.error("❌ WebSocket Error:", error);
        };

        return () => {
            // warnNoti("Disconnect from websocket" , `disconnect from ${wsUrl}`)
            socket.close();
        };

    },[cane_id, socketLocationApi])


return (
        <div className='flex flex-col w-full h-[calc(100dvh-56px)] relative'>
            {location.lat && location.lng ? (
                location.sat == 0 ? (
                    <div className='flex items-center justify-center w-full h-full flex-1 text-black text-xl'>
                        Satellite not found :(
                    </div>
                ) : (
                    <div className='flex-1 relative w-full h-full'>
                        <Map posix={[location.lat , location.lng]}/>
                        
                        <div className='absolute bottom-6 left-4 z-1000 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-300 text-black flex flex-col gap-1 text-sm md:text-base pointer-events-none'>
                            <p className='font-semibold'>Latitude : <span className='font-normal'>{location.lat}</span></p>
                            <p className='font-semibold'>Longitude : <span className='font-normal'>{location.lng}</span></p>
                            <p className='font-semibold'>Number of satellite : <span className='font-normal'>{location.sat}</span></p>
                        </div>
                    </div>
                )
            ) : (
                <div className='flex items-center justify-center w-full h-full flex-1 text-black text-xl'>
                    Waiting for location...
                </div>
            )}
        </div>
    )
}