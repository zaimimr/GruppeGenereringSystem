import { Backdrop, Box, CircularProgress, Theme, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import React from 'react';

/**
 * LoadingScreenProps
 * @category Types
 * @alias LoadingScreenProps
 * @typedef {object} LoadingScreenProps
 * @property {string} message Message displayed with the loading screen
 */
export type LoadingScreenProps = {
  message: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
    },
  }),
);
/**
 * LoadingScreen component
 *
 * @category Components
 * @param {string} message  Loadingscreen message
 * @return {React.Component} <LoadingScreen /> component
 *
 * ""
 * @example
 *
 * return (
 *   <LoadingScreenProps message="Example loadingscreen" />
 * )
 */
function LoadingScreen({ message }: LoadingScreenProps) {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open>
      <Box alignContent='center' display='flex' flexDirection='column'>
        <CircularProgress color='inherit' style={{ margin: 'auto' }} />
        <Typography variant='h2'>{message}</Typography>
      </Box>
    </Backdrop>
  );
}

export default LoadingScreen;
