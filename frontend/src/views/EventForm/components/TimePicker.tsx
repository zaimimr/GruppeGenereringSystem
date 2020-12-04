import { KeyboardTimePicker as KeyboardTimePickerMaterial } from '@material-ui/pickers';
import React from 'react';
import { Controller } from 'react-hook-form';

export type ITimePicker = {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  required?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: any;
  label: string;
  defaultValue: Date;
};
/**
 * TimePicker
 * @category Views
 * @subcategory EventForm
 * @param {string} id TimePicker field ID
 * @param {string} name Field name for React-hook-form
 * @param {Date} defaultValue Default date value
 * @param {string} label TimePicker field label
 * @param {*} error errors from react-hook-form
 * @param {*} control control from react-hook-form
 * @param {string} [required=undefined] Error message if is required
 * @param {*} [rules=undefined] Other validation rules from react-hook-form
 * @return {React.Component} <TimePicker /> component
 * ""
 * @example
 *
 * return (
 *   <TimePicker control={control} defaultValue={new Date()} error={errors.example_time} id='example_time' label='Example time' name='example_time' />
 * )
 */
const TimePicker = ({ id, name, defaultValue, label, error, control, required = undefined, rules = undefined, ...args }: ITimePicker) => {
  return (
    <Controller
      ampm={false}
      as={KeyboardTimePickerMaterial}
      autoOk
      control={control}
      defaultValue={defaultValue}
      disableToolbar
      error={Boolean(error)}
      fullWidth
      id={id}
      label={label}
      margin='normal'
      name={name}
      onChange={() => null}
      required={Boolean(required)}
      rules={{ required: required, ...rules }}
      value={new Date()}
      variant='inline'
      {...args}
    />
  );
};

export default TimePicker;
