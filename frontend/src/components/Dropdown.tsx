import { FormControl, FormHelperText, InputLabel, Select } from '@material-ui/core';
import React from 'react';

/**
 * DropdownProps
 * @category Types
 * @alias DropdownProps
 * @typedef {object} DropdownProps
 * @property {string} id  Dropdown id
 * @property {string} label  Dropdown label
 * @property {string[]} items  Dropdown items
 * @property {boolean} [required]  Is dropdown disabled
 * @property {string} value  Current dropdown value
 * @property {function} setValue  Set dropdown value
 * @property {string} [error] Dropdown error
 */

export type DropdownProps = {
  id: string;
  label: string;
  items: string[];
  required?: boolean;
  value: string;
  setValue: (e: React.ChangeEvent<{ value: unknown }>) => void;
  error?: string;
};

/**
 * Dropdown component
 *
 * @category Components
 * @param {string} id  Dropdown id
 * @param {string} label  Dropdown label
 * @param {string[]} items  Dropdown items
 * @param {boolean} [required=false]  Is dropdown disabled
 * @param {string} value  Current dropdown value
 * @param {function} setValue  Set dropdown value
 * @param {string} [error] Dropdown error
 * @return {React.Component} <Dropdown /> component
 *
 * ""
 * @example
 *
 * return (
 *   <Dropdown id="example-drop-down" label="Example Dropdown" items=["Example 1", "Example 2", "Example 3"]
 *   value="Example 1" setValue={()=>null} error={"Example error"} />
 * )
 */

const Dropdown = ({ id, required = false, label, items, value, setValue, error }: DropdownProps) => {
  return (
    <FormControl error={Boolean(error)} fullWidth variant='outlined'>
      <InputLabel id={id}>
        {label} {required && '*'}
      </InputLabel>
      <Select autoWidth id={id} label={label} labelId={id} native onChange={setValue} value={value}>
        <option aria-label='None' value='' />
        {items?.map((item, index) => (
          <option key={index} value={index}>
            {item}
          </option>
        ))}
      </Select>
      {Boolean(error) && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default Dropdown;
