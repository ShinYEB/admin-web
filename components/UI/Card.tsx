import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow ${className} h-fit w-full ml-10 mr-10 pb-10 pl-5 pr-5`}>
      {children}
    </div>
  );
};

export default Card;
