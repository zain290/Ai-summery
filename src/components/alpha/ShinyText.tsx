import React from 'react';
import './ShinyText.css';

interface ShinyTextProps {
  text: string;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, className = '' }) => {
  return (
    <span className={`shiny-text ${className}`}>
      {text}
    </span>
  );
};

export default ShinyText;
