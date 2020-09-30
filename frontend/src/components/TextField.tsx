import { TextField as TextFieldMaterial } from '@material-ui/core';
import React from 'react';
import { Controller } from 'react-hook-form';

export type TextFieldProps = {
  id: string;
  label: string;
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  defaultValue?: string;
  required?: string;
  multiline?: boolean;
  fullWidth?: boolean;
  rows?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: any;
};

const TextField = ({
  id,
  label,
  control,
  name,
  defaultValue = '',
  type = 'input',
  error,
  required = undefined,
  multiline = false,
  fullWidth = false,
  rows = 1,
  rules = undefined,
  ...args
}: TextFieldProps) => {
  return (
    <>
      <Controller
        as={TextFieldMaterial}
        color='primary'
        control={control}
        defaultValue={defaultValue}
        error={Boolean(error)}
        fullWidth={fullWidth}
        helperText={error?.message}
        id={id}
        label={label}
        multiline={multiline}
        name={name}
        required={Boolean(required)}
        rows={rows}
        rules={{ required: required, ...rules }}
        type={type}
        variant='outlined'
        {...args}
      />
    </>
  );
};

export default TextField;
