import React from 'react';

const DrivingHistoryChart: React.FC = () => {
    return (
        <div className="mt-8 mb-10">
            <svg width="100%" height={100}>
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4945FF" />
                        <stop offset="100%" stopColor="#6C63FF" />
                    </linearGradient>
                </defs>
                <polyline
                    points="15,80 80,40 160,60 240,10"
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

export default DrivingHistoryChart;
