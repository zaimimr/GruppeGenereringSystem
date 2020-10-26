import { List, ListItem, Typography } from '@material-ui/core';
import Button from 'components/Button';
import LoadingScreen from 'components/LoadingScreen';
import Paper from 'components/Paper';
import TextField from 'components/TextField';
import useSnackbar from 'context/SnakbarContext';
import { Failure, Initial, Loading, Success } from 'lemons';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { signUp } from 'utils/axios';

type IRegistrateInput = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
};

function SignUp() {
  const { control, handleSubmit, watch, errors } = useForm<IRegistrateInput>();
  const [submitFormLazy, setSubmitFormLazy] = React.useState(Initial());
  const { showSnackbar } = useSnackbar();
  const history = useHistory();

  const onSubmit = handleSubmit((data: IRegistrateInput) => {
    setSubmitFormLazy(Loading());
    signUp(data)
      .then(() => {
        setSubmitFormLazy(Success('Suksess'));
        showSnackbar('success', 'Bruker er nå registrert');
        history.push('/');
      })
      .catch((err) => {
        setSubmitFormLazy(Failure(err.response?.data));
        showSnackbar('error', 'En feil har skjedd');
      });
  });
  return (
    <>
      {submitFormLazy.dispatch(
        () => null,
        () => (
          <LoadingScreen message={'Registrerer bruker...'} />
        ),
        () => null,
        () => null,
      )}
      <Paper>
        <form autoComplete='off' noValidate onSubmit={onSubmit}>
          <List disablePadding>
            <ListItem>
              <Typography variant='h1'>Registrering</Typography>
            </ListItem>
            <ListItem>
              <TextField control={control} error={errors.name} fullWidth id='registration_name' label='Navn' name='name' required='Påkrevd' />
            </ListItem>
            <ListItem>
              <TextField
                control={control}
                error={errors.email}
                fullWidth
                id='registration_email'
                label='E-post'
                name='email'
                required='Påkrevd'
                rules={{
                  pattern: {
                    // eslint-disable-next-line
                value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Må være en gyldig e-post',
                  },
                }}
              />
            </ListItem>
            <ListItem>
              <TextField
                control={control}
                error={errors.password}
                fullWidth
                id='registration_password'
                label='Passord'
                name='password'
                required='Påkrevd'
                type='password'
              />
            </ListItem>
            <ListItem>
              <TextField
                control={control}
                error={errors.repeatPassword}
                fullWidth
                id='registration_repeat_password'
                label='Repeter passord'
                name='repeatPassword'
                required='Påkrevd'
                rules={{
                  validate: (value: string) => value === watch('password') || 'Passordene samsvarer ikke',
                }}
                type='password'
              />
            </ListItem>

            <ListItem>
              <Button fullWidth label='Registrer' onClick={() => null} type='submit' />
            </ListItem>
            <ListItem>
              <Button fullWidth label='Allerede registrert?' link onClick={() => history.push('/')} />
            </ListItem>
          </List>
        </form>
      </Paper>
    </>
  );
}

export default SignUp;
