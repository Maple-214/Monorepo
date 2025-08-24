import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

const styles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-black text-white hover:bg-black/90',
  secondary: 'bg-white text-black border border-black hover:bg-gray-50',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg transition ${styles[variant]} ${className}`}
      {...props}
    />
  );
};
