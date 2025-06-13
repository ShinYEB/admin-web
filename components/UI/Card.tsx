import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-4 mb-4 w-full overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export default Card;
