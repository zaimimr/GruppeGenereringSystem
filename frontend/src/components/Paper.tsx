import { Paper as MaterialPaper } from '@material-ui/core';
import React from 'react';

export type PaperProps = {
  children: React.ReactNode;
};

const Paper = ({ children, ...args }: PaperProps) => {
  return (
    <div {...args}>
      <MaterialPaper>{children}</MaterialPaper>
    </div>
  );
};

export default Paper;
