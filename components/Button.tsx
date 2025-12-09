import React from 'react';
import { ButtonType } from '../types';

interface ButtonProps {
  label: string;
  onClick: (label: string) => void;
  type?: ButtonType;
  className?: string;
  doubleWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  type = ButtonType.Number, 
  className = '',
  doubleWidth = false
}) => {
  
  let baseStyles = "h-16 md:h-20 rounded-full text-2xl md:text-3xl font-medium transition-all active:scale-95 flex items-center justify-center select-none shadow-sm";
  let colorStyles = "";

  switch (type) {
    case ButtonType.Operator:
    case ButtonType.Special:
      colorStyles = "bg-orange-500 text-white hover:bg-orange-400 active:bg-orange-600";
      break;
    case ButtonType.Action:
      colorStyles = "bg-gray-300 text-gray-900 hover:bg-gray-200 active:bg-gray-400";
      break;
    case ButtonType.Number:
    default:
      colorStyles = "bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-800";
      break;
  }

  const widthStyle = doubleWidth ? "col-span-2 w-full text-left pl-8 md:pl-10" : "w-16 md:w-20";
  // If double width and circular shape requested, we usually use rounded-full which works for capsules too.

  return (
    <button
      className={`${baseStyles} ${colorStyles} ${widthStyle} ${className}`}
      onClick={() => onClick(label)}
      type="button"
    >
      {label}
    </button>
  );
};

export default Button;