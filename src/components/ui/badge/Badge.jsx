import React from "react";

const Badge = ({
  variant = "light",
  color,
  size,
  startIcon,
  endIcon,
  children,
  className,
  onClick
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium";

  // Define size styles
  const sizeStyles = {
    sm: "text-theme-xs", // Smaller padding and font size
    md: "text-sm", // Default padding and font size
  };

  // Define color styles for variants
  const variants = {
    light: {
      primary:
        "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400",
      success:
        "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
      error:
        "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500",
      warning:
        "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400",
      info: "bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500",
      light: "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80",
      dark: "bg-gray-500 text-white dark:bg-white/5 dark:text-white",
    },
    solid: {
      primary: "bg-brand-500 text-white dark:text-white",
      success: "bg-success-500 text-white dark:text-white",
      error: "bg-error-500 text-white dark:text-white",
      warning: "bg-warning-500 text-white dark:text-white",
      info: "bg-blue-light-500 text-white dark:text-white",
      light: "bg-gray-400 dark:bg-white/5 text-white dark:text-white/80",
      dark: "bg-gray-700 text-white dark:text-white",
      // Surat Keluar
      draft:                       'bg-gray-100 text-gray-800',
      review:                      'bg-blue-100 text-blue-800',
      waiting_for_signature:  'bg-yellow-100 text-yellow-800',
      signed:                      'bg-purple-100 text-purple-800',
      sent:                        'bg-green-100 text-green-800',
      archived:                    'bg-gray-200 text-gray-600',
      // Surat Masuk
      diterima:                    'bg-blue-100 text-blue-800',
      didisposisikan:              'bg-yellow-100 text-yellow-800',
      diproses:                    'bg-orange-100 text-orange-800',
      selesai:                     'bg-green-100 text-green-800',
      waiting_to_archive:          'bg-yellow-200 text-yellow-900',
    },
  };

  // Get styles based on size and color variant
  const sizeClass = sizeStyles[size];
  const colorStyles = variants[variant]?.[color];

  const handleClick = (event) => {
    if (onClick) onClick();
  };

  return (
    <span className={`${baseStyles} ${sizeClass} ${colorStyles} ${className}`}
    aria-label={children ? undefined : color}
    onClick={handleClick}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;
