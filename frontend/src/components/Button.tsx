import { Button as ButtonMaterial } from '@material-ui/core';
import React from 'react';

export type ButtonProps = {
  fullWidth?: boolean;
  disabled?: boolean;
  link?: boolean;
  label: string;
  type?: 'submit' | 'button';
  onClick: () => void;
};

const Button = ({ fullWidth = false, disabled = false, label, link = false, onClick, type = 'button', ...args }: ButtonProps) => {
  return (
    <ButtonMaterial
      color={link ? 'secondary' : 'primary'}
      disabled={disabled}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      variant={link ? 'text' : 'contained'}
      {...args}>
      {label}
    </ButtonMaterial>
  );
};

export default Button;
