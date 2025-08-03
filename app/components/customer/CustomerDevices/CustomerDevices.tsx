'use client';

import { getCustomerDevices } from "@/app/data/services/customer-service";
import { useEffect, useState } from "react";
import CustomerDeviceItem from "./CustomerDeviceItem";

export default function CustomerDevices() {

    const [devices, setDevices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const devices = await getCustomerDevices();
                setDevices(devices || []); 
            } catch (err) {
                console.error("Failed to fetch devices", err);
                setDevices([]);
            } finally {
                setLoading(false); 
            }
        }
        fetchDevices();
    }, []);

    return (
        <div>
        {loading ? (
            <div>Loading devices...</div>
        ) : devices.length > 0 ? (
            devices.map((device) => (
                <CustomerDeviceItem key={device.CustomerDeviceID} device={device} />
            ))
        ) : (
            <div>No devices found</div> 
        )}
    </div>
    )
}