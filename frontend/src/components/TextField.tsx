import { TextField as TextFieldMaterial } from '@material-ui/core';
import React from 'react';

export type TextFieldProps = {
  id: string;
  label: string;
  type?: string;
  error?: boolean;
  required?: boolean;
  multiline?: boolean;
  fullWidth?: boolean;
  helperText?: string;
  rows?: number;
};

const TextField = ({
  id,
  label,
  type = 'input',
  error = false,
  required = false,
  multiline = false,
  fullWidth = false,
  helperText = '',
  rows = 1,
  ...args
}: TextFieldProps) => {
  return (
    <>
      <TextFieldMaterial
        color='primary'
        error={error}
        fullWidth={fullWidth}
        helperText={helperText}
        id={id}
        label={label}
        multiline={multiline}
        required={required}
        rows={rows}
        type={type}
        variant='outlined'
        {...args}
      />
    </>
  );
};

export default TextField;
