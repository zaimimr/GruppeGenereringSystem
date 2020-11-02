import { KeyboardDatePicker as KeyboardDatePickerMaterial } from '@material-ui/pickers';
import React from 'react';
import { Controller } from 'react-hook-form';

export type IDatePicker = {
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

const DatePicker = ({ id, name, defaultValue, label, error, control, required = undefined, rules = undefined, ...args }: IDatePicker) => {
  return (
    <Controller
      as={KeyboardDatePickerMaterial}
      autoOk
      clearable
      control={control}
      defaultValue={defaultValue}
      disableToolbar
      error={Boolean(error)}
      format='dd/MM/yyyy'
      fullWidth
      id={id}
      label={label}
      margin='normal'
      minDate={new Date()}
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

export default DatePicker;
