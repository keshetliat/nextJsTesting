interface CustomerDeviceItemProps {
  device: any;
}

export default function CustomerDeviceItem({ device }: CustomerDeviceItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Device #{device.CustomerDeviceID}
            </h3>
            <p className="text-sm text-gray-500">
              {device.DeviceModuleName || 'Unknown Type'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">כינוי המכשיר</p>
          <p className="font-medium text-gray-900">
            {device.DeviceModel || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-gray-500">מספר סידורי</p>
          <p className="font-medium text-gray-900">
            {device.SerialNum || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-gray-500">תאריך רישום</p>
          <p className="font-medium text-gray-900">
            {device.CreatedDate ? new Date(device.CreatedDate).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
            ניתוק המכשיר מהחשבון
          </button>
        </div>
      </div>
    </div>
  );
}