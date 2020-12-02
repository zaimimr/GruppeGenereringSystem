import DateFnsUtils from '@date-io/date-fns';
import { Grid, List, ListItem, Typography } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Button from 'components/Button';
import HelperTooltip from 'components/HelperTooltip';
import Paper from 'components/Paper';
import TextField from 'components/TextField';
import { useEvents } from 'context/EventContext';
import useSnackbar from 'context/SnakbarContext';
import dateFormat from 'dateformat';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { createEvent, getEvents, updateEvent } from 'utils/axios';
import { CreateEventData, IEvent } from 'utils/types';
import { inputNumberParser } from 'views/Filter/Filter';

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
/**
 * EventForm
 * @category Views
 * @subcategory EventForm
 * @return {React.Component} <EventForm /> component
 * ""
 * @example
 *
 * return (
 *   <EventForm />
 * )
 */
function EventForm() {
  const { control, handleSubmit, getValues, errors, setValue } = useForm<ICreateEventInput>();
  const { showSnackbar } = useSnackbar();
  const history = useHistory();
  const { eventId }: { eventId: string } = useParams();
  const [events, setEvents] = useEvents();

  React.useEffect(() => {
    const currentEvent = events?.find((event: IEvent) => event.id === eventId);
    if (currentEvent) {
      setValue('title', currentEvent.title);
      setValue('ingress', currentEvent.ingress);
      setValue('place', currentEvent.place);
      setValue('date', currentEvent.date);
      setValue('time', currentEvent.time);
      setValue('description', currentEvent.description);
      setValue('minimumPerGroup', currentEvent.minimumPerGroup);
      setValue('maximumPerGroup', currentEvent.maximumPerGroup);
    }
    // eslint-disable-next-line
  }, [eventId, events]);

  const onSubmit = handleSubmit((data) => {
    const time = dateFormat(data.date, 'dd/mm/yyyy') + ' ' + dateFormat(data.time, 'HH:MM');
    const formData: CreateEventData = {
      title: data.title,
      ingress: data.ingress,
      place: data.place,
      time: time,
      description: data.description,
      minimumPerGroup: data.minimumPerGroup,
      maximumPerGroup: data.maximumPerGroup,
    };
    eventId
      ? updateEvent(formData, eventId)
      : createEvent(formData)
          .then((response) => {
            showSnackbar('success', `Arrangementet ble ${eventId ? 'oppdatert' : 'opprettet'}!`);
            getEvents().then((res: { data: Event[] }) => {
              setEvents(res.data);
            });

            history.push(`${eventId ? `/event/${response.data.id}` : '/'}`);
          })
          .catch(() => {
            showSnackbar('error', 'Noe gikk galt');
          });
  });

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Paper>
        <Typography gutterBottom variant='h4'>
          {eventId ? 'Endre arrangement' : 'Opprett arrangement'}
        </Typography>
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
            <Grid container justify='flex-end'>
              <Grid item>
                <HelperTooltip
                  helperText={`Her har du mulighet til å sette minimum og maximum deltagere per gruppe
            `}
                  placement='top-end'
                />
              </Grid>
            </Grid>
            <Grid container justify={'space-around'} spacing={2}>
              <Grid item sm={6} xs={12}>
                <InputFields
                  control={control}
                  error={errors.minimumPerGroup}
                  id='event_minimumPerGroup'
                  label='Minimum per gruppe'
                  name='minimumPerGroup'
                  rules={{
                    min: {
                      value: 1,
                      message: 'Må være større enn 0',
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
                    validate: (value: number) =>
                      value >= inputNumberParser(getValues('minimumPerGroup')) || 'Maksimum per gruppe må være større eller lik minimum',
                  }}
                  type='number'
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Button fullWidth label={eventId ? 'Oppdater arrangement' : 'Opprett arrangement'} onClick={() => null} type='submit' />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Button fullWidth label='Gå tilbake' link onClick={() => history.push(eventId ? `/event/${eventId}` : '/')} />
              </Grid>
            </Grid>
          </List>
        </form>
      </Paper>
    </MuiPickersUtilsProvider>
  );
}

export default EventForm;
