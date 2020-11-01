import { Grid, Typography } from '@material-ui/core';
import Button from 'components/Button';
import LoadingScreen from 'components/LoadingScreen';
import Paper from 'components/Paper';
import TextField from 'components/TextField';
import useSnackbar from 'context/SnakbarContext';
import { useSetUser } from 'context/UserContext';
import { Failure, Initial, Loading, Success } from 'lemons';
import React from 'react';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { login } from 'utils/axios';
import { ILoginCredentials } from 'utils/types';

function Login() {
  // eslint-disable-next-line new-cap
  const [submitFormLazy, setSubmitFormLazy] = React.useState(Initial());
  const { showSnackbar } = useSnackbar();
  const [, setUser] = useSetUser();
  const [, setCookie] = useCookies(['access_token']);
  const history = useHistory();

  const { errors, handleSubmit, control } = useForm();

  const onSubmit = handleSubmit((loginCredentials: ILoginCredentials) => {
    setSubmitFormLazy(Loading());
    login(loginCredentials)
      .then((response) => {
        setSubmitFormLazy(Success(response.data));
        setUser(response.data);
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        setCookie('access_token', response.data.token, { path: '/', expires: expirationDate, sameSite: true });
      })
      .catch((err) => {
        setSubmitFormLazy(Failure(err.response.data));
        showSnackbar('error', err.response.data);
      });
  });

  return (
    <>
      {submitFormLazy.dispatch(
        () => null,
        () => (
          <LoadingScreen message={'Forsøker å logge inn...'} />
        ),
        () => null,
        () => null,
      )}
      <Paper>
        <form autoComplete='off' noValidate onSubmit={onSubmit}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Typography gutterBottom variant='h1'>
                Logg inn
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                control={control}
                error={errors.email}
                fullWidth
                id={'email_input_field'}
                label={'E-post'}
                name={'email'}
                required={'E-post felt er påkrevd'}
                rules={{
                  // eslint-disable-next-line
                  pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                control={control}
                error={errors.password}
                fullWidth
                id={'password_input_field'}
                label={'Passord'}
                name={'password'}
                required={'Passord felt er påkrevd'}
                type={'password'}
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth label={'Logg inn'} onClick={() => null} type={'submit'} />
            </Grid>
            <Grid container item justify='space-between' xs={12}>
              <Grid item sm={6} xs={12}>
                <Button fullWidth label={'Glemt passord?'} link onClick={() => null} />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Button fullWidth label={'Registrer bruker'} link onClick={() => history.push('/signup')} />
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
}

export default Login;
