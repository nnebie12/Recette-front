import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const baseClasses = 'bg-white rounded-lg shadow-md';
  const hoverClasses = hover ? 'hover:shadow-xl transition-shadow duration-300 cursor-pointer' : '';
  const classes = `${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`;

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;