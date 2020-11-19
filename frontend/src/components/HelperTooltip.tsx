import { Tooltip } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import React from 'react';

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

const HelperTooltip = ({ helperText, placement = 'bottom' }: IHelperTooltip) => {
  return (
    <Tooltip placement={placement} title={helperText}>
      <HelpIcon color='secondary' fontSize='small' />
    </Tooltip>
  );
};

export default HelperTooltip;
