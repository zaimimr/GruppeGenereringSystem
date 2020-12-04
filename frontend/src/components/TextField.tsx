import { TextField as TextFieldMaterial } from '@material-ui/core';
import React from 'react';
import { Controller } from 'react-hook-form';

/**
 * TextFieldProps
 * @category Types
 * @alias TextFieldProps
 * @typedef {object} TextFieldProps
 * @property {string} id  TextField id
 * @property {string} label TextField label
 * @property {string} [type] TextField type
 * @property {*} error TextField error
 * @property {string} control TextField control for React-hook-form
 * @property {string} name TextField name for React-hook-form
 * @property {string} [defaultValue] TextField default value
 * @property {string} [required] TextField is required error message
 * @property {boolean} [multiline] TextField is multiline
 * @property {boolean} [fullWidth] TextField is full width
 * @property {number} [rows] TextField nr of rows
 * @property {*} [rules] TextField other rules
 */

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

/**
 * TextField component
 * @category Components
 * @param {string} id TextField id
 * @param {string} label TextField label
 * @param {string} [type='input'] TextField type
 * @param {*} error TextField error
 * @param {*} control TextField control for React-hook-form
 * @param {string} name TextField name for React-hook-form
 * @param {string} [defaultValue=''] TextField default value
 * @param {string} [required=undefined] TextField is required error message
 * @param {boolean} [multiline=false] TextField is multiline
 * @param {boolean} [fullWidth=false] TextField is full width
 * @param {number} [rows=1] TextField nr of rows
 * @param {*} [rules=undefined] TextField other rules
 * @return {React.Component} <TextField /> component
 *
 * ""
 * @example
 *
 * return (
 *   <TextField id="example-text-field" label="Example TextField" control={undefined} name="example_textfield" required fullWidth error={undefined} />
 * )
 */
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
