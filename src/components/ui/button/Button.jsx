import React, { ReactNode } from "react";

// interface ButtonProps {
//   children: ReactNode; // Button text or content
//   size?: "sm" | "md"; // Button size
//   variant?: "primary" | "outline"; // Button variant
//   startIcon?: ReactNode; // Icon before the text
//   endIcon?: ReactNode; // Icon after the text
//   onClick?: () => void; // Click handler
//   disabled?: boolean; // Disabled state
//   className?: string; // Disabled state
// }

const Button = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  type,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    submit:
      "bg-blue text-blue-700 ring-1 ring-inset ring-blue-300 hover:bg-blue-50 dark:bg-blue-800 dark:text-blue-400 dark:ring-blue-700 dark:hover:bg-white/[0.03] dark:hover:text-blue-300", 
    edit:
    "bg-yellow-500 text-white shadow-theme-xs hover:bg-yellow-600 disabled:bg-yellow-300",
    delete:
    "bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300", 
  };

  return (
    <button
      className={`inline-flex items-center cursor-pointer justify-center gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
