import { Paper as MaterialPaper } from '@material-ui/core';
import React from 'react';

export type PaperProps = {
  children: React.ReactNode;
};

const Paper = ({ children }: PaperProps) => {
  return <MaterialPaper>{children}</MaterialPaper>;
};

export default Paper;
