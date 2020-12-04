import { Tooltip } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import React from 'react';

/**
 * IHelperTooltip
 * @category Types
 * @alias IHelperTooltip
 * @typedef {object} IHelperTooltip
 * @property {string} id  Tooltip id
 * @property {'bottom' | 'bottom-end' | 'bottom-start' | 'left-end' | 'left-start' | 'left' | 'right-end'
 * | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top' | undefined}  [placement] Tooltip placement
 */

export type IHelperTooltip = {
  helperText: string;
  placement?:
    | 'bottom'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top'
    | undefined;
};
/**
 * HelperTooltip component
 * @category Components
 * @param {string} id  Tooltip id
 * @param {'bottom' | 'bottom-end' | 'bottom-start' | 'left-end' | 'left-start' | 'left' | 'right-end'
 * | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top' | undefined}  [placement=bottom] Tooltip placement
 * @return {React.Component} <HelperTooltip /> component
 *
 * ""
 * @example
 *
 * return (
 *   <HelperTooltip helperText="Example tooltip" />
 * )
 *
 */

const HelperTooltip = ({ helperText, placement = 'bottom' }: IHelperTooltip) => {
  return (
    <Tooltip placement={placement} title={helperText}>
      <HelpIcon color='secondary' fontSize='small' />
    </Tooltip>
  );
};

export default HelperTooltip;
