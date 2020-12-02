import { Button as ButtonMaterial } from '@material-ui/core';
import React from 'react';

/**
 * ButtonProps
 * @category Types
 * @alias ButtonProps
 * @typedef {object} ButtonProps
 * @property {boolean} [fullWidth] Button is full width
 * @property {boolean} [disabled]  Button is disabled
 * @property {boolean} [link]  Button is link-type
 * @property {string} label  Button label
 * @property {'submit' | 'button'} [type]  Button type. Must be 'submit' OR 'button'
 * @property {function} onClick  Button onClick function
 */

export type ButtonProps = {
  fullWidth?: boolean;
  disabled?: boolean;
  link?: boolean;
  label: string;
  type?: 'submit' | 'button';
  onClick: () => void;
};
/**
 * Button component
 * @category Components
 * @param {boolean} [fullWidth=false] Button is full width
 * @param {boolean} [disabled=false]  Button is disabled
 * @param {boolean} [link=false]  Button is link-type
 * @param {string} label  Button label
 * @param {'submit' | 'button'} [type=button]  Button type. Must be 'submit' OR 'button'
 * @param {function} onClick  Button onClick function
 * @return {React.Component} <Button /> component
 *
 * ""
 * @example
 *
 * return (
 *   <Button fullWidth label={"Example button"} onClick={() => null} />
 * )
 */
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
