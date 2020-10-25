import { AppBar, Avatar, Grid, IconButton, Typography } from '@material-ui/core';
import { useSetUser } from 'context/UserContext';
import React from 'react';

function Navbar() {
  const [user] = useSetUser();

  return (
    <>
      <AppBar color='transparent' position='absolute'>
        <Grid container justify='space-between'>
          <Grid item>
            <Typography onClick={() => null} variant='h5'>
              Gen-G
            </Typography>
          </Grid>
          <Grid item>
            {user && (
              <IconButton onClick={() => null}>
                <Avatar>
                  {user.name
                    ?.split(' ')
                    .map((n: string) => n[0])
                    .join('.')}
                </Avatar>
              </IconButton>
            )}
          </Grid>
        </Grid>
      </AppBar>
    </>
  );
}

export default Navbar;
