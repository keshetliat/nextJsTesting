'use client';

import { getCustomerDevices } from "@/app/data/services/customer-service";
import { useEffect, useState } from "react";
import CustomerDeviceItem from "./CustomerDeviceItem";

export default function CustomerDevices() {

    const [devices, setDevices] = useState<any[]>([]);

    useEffect(() => {
        const fetchDevices = async () => {
            const devices = await getCustomerDevices();
            setDevices(devices);
            console.log(devices);
        }
        fetchDevices();
    }, []);

return (
    <div>
        {devices.map((device) => (
           <CustomerDeviceItem key={device.CustomerDeviceID} device={device} />
        ))}
    </div>
)
}