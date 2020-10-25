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
