import React from 'react';

interface DriveInfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

interface DriveInfoGroupProps {
    items: DriveInfoItemProps[];
}

export default function DriveInfoGroup({ items }: DriveInfoGroupProps) {
    return (
        <div className="bg-blue-50 rounded-2xl mt-2.5 p-4 space-y-2">
            {items.map((item, index) => (
                <div className="flex justify-between items-center" key={index}>
                    <div className="flex items-center gap-1.5">
                        {item.icon}
                        <span className="text-gray-800">{item.label}</span>
                    </div>
                    <span className="text-indigo-600 font-medium">{item.value}</span>
                </div>
            ))}
        </div>
    );
}
