import * as React from 'react';
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};
export declare const Button: React.FC<ButtonProps>;
export {};
