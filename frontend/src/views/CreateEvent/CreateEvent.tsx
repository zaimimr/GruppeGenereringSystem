import DateFnsUtils from '@date-io/date-fns';
import { Grid, List, ListItem, Typography } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Button from 'components/Button';
import Paper from 'components/Paper';
import TextField from 'components/TextField';
import React from 'react';
import { useForm } from 'react-hook-form';

import DatePicker from './components/DatePicker';
import TimePicker from './components/TimePicker';

type ICreateEventInput = {
  title: string;
  ingress: string;
  place: string;
  date: string;
  time: string;
  description: string;
  minimumPerGroup: number;
  maximumPerGroup: number;
};

type IInputFields = {
  id: string;
  rows?: number;
  multiline?: boolean;
  name: string;
  label: string;
  type?: string;
  required?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: any;
};
const InputFields = ({ id, rows = 1, multiline = false, name, label, type = 'string', control, error, required = undefined, rules }: IInputFields) => {
  return (
    <ListItem>
      <TextField
        control={control}
        defaultValue={''}
        error={error}
        fullWidth
        id={id}
        label={label}
        multiline={multiline}
        name={name}
        required={required}
        rows={rows}
        rules={rules}
        type={type}
      />
    </ListItem>
  );
};
function CreateEvent() {
  const { control, handleSubmit, getValues, errors } = useForm<ICreateEventInput>();

  const onSubmit = handleSubmit((data) => {
    // TODO
    // Do something with the formData
    /* const formData: IEventData = {
      title: data.title,
      ingress: data.ingress,
      place: data.place,
      date: data.date,
      time: data.time,
      description: data.description,
      filters: [
        {
          minimum: data.minimumPerGroup,
          maximum: data.maximumPerGroup,
        },
      ],
    };
    console.log(formData);
    */
  });

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Paper>
        <Typography variant='h1'>Opprett arrangement</Typography>
        <form noValidate onSubmit={onSubmit}>
          <List disablePadding>
            <InputFields control={control} error={errors.title} id='event_title' label='Tittel' name='title' required='Påkrevd' />
            <InputFields control={control} error={errors.ingress} id='event_ingress' label='Ingress' name='ingress' required='Påkrevd' />
            <InputFields control={control} error={errors.place} id='event_place' label='Sted' name='place' />
            <ListItem>
              <Grid container justify={'space-around'} spacing={2}>
                <Grid item sm={6} xs={12}>
                  <DatePicker control={control} defaultValue={new Date()} error={errors.date} id='event_date' label='Dato' name='date' />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TimePicker control={control} defaultValue={new Date()} error={errors.time} id='event_time' label='Tid' name='time' />
                </Grid>
              </Grid>
            </ListItem>
            <InputFields control={control} error={errors.date} id='event_description' label='Beskrivelse' multiline name='description' rows={8} />
            <Grid container justify='space-around' spacing={2}>
              <Grid item sm={6} xs={12}>
                <InputFields
                  control={control}
                  error={errors.minimumPerGroup}
                  id='event_minimumPerGroup'
                  label='Minimum per gruppe'
                  name='minimumPerGroup'
                  rules={{
                    min: {
                      value: 0,
                      message: 'Må være større eller lik 0',
                    },
                  }}
                  type='number'
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputFields
                  control={control}
                  error={errors.maximumPerGroup}
                  id='event_maximumPerGroup'
                  label='Maksimum per gruppe'
                  name='maximumPerGroup'
                  rules={{
                    min: {
                      value: 1,
                      message: 'Må være større enn 0',
                    },
                    validate: (value: number) => value >= getValues('minimumPerGroup') || 'Maksimum per gruppe må være større eller lik minimum',
                  }}
                  type='number'
                />
              </Grid>
            </Grid>

            <Button fullWidth label='Opprett arrangement' onClick={() => null} type='submit' />
            <Button fullWidth label='Gå tilbake til dashboard' link onClick={() => null} />
          </List>
        </form>
      </Paper>
    </MuiPickersUtilsProvider>
  );
}

export default CreateEvent;
