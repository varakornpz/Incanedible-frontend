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
                warnNoti("Server send something that not implement" , event.data)
            }
        };

        socket.onerror = (error) => {
            warnNoti("Internal websocket error" , "see error in console")
            console.error("❌ WebSocket Error:", error);
        };

        return () => {
            warnNoti("Disconnect from websocket" , `disconnect from ${wsUrl}`)
            socket.close();
        };

    },[cane_id, socketLocationApi])

    return (
        <div className='w-full h-full'>
            {location.lat && location.lng ?
                <div className='w-full h-175'>
                    <Map posix={[location.lat , location.lng]}/>
                </div>
            :
            <div>
                Loading...
            </div>
            }
        </div>
    )
}