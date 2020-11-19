import { AppBar, Avatar, createStyles, Dialog, DialogActions, DialogTitle, Grid, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import Button from 'components/Button';
import { useSetUser } from 'context/UserContext';
import React from 'react';
import { useCookies } from 'react-cookie';
import { useModal } from 'react-modal-hook';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(() =>
  createStyles({
    tooltip: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }),
);

function Navbar() {
  const [user, setUser] = useSetUser();
  const history = useHistory();
  const classes = useStyles();
  const [, , removeCookie] = useCookies(['access_token']);

  const [showModal, hideModal] = useModal(
    () => (
      <Dialog aria-labelledby='modal' fullWidth maxWidth={'xs'} onClose={hideModal} open>
        <DialogTitle id='modal-title'>{'Ønsker du å logge ut?'}</DialogTitle>
        <DialogActions>
          <Grid container direction={'row-reverse'} justify={'space-between'} spacing={4}>
            <Grid item md={5} xs={12}>
              <Button
                fullWidth
                label='Logg ut'
                onClick={() => {
                  removeCookie('access_token');
                  setUser();
                  history.push('/');
                  hideModal();
                }}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Button fullWidth label='Avbryt' link onClick={hideModal} />
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    ),
    [],
  );
  return (
    <>
      <AppBar color='transparent' position='absolute'>
        <Grid container justify='space-between'>
          <Grid item>
            <Tooltip aria-label='til hovedsiden' arrow title='Til hovedsiden'>
              <Typography className={classes.tooltip} onClick={() => history.push('/')} variant='h5'>
                Gen-G
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item>
            {user && (
              <Tooltip aria-label='logg ut' arrow title='Logg ut'>
                <IconButton onClick={() => showModal()}>
                  <Avatar>
                    {user.name
                      ?.split(' ')
                      .map((n: string) => n[0])
                      .join('.')}
                  </Avatar>
                </IconButton>
              </Tooltip>
            )}
          </Grid>
        </Grid>
      </AppBar>
    </>
  );
}

export default Navbar;
