import { Paper as MaterialPaper } from '@material-ui/core';
import React from 'react';
/**
 * PaperProps
 * @category Types
 * @alias PaperProps
 * @typedef {object} PaperProps
 * @property {React.ReactNode} children Child elements
 */
export type PaperProps = {
  children: React.ReactNode;
};

/**
 * Paper component
 * @category Components
 * @param {React.Node} children Children elements
 * @return {React.Component} <Paper /> component
 * ""
 * @example
 *
 * return (
 *   <Paper>
 *      Example paper
 *   </Paper>
 * )
 */
const Paper = ({ children }: PaperProps) => {
  return <MaterialPaper>{children}</MaterialPaper>;
};

export default Paper;
